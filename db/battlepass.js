const { query, pool } = require("./index");
const tx = require(`pg-tx`);
const Cosmetics = require("./cosmetics");

module.exports = {
  async createBattlePass(levels) {
    try {
      const { rows } = await query(
        `INSERT INTO battle_pass DEFAULT VALUES RETURNING *`
      );
      const battlePassID = rows[0].battle_pass_id;

      for (const levelData of levels) {
        const { level, nextLevelXp, totalXp, cosmetics, coins, free } =
          levelData;
        await query(
          `
            INSERT INTO battle_pass_levels (battle_pass_id, bp_level, next_level_xp, total_xp, coins_reward)
            VALUES ($1, $2, $3, $4, $5)`,
          [battlePassID, level, nextLevelXp, totalXp, coins]
        );
        for (const cosmeticName of cosmetics) {
          const queryResult = await query(
            `SELECT * FROM cosmetics WHERE cosmetic_name = $1`,
            [cosmeticName]
          );
          const { cosmetic_id } = queryResult.rows[0];
          await query(
            `
            INSERT INTO battle_pass_cosmetic_rewards (battle_pass_id, bp_level, free, cosmetic_id)
            VALUES ($1, $2, $3, $4)`,
            [battlePassID, level, free, cosmetic_id]
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
        WHERE battle_pass_id = $1
        ORDER BY bp_level
        `,
        [battlePassID]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  /**
   * @param {number} battlePassID
   *
   * @returns {Promise<
   * {
   *    next_level_xp: number,
   *    total_xp: number,
   *    bp_level: number,
   *    amount: number,
   *    free: boolean,
   *    cosmetic_id: number,
   *    cosmetic_name: string,
   *    rarity: string
   * }[]
   * }
   **/
  async getBattlePassLevelsAndRewards(battlePassID) {
    try {
      const { rows } = await query(
        `
        SELECT
          battle_pass_levels.next_level_xp, battle_pass_levels.total_xp, battle_pass_levels.bp_level,
          battle_pass_levels.coins_reward,
          battle_pass_cosmetic_rewards.amount, battle_pass_cosmetic_rewards.free,
          cosmetics.cosmetic_id, cosmetics.cosmetic_name, cosmetics.rarity
        FROM battle_pass_levels
        LEFT JOIN battle_pass_cosmetic_rewards
        USING (battle_pass_id, bp_level)
        LEFT JOIN cosmetics
        USING (cosmetic_id)
        WHERE battle_pass_id = $1
        ORDER BY bp_level`,
        [battlePassID]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Calculates what level you would be at given a certain amount of xp.
   * @param {*} battlePassId
   * @param {*} totalXP
   */
  async calculateBattlePassLevel(battlePassId, totalXP) {
    try {
      if (totalXP > 20400) {
        const remainingXp = totalXP - 20400;
        const extraLevels = Math.floor(remainingXp / 255);
        return 80 + extraLevels;
      }
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

  /**
   * Get the required xp at a certain level of the battle pass
   */
  async getRequirementsAtLevel(battlePassId, level) {
    try {
      const { rows } = await query(
        `
        SELECT next_level_xp, total_xp, coins_reward FROM battle_pass_levels
        WHERE battle_pass_id = $1 and bp_level = $2`,
        [battlePassId, level]
      );

      if (rows.length > 0) return rows[0];

      // every level takes 255 xp
      return {
        total_xp: level * 255,
        next_level_xp: 255,
        coins_reward: 0,
      };
    } catch (error) {
      throw error;
    }
  },

  getNumClaimableRewardsAtLevel(level, unlocked) {
    // Until level 80, there is only one reward per level for unlocked
    if (unlocked) {
      if (level <= 80) return level;
      const remaining = level - 80;
      // after 80, there is a reward every 5 levels
      let numRewards = 80 + Math.floor(remaining / 5);
      return numRewards;
    } else {
      // there is a reward at level 1 and every 5 levels, forever
      let numRewards = 1 + Math.floor(level / 5);
      return numRewards;
    }
  },

  async getRewardsFromRange(minLevel, maxLevel, battlePassID) {
    try {
      if (!battlePassID) {
        const activeBattlePass = await this.getActiveBattlePass();
        battlePassID = activeBattlePass.battle_pass_id;
      }
      const { rows } = await query(
        `SELECT coins_reward, bp_level FROM battle_pass_levels
         WHERE bp_level >= $1 AND bp_level <= $2 AND battle_pass_id = $3 AND coins_reward > 0`,
        [minLevel, maxLevel, battlePassID]
      );
      const coinRewards = []
      for (const level of rows) {
        if (level.coins_reward > 0) {
          coinRewards.push({
            coins: level.coins_reward,
            bp_level: level.bp_level,
            free: level % 5 === 0,
          })
        }
      }

      let { rows: cosmetics } = await query(
        `
        SELECT cosmetic_id, amount, free, bp_level
        FROM battle_pass_cosmetic_rewards
        WHERE bp_level >= $1 AND bp_level <= $2 AND battle_pass_id = $3`,
        [minLevel, maxLevel, battlePassID]
      );

      const doubledown = await Cosmetics.getCosmeticByName("doubledown");
      const basicChest = await Cosmetics.getCosmeticByName("chest_basic"); 

      for (let i = minLevel; i <= maxLevel; i++) {
        // Special rewards at level 200 and 1000
        if (i === 200) {
          const chessArena = await Cosmetics.getCosmeticByName(
            "terrain_gambit"
          );
          cosmetics.push({
            cosmetic_id: chessArena.cosmetic_id,
            free: true,
            bp_level: i,
            amount: 1,
          });
        } else if (i === 1000) {
          const gabenArena = await Cosmetics.getCosmeticByName("terrain_gaben");
          cosmetics.push({
            cosmetic_id: gabenArena.cosmetic_id,
            free: true,
            bp_level: i,
            amount: 1,
          });
        }
        // After Level 80, every 5 levels alternates between a War Chest (chest_basic) and a doubledown
        else if (i > 80) {
          if (i % 10 === 0) {
            cosmetics.push({
              cosmetic_id: doubledown.cosmetic_id,
              free: true,
              bp_level: i,
              amount: 1,
            });
          } else if (i % 5 === 0) {
            cosmetics.push({
              cosmetic_id: basicChest.cosmetic_id,
              free: true,
              bp_level: i,
              amount: 1,
            });
          }
        }
      }
      return { coinRewards, cosmetics };
    } catch (error) {
      throw error;
    }
  },

  async getAllPlayersWithUnclaimedRewards() {
    try {
      const { rows } = await query(
        `
        SELECT count(*), bp_level
        FROM player_claimed_battle_pass_rewards
        JOIN player_battle_pass USING (steam_id)
        GROUP BY steam_id
        `
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getPlayerLevelFreqs() {
    try {
      const { rows } = await query(
        `
        SELECT count(*) :: integer, bp_level
        FROM player_battle_pass
        WHERE bp_level > 1
        GROUP BY bp_level
        ORDER BY bp_level
        `
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async deleteBattlePasses() {
    try {
      await tx.default(pool, async (db) => {
        await db.query(`DELETE FROM player_claimed_battle_pass_rewards`);
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
