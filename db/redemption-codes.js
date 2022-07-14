const { query } = require("./index");

module.exports = {
  async getAllCodes() {
    try {
      const { rows } = await query(
        `
        SELECT * FROM redemption_codes JOIN cosmetics USING (cosmetic_id)
        ORDER BY created_at DESC`
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getCode(code) {
    try {
      const { rows } = await query(
        "SELECT * FROM redemption_codes WHERE code = $1",
        [code]
      );
      if (!rows[0]) return null;
      const players = await this.getNumPlayers(code);
      return {
        ...rows[0],
        players,
      };
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

  async getNumPlayers(code) {
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

  async addRedemptionCode(code, cosmeticID) {
    try {
      await query(
        "INSERT INTO redemption_codes (code, cosmetic_id) VALUES ($1, $2)",
        [code, cosmeticID]
      );
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

  async changeRedemptionCodeReward(code, cosmeticID) {
    try {
      await query(
        "UPDATE redemption_codes SET cosmetic_id = $2 WHERE code = $1",
        [code, cosmeticID]
      );
    } catch (error) {
      throw error;
    }
  },

  async changeRedemptionCodeCode(oldCode, newCode) {
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
