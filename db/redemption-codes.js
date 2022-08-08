const { query } = require("./index");

module.exports = {
  async getAllCodes() {
    try {
      const { rows } = await query(
        `
        SELECT redemption_codes.*,
        json_agg(json_build_object(
          'cosmetic_id', cosmetic_id,
          'cosmetic_name', cosmetic_name
        )) AS rewards
        FROM redemption_codes
        LEFT JOIN redemption_code_rewards USING (code)
        LEFT JOIN cosmetics USING (cosmetic_id)
        GROUP BY code
        ORDER BY created_at DESC`
      );
      const codeRedemptions = await this.getAllCodesNumRedeeemed();
      const codes = rows.map((code) => ({
        ...code,
        rewards: code.rewards[0].cosmetic_id ? code.rewards : [],
        num_redeemed: Number(
          codeRedemptions.find((c) => c.code === code.code)?.num_redeemed || 0
        ),
      }));
      return codes;
    } catch (error) {
      throw error;
    }
  },

  async getAllCodesNumRedeeemed() {
    try {
      const { rows } = await query(
        `
        SELECT code,
        COUNT(*) AS num_redeemed
        FROM player_redeemed_codes
        GROUP BY code`
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getCode(code) {
    try {
      const { rows } = await query(
        `
        SELECT * FROM redemption_codes
        WHERE code = $1`,
        [code]
      );
      if (!rows[0]) return null;
      const rewards = await this.getRewards(code);
      const redeemed = await this.getNumRedeemed(code);
      return {
        ...rows[0],
        redeemed,
        rewards,
      };
    } catch (error) {
      throw error;
    }
  },

  async getRewards(code) {
    try {
      const { rows } = await query(
        `
        SELECT cosmetic_id FROM redemption_code_rewards
        WHERE code = $1`,
        [code]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getCodePlayers(code) {
    try {
      const { rows } = await query(
        `
        SELECT players.steam_id, username, date_claimed
        FROM player_redeemed_codes
        JOIN players USING (steam_id)
        WHERE code = $1`,
        [code]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getNumRedeemed(code) {
    try {
      const { rows } = await query(
        `
        SELECT count(*) AS num_players
        FROM player_redeemed_codes
        WHERE code = $1`,
        [code]
      );
      return rows[0].num_players;
    } catch (error) {
      throw error;
    }
  },

  async exists(code) {
    try {
      const { rows } = await query(
        "SELECT * FROM redemption_codes WHERE code = $1",
        [code]
      );
      return rows[0] ? true : false;
    } catch (error) {
      throw error;
    }
  },

  async addRedemptionCode(code, redemptionLimit, cosmeticIDs, coins = 0) {
    try {
      await query(
        "INSERT INTO redemption_codes (code, coins, redemption_limit) VALUES ($1, $2, $3)",
        [code, coins, redemptionLimit]
      );
      for (const cosmeticID of cosmeticIDs) {
        await query(
          "INSERT INTO redemption_code_rewards (code, cosmetic_id) VALUES ($1, $2)",
          [code, cosmeticID]
        );
      }
      const created = await this.getCode(code);
      return created;
    } catch (error) {
      throw error;
    }
  },

  async setRedemptionCodeActive(code, active) {
    try {
      await query("UPDATE redemption_codes SET active = $2 WHERE code = $1", [
        code,
        active,
      ]);
    } catch (error) {
      throw error;
    }
  },

  async updateRedemptionCodeRewards(code, cosmeticIDs) {
    try {
      await query("DELETE FROM redemption_code_rewards WHERE code = $1", [
        code,
      ]);
      for (const cosmeticID of cosmeticIDs) {
        await query(
          "INSERT INTO redemption_code_rewards (code, cosmetic_id) VALUES ($1, $2)",
          [code, cosmeticID]
        );
      }
      const updated = await this.getCode(code);
      return updated;
    } catch (error) {
      throw error;
    }
  },

  async updateRedemptionCodeCode(oldCode, newCode) {
    try {
      await query("UPDATE redemption_codes SET code = $2 WHERE code = $1", [
        oldCode,
        newCode,
      ]);
    } catch (error) {
      throw error;
    }
  },
};
