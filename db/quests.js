const { query } = require("./index");

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
        `SELECT * FROM quests WHERE is_achievement = FALSE AND is_weekly = FALSE`
      );
      return rows;
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

  /**
   * Creates a new quest, either a daily quest or achievement
   * @param {*} QuestValues
   */
  async addNewQuest({
    name,
    isAchievement,
    description,
    poggers: coins,
    xp,
    stat,
    requiredAmount,
    title,
    isWeekly,
  }) {
    if (!isWeekly) isWeekly = false;
    try {
      const sql_query = `
      INSERT INTO quests (quest_name, is_achievement, quest_description,
        coin_reward, xp_reward, stat, required_amount, title_reward, is_weekly)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
      `;
      const { rows } = await query(sql_query, [
        name,
        isAchievement,
        description,
        coins,
        xp,
        stat,
        requiredAmount,
        title,
        isWeekly,
      ]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async removeQuest({
    name,
    isAchievement,
    description,
    poggers: coins,
    xp,
    stat,
    requiredAmount,
    title,
    isWeekly,
  }) {
    if (!isWeekly) isWeekly = false;
    try {
      await query(
        `
      DELETE FROM quests WHERE 
      quest_name = $1 AND is_achievement = $2 AND quest_description = $3 AND
      coin_reward = $4 AND xp_reward = $5 AND stat = $6 AND
      required_amount = $7 AND title_reward = $8 AND is_weekly = $9
      `,
        [
          name,
          isAchievement,
          description,
          coins,
          xp,
          stat,
          requiredAmount,
          title,
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
   * @param {String} steamid
   */
  async getAllDailyQuestsForPlayer(steamid) {
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
        [steamid]
      );

      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getAchievementsForPlayer(steamid) {
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
        [steamid]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Only shows the highest active tier of achievements
   * @param {String} steamid
   */
  async getActiveAchievementsForPlayer(steamid) {
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
        [steamid]
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
};
