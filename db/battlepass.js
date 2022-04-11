const { query, pool } = require("./index");
const tx = require(`pg-tx`);

module.exports = {
  async createBattlePass(levels) {
    try {
      const { rows } = await query(
        `INSERT INTO battle_pass DEFAULT VALUES RETURNING *`
      );
      const battlePassID = rows[0].battle_pass_id;

      for (const levelData of levels) {
        const { level, nextLevelXp, totalXp, cosmetics, coins } = levelData;
        await query(
          `
            INSERT INTO battle_pass_levels (battle_pass_id, bp_level, next_level_xp, total_xp, coins_reward)
            VALUES ($1, $2, $3, $4, $5)`,
          [battlePassID, level, nextLevelXp, totalXp, coins]
        );
        for (const cosmetic of cosmetics) {
          const { cosmetic_id } = await query(
            `SELECT * FROM cosmetics WHERE cosmetic_name = $1`,
            [cosmetic]
          );
          await query(
            `
            INSERT INTO battle_pass_cosmetic_rewards (battle_pass_id, bp_level, cosmetic_id)
            VALUES ($1, $2, $3)`,
            [battlePassID, level, cosmetic_id]
          );
        }
      }

      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async setActiveBattlePass(battlePassID) {
    try {
      await query(
        `UPDATE battle_pass SET is_active = true WHERE battle_pass_id = $1`,
        [battlePassID]
      );
      console.log(`Battle pass ${battlePassID} is now active`);
    } catch (error) {
      throw error;
    }
  },

  async getActiveBattlePass() {
    try {
      const { rows } = await query(
        `SELECT * FROM battle_pass WHERE is_active = true ORDER BY created DESC LIMIT 1`
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getBattlePassLevels(battlePassID) {
    try {
      const { rows } = await query(
        `
        SELECT * FROM battle_pass_levels
        ORDER BY bp_level
        WHERE battle_pass_id = $1`,
        [battlePassID]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getBattlePassLevelsAndRewards(battlePassID) {
    try {
      const { rows } = await query(
        `
        SELECT * FROM battle_pass_levels
        LEFT JOIN battle_pass_cosmetic_rewards
        USING (battle_pass_id, bp_level)
        ORDER BY bp_level
        WHERE battle_pass_id = $1`,
        [battlePassID]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  /**
   * Expects a battle pass from getBattlePass, ordered by level
   * Calculates what level you would be at given a certain amount
   * of xp.
   * @param {*} battlePassId
   * @param {*} totalXP
   */
  async calculateBattlePassLevel(battlePassId, totalXP) {
    try {
      const battlePassLevels = await this.getBattlePassLevels(battlePassId);
      let lastLevel = 0;
      for (const level of battlePassLevels) {
        const { total_xp } = level;
        if (totalXP < total_xp) {
          return lastLevel;
        }
        lastLevel++;
      }
      return lastLevel;
    } catch (error) {
      throw error;
    }
  },

  async getBattlePassRewardsFromRange(minLevel, maxLevel) {
    try {
      const { rows } = await query(
        `SELECT coins_reward FROM battle_pass_levels WHERE bp_level >= $1 AND bp_level <= $2`,
        [minLevel, maxLevel]
      );
      const coins = rows.reduce((acc, cur) => {
        return acc + cur.coins_reward;
      }, 0);

      const { rows: cosmetics } = await query(
        `
        SELECT cosmetic_id, amount
        FROM battle_pass_cosmetic_rewards
        WHERE bp_level >= $1 AND bp_level <= $2`,
        [minLevel, maxLevel]
      );

      return { coins, cosmetics };
    } catch (error) {
      throw error;
    }
  },

  // ONLY FOR TESTING
  async deleteBattlePasses() {
    try {
      await tx.default(pool, async (db) => {
        await db.query(`DELETE FROM player_battle_pass`);
        await db.query(`DELETE FROM battle_pass_cosmetic_rewards`);
        await db.query(`DELETE FROM battle_pass_levels`);
        await db.query(`DELETE FROM battle_pass`);
      });

      return;
    } catch (error) {
      throw error;
    }
  },
};
