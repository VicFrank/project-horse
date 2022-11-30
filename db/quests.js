const { query } = require("./index");
const Cosmetics = require("./cosmetics");

module.exports = {
  async getQuest(questID) {
    try {
      const { rows } = await query(`SELECT * FROM quests WHERE quest_id = $1`, [
        questID,
      ]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getAllQuests() {
    try {
      const { rows } = await query(`SELECT * FROM quests`);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getAllDailyQuests() {
    try {
      const { rows } = await query(
        `SELECT quests.*, cosmetics.cosmetic_name
        FROM quests
        LEFT JOIN cosmetics ON quests.cosmetic_id = cosmetics.cosmetic_id
        WHERE is_achievement = FALSE AND is_weekly = FALSE`
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async deleteAllDailyQuests() {
    try {
      await query(
        `DELETE FROM player_quests WHERE quest_id IN
          (SELECT quest_id FROM quests WHERE is_achievement = FALSE AND is_weekly = FALSE)`
      );
      await query(
        "DELETE FROM quests WHERE is_achievement = FALSE AND is_weekly = FALSE"
      );
      return;
    } catch (error) {
      throw error;
    }
  },

  async getAllWeeklyQuests() {
    try {
      const { rows } = await query(
        `SELECT * FROM quests WHERE is_achievement = FALSE AND is_weekly = TRUE`
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getAllAchievements() {
    try {
      const { rows } = await query(
        `SELECT * FROM quests WHERE is_achievement = TRUE`
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  /**
   * @param {String} stat
   */
  async getAllQuestsWithStat(stat) {
    try {
      const { rows } = await query(`SELECT * FROM quests WHERE stat = $1`, [
        stat,
      ]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async createQuest(quest) {
    const { name, coins, xp, stat, requiredAmount, description, cosmeticName } =
      quest;
    let { isAchievement, isWeekly, hidden } = quest;
    if (!isWeekly) isWeekly = false;
    if (!hidden) hidden = false;
    if (!isAchievement) isAchievement = false;
    try {
      let cosmeticID = null;
      if (cosmeticName) {
        const cosmetic = await Cosmetics.getCosmeticByName(cosmeticName);
        cosmeticID = cosmetic.cosmetic_id;
      }
      const { rows } = await query(
        `INSERT INTO quests (quest_name, is_achievement, quest_description,
          coin_reward, xp_reward, stat, required_amount, is_weekly, is_hidden, cosmetic_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
        `,
        [
          name,
          isAchievement,
          description,
          coins,
          xp,
          stat,
          requiredAmount,
          isWeekly,
          hidden,
          cosmeticID,
        ]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async bulkCreateQuests(quests) {
    try {
      for (const quest of quests) {
        await this.createQuest(quest);
      }
    } catch (error) {
      throw error;
    }
  },

  async removeQuest(quest) {
    const { name, description, coins, xp, stat, requiredAmount } = quest;
    const { isAchievement, isWeekly } = quest;
    if (!isWeekly) isWeekly = false;
    try {
      await query(
        `DELETE FROM quests WHERE 
        quest_name = $1 AND is_achievement = $2 AND quest_description = $3 AND
        coin_reward = $4 AND xp_reward = $5 AND stat = $6 AND required_amount = $7 AND is_weekly = $8
        `,
        [
          name,
          isAchievement,
          description,
          coins,
          xp,
          stat,
          requiredAmount,
          isWeekly,
        ]
      );
    } catch (error) {
      throw error;
    }
  },

  /**
   * Gets all 3 daily quests from a player, regardless
   * of their battle pass tier
   * @param {String} steamID
   */
  async getAllDailyQuestsForPlayer(steamID) {
    try {
      const { rows } = await query(
        `
      SELECT pq.*, q.*
      FROM player_quests pq
      JOIN quests q
      USING (quest_id)
      JOIN players p
      USING (steam_id)
      WHERE steam_id = $1 AND q.is_achievement = FALSE AND is_weekly = FALSE
      ORDER BY quest_index DESC
      `,
        [steamID]
      );

      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getAchievementsForPlayer(steamID) {
    try {
      const { rows } = await query(
        `
      SELECT *,
        LEAST(quest_progress, required_amount) as capped_quest_progress,
        quest_progress >= required_amount as quest_completed
      FROM quests q
      JOIN player_quests USING (quest_id)
      WHERE q.is_achievement = TRUE AND steam_id = $1
	    ORDER BY quest_id
      `,
        [steamID]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Only shows the highest active tier of achievements
   * @param {String} steamID
   */
  async getActiveAchievementsForPlayer(steamID) {
    try {
      const { rows } = await query(
        `
        SELECT *,
          LEAST(quest_progress, required_amount) as capped_quest_progress,
          quest_progress >= required_amount as quest_completed
        FROM quests q
        JOIN player_quests USING (quest_id)
        WHERE q.is_achievement = TRUE AND steam_id = $1
        ORDER BY quest_id
      `,
        [steamID]
      );

      // Group by stat
      let stats = new Set();
      for (let quest of rows) {
        const { stat } = quest;
        stats.add(stat);
      }

      let activeAchievements = [];
      for (let stat of stats) {
        // Get the highest achievement of this stat that is not claimed
        let statQuests = rows.filter((quest) => quest.stat == stat);
        statQuests.sort((q1, q2) => q1.required_amount - q2.required_amount);

        let questToAdd;
        let questTier = 1;
        for (let quest of statQuests) {
          if (!quest.claimed) {
            questToAdd = quest;
            break;
          }
          questTier++;
        }
        if (!questToAdd) questToAdd = statQuests.slice(-1).pop();
        // questTier is one too high if it's the final tier
        if (questTier > statQuests.length) {
          questTier--;
        }

        activeAchievements.push({ ...questToAdd, questTier });
      }

      return activeAchievements;
    } catch (error) {
      throw error;
    }
  },

  //////////////////////////////////////////////////////////////////////////////
  // Login Quests (aka "Weekly Quests")
  // These are quests that you complete simply by claiming them each day
  //////////////////////////////////////////////////////////////////////////////

  async clearLoginQuests() {
    try {
      await query(`DELETE FROM player_login_quests`);
      await query(`DELETE FROM login_quests`);
      return;
    } catch (error) {
      throw error;
    }
  },

  async createLoginQuest(day, coins, xp, cosmeticID) {
    try {
      const { rows } = await query(
        `INSERT INTO login_quests (day, coin_reward, xp_reward, cosmetic_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [day, coins, xp, cosmeticID]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getLoginQuests() {
    try {
      const { rows } = await query(
        `SELECT * FROM login_quests ORDER BY day ASC`
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  //////////////////////////////////////////////////////////////////////////////
  // Welcome Quests
  //////////////////////////////////////////////////////////////////////////////

  async clearWelcomeQuests() {
    try {
      await query(`DELETE FROM player_welcome_quests`);
      await query(`DELETE FROM welcome_quests`);
      return;
    } catch (error) {
      throw error;
    }
  },

  async createWelcomeQuest(day, coins, xp, cosmeticID) {
    try {
      const { rows } = await query(
        `INSERT INTO welcome_quests (day, coin_reward, xp_reward, cosmetic_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [day, coins, xp, cosmeticID]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getWelcomeQuests() {
    try {
      const { rows } = await query(
        `SELECT * FROM welcome_quests
        LEFT JOIN cosmetics
        USING (cosmetic_id)
        ORDER BY day ASC`
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },
};
