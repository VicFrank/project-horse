const { query } = require("./index");
const Cosmetics = require("./cosmetics");
const Logs = require("./logs");
const Quests = require("./quests");

module.exports = {
  // --------------------------------------------------
  // Read Functions
  // --------------------------------------------------

  async getAllPlayers(limit = 100, offset = 0) {
    try {
      const { rows } = await query(
        `
      SELECT p.*, count(*) as games
        FROM players as p
        JOIN game_players as gp
        USING (steam_id)
        GROUP BY p.steam_id
        ORDER BY games DESC
        LIMIT $1 OFFSET $2
      `,
        [limit, offset]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getLeaderboard() {
    try {
      const { rows } = await query(`
      select * from players
      ORDER BY mmr DESC
      LIMIT 100
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getPlayer(steamid) {
    try {
      const { rows } = await query(
        `SELECT * FROM players WHERE steam_id = $1`,
        [steamid]
      );
      const player = rows[0];
      if (player) {
        const rank = await this.getLeaderboardPosition(player.mmr);
        player.rank = rank;
      }
      return player;
    } catch (error) {
      throw error;
    }
  },

  async getStats(steamid) {
    try {
      const { rows } = await query(
        `SELECT * FROM players WHERE steam_id = $1`,
        [steamid]
      );
      const player = rows[0];
      if (!player) return null;

      const rank = await this.getLeaderboardPosition(player.mmr);
      player.rank = rank;

      return player;
    } catch (error) {
      throw error;
    }
  },

  async doesPlayerExist(steamid) {
    const result = await query(`SELECT * FROM players WHERE steam_id = $1`, [
      steamid,
    ]);
    return result.rows.length > 0;
  },

  async getLeaderboardPosition(mmr) {
    try {
      const { rows } = await query(
        `SELECT count(*) FROM players WHERE mmr > $1`,
        [mmr]
      );
      return parseInt(rows[0].count) + 1;
    } catch (error) {
      throw error;
    }
  },

  async getCoins(steamid) {
    try {
      const { rows } = await query(
        `SELECT coins FROM players WHERE steam_id = $1`,
        [steamid]
      );
      if (rows[0]) return rows[0].coins;
      return 0;
    } catch (error) {
      throw error;
    }
  },

  async getGames(steamid, limit = 100, offset = 0, hours) {
    let whereClause = "";
    if (hours) {
      whereClause = "AND created_at >= NOW() - $4 * INTERVAL '1 HOURS'";
    }
    try {
      const sql_query = `
      SELECT g.*, gp.*
      FROM game_players gp
      JOIN games g
      USING (game_id)
      JOIN players p
      USING (steam_id)
      WHERE p.steam_id = $1
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3;
      `;
      if (hours) {
        const { rows } = await query(sql_query, [
          steamid,
          limit,
          offset,
          hours,
        ]);
        return rows;
      } else {
        const { rows } = await query(sql_query, [steamid, limit, offset]);
        return rows;
      }
    } catch (error) {
      throw error;
    }
  },

  // Return a list of games a player has played today
  async getGamesToday(steamid) {
    try {
      const { rows } = await query(
        `
        SELECT *
        FROM games
        JOIN game_players gp
        USING (game_id)
        JOIN players
        USING (steam_id)
        WHERE steam_id = $1
          AND created_at >= NOW()::date
        ORDER BY created_at DESC`,
        [steamid]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Get the amount of xp a player has earned today
  async getDailyXP(steamid) {
    try {
      const { rows } = await query(
        `
        SELECT sum(xp) as daily_xp
        FROM games
        JOIN game_players gp
        USING (game_id)
        JOIN players
        USING (steam_id)
        WHERE steam_id = $1
          AND created_at >= NOW()::date`,
        [steamid]
      );
      return rows[0].daily_xp || 0;
    } catch (error) {
      throw error;
    }
  },

  // --------------------------------------------------
  // Player Write Functions
  // --------------------------------------------------

  async createPlayer(steamid, username) {
    try {
      const { rows } = await query(
        `INSERT INTO players (steam_id, username) VALUES ($1, $2) RETURNING *`,
        [steamid, username]
      );

      // TODO: Initialize quests
      // await this.createInitialDailyQuests(steamid, 3);
      // await this.createInitialWeeklyQuests(steamid, 3);
      // await this.initializeAchievements(steamid);

      return rows[0];
    } catch (error) {}
  },

  async setUserType(steamid, userType) {
    try {
      const { rows } = await query(
        `UPDATE players
         SET userType = $2
         WHERE steam_id = $1
         RETURNING *`,
        [steamid, userType]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async modifyCoins(steamID, coins) {
    try {
      const queryText = `
        UPDATE players
        SET coins = coins + $1
        WHERE steam_id = $2
        RETURNING *
      `;
      const { rows } = await query(queryText, [coins, steamID]);
    } catch (error) {
      throw error;
    }
  },

  async addPlayerLog(steamid, event) {
    try {
      await query(
        `
        INSERT INTO player_logs (steam_id, log_event)
        VALUES ($1, $2)`,
        [steamid, event]
      );
      return;
    } catch (error) {
      throw error;
    }
  },

  // --------------------------------------------------
  // Player Battle Pass Functions
  // --------------------------------------------------

  // --------------------------------------------------
  // Player Cosmetics Functions
  // --------------------------------------------------
  async getPlayerCosmetics(steamid, onlyEquipped = false) {
    try {
      const filter = onlyEquipped ? "AND equipped = TRUE" : "";
      const { rows } = await query(
        `
        SELECT *
        FROM player_cosmetics
        JOIN cosmetics
        USING (cosmetic_id)
        WHERE steam_id = $1
        ${filter}
      `,
        [steamid]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async equipCosmetic(steamid, cosmeticID, equipped) {
    try {
      if (equipped) {
        // unequip all other items in this equip group
        const equipGroup = await Cosmetics.getEquipGroup(cosmeticID);

        await query(
          `UPDATE player_cosmetics pc
          SET equipped = FALSE
          FROM cosmetics c
          WHERE pc.steam_id = $1
            AND c.equip_group = $2
            AND c.cosmetic_id = pc.cosmetic_id
          `,
          [steamid, equipGroup]
        );
      }

      let { rows } = await query(
        `
        UPDATE player_cosmetics
        SET equipped = ${equipped}
        WHERE steam_id = $1 AND cosmetic_id = $2
        RETURNING *
      `,
        [steamid, cosmeticID]
      );

      return rows;
    } catch (error) {
      throw error;
    }
  },

  async hasCosmetic(steamid, cosmeticID) {
    try {
      const allCosmetics = await this.getAllCosmetics(steamid);
      return allCosmetics.some(
        (cosmetic) => cosmetic.cosmetic_id === cosmeticID
      );
    } catch (error) {
      throw error;
    }
  },

  async giveUniqueCosmetic(steamID, cosmeticID) {
    try {
      const hasCosmetic = await this.hasCosmetic(steamID, cosmeticID);
      if (hasCosmetic) return false;
      await this.giveCosmetic(steamID, cosmeticID);
    } catch (error) {
      throw error;
    }
  },

  async removeCosmetic(steamID, cosmeticID) {
    try {
      const queryText = `
        WITH deleted AS
          (DELETE FROM player_cosmetics
          WHERE ctid IN (
            SELECT ctid
            FROM player_cosmetics
            WHERE steam_id = $1 AND cosmetic_id = $2
            LIMIT 1)
          RETURNING *)
          SELECT count(*) FROM deleted;
        `;
      const { rows } = await query(queryText, [steamID, cosmeticID]);
      const rowsDeleted = rows[0].count;
      if (rowsDeleted == 0)
        throw new Error("Tried to remove non-existent cosmetic");
      return rowsDeleted;
    } catch (error) {
      throw error;
    }
  },

  async doItemTransaction(steamid, transactionData) {
    try {
      if (!transactionData) throw new Error("No transaction supplied");

      // Log the transaction
      await Logs.addTransactionLog(steamid, "transaction", transactionData);

      // Add or remove coins
      if (transactionData.coins) {
        const { coins } = transactionData;
        const queryText = `
          UPDATE players
          SET coins = coins + $1
          WHERE steam_id = $2
        `;
        await query(queryText, [coins, steamid]);
      }

      // Update battle pass
      // if (transactionData.battlePass) {
      //   const { battlePass } = transactionData;
      //   const { upgradeTier, upgradeDays, bonusExp } = battlePass;

      //   const xpToAdd = bonusExp || 0;

      //   if (xpToAdd != 0) {
      //     await this.addBattlePassExp(steamID, xpToAdd);
      //   }

      //   if (upgradeTier != undefined && upgradeDays) {
      //     await this.addBattlePassTier(steamID, upgradeTier, upgradeDays);
      //   }
      // }

      // Add or remove misc/cosmetic items
      if (transactionData.items) {
        const { items } = transactionData;
        const entries = Object.entries(items);

        for (const [cosmeticID, amount] of entries) {
          if (amount > 0) {
            for (let i = 0; i < amount; i++) {
              queryText = `
              INSERT INTO player_cosmetics
              (steam_id, cosmetic_id) VALUES
              ($1, $2)
              `;
              await query(queryText, [steamid, cosmeticID]);
            }
          } else if (amount < 0) {
            for (let i = 0; i < amount * -1; i++) {
              const queryText = `
              WITH deleted AS
                (DELETE FROM player_cosmetics
                WHERE ctid IN (
                  SELECT ctid
                  FROM player_cosmetics
                  WHERE steam_id = $1 AND cosmetic_id = $2
                  LIMIT 1)
                RETURNING *)
                SELECT count(*) FROM deleted;
              `;
              const { rows } = await query(queryText, [steamid, cosmeticID]);
              const rowsDeleted = rows[0].count;
              if (rowsDeleted == 0) {
                throw new Error("Tried to remove non-existent cosmetic");
              }
            }
          }
        }
      }
    } catch (error) {
      throw error;
    }
  },

  async consumeItem(steamid, cosmeticID) {
    try {
      const cosmetic = await Cosmetics.getCosmetic(cosmeticID);

      if (!cosmetic) throw new Error("Tried to consume non-existent item");

      const consumable =
        cosmetic.cosmetic_type === "XP" ||
        cosmetic.cosmetic_type === "Chest XP";
      if (!consumable) throw new Error("Tried to consume non-consumable item");

      const hasCosmetic = await this.hasCosmetic(steamid, cosmeticID);
      if (!hasCosmetic) throw new Error("You don't own this item");

      // TODO: Get the amount of xp the item should give

      // Log the transaction
      await Logs.addTransactionLog(steamid, "consume_item", {
        steamID: steamid,
        cosmeticID,
      });

      // remove the item
      await this.removeCosmetic(steamid, cosmeticID);
      // await this.addBattlePassExp(steamid, experience);

      return experience;
    } catch (error) {
      throw error;
    }
  },

  async buyCosmetic(steamid, cosmeticID) {
    try {
      const cosmetic = await Cosmetics.getCosmetic(cosmeticID);

      if (!cosmetic) {
        throw new Error("Invalid cosmeticID");
      }
      // Make sure the player has enough coins
      const coins = await this.getCoins(steamid);
      const price = cosmetic.cost;

      if (coins < price) throw new Error("Not enough coins!");
      if (price < 1) throw new Error("Item is not purchaseable with coins");

      // Don't allow purchasing duplicate cosmetics (with some exceptions)
      const cosmeticType = cosmetic.cosmetic_type;
      const canBuyMultiple =
        cosmeticType == "BP Accelerator" ||
        cosmeticType == "Chest" ||
        cosmeticType == "XP";

      if (!canBuyMultiple) {
        const hasCosmetic = await this.hasCosmetic(steamid, cosmeticID);
        if (hasCosmetic) throw new Error("You already own this item");
      }

      // log the transaction
      await Logs.addTransactionLog(steamid, "coins_purchase", {
        price,
        cosmeticID,
      });

      // Do the transaction
      await this.modifyCoins(steamid, -price);
      await this.giveCosmetic(steamid, cosmeticID);
    } catch (error) {
      throw error;
    }
  },

  async getRandomReward(steamid, rarity, bucket = []) {
    try {
      const potentialRewards = await Cosmetics.getCosmeticsByRarity(rarity);
      const existingItems = await this.getAllCosmetics(steamid);

      potentialRewards = potentialRewards.filter((cosmetic) => {
        const alreadyHasItem = existingItems.some((existingCosmetic) => {
          return cosmetic.cosmetic_id === existingCosmetic.cosmetic_id;
        });
        // the bucket tracks what we're rewarding in this chest
        const inBucket = bucket.some((existingCosmetic) => {
          return cosmetic.cosmetic_id === existingCosmetic.cosmetic_id;
        });
        const isChest = cosmetic.cosmetic_type === "Chest";

        return !alreadyHasItem && !inBucket && !isChest;
      });

      if (potentialRewards.length === 0) return null;

      // get a random element from the array
      const randomIndex = Math.floor(Math.random() * potentialRewards.length);
      const randomCosmetic = potentialRewards[randomIndex];

      return randomCosmetic;
    } catch (error) {
      throw error;
    }
  },

  async doesPlayerHaveItem(steamid, cosmeticID) {
    try {
      const { rows } = await query(
        `SELECT * FROM player_cosmetics
        WHERE cosmetic_id = $1 AND steam_id = $2`,
        [cosmeticID, steamid]
      );
      return rows.length > 0;
    } catch (error) {
      throw error;
    }
  },

  async generateRandomChestRewards(chestID) {
    try {
      const { rows: itemRewards } = await query(
        `SELECT * FROM chest_item_rewards
        WHERE cosmetic_id = $1`,
        [chestID]
      );
      const { rows: coinRewards } = await query(
        `SELECT * FROM chest_coin_rewards
        WHERE cosmetic_id = $1
        ORDER BY cum_sum `,
        [chestID]
      );
      const { rows: bonusRewards } = await query(
        `SELECT * FROM chest_bonus_rewards
        WHERE cosmetic_id = $1
        ORDER BY cum_sum `,
        [chestID]
      );
      return {
        itemRewards,
        coinRewards,
        bonusRewards,
      };
    } catch (error) {
      throw error;
    }
  },

  async openChest(steamid, chestID) {
    try {
      const hasChest = await this.doesPlayerHaveItem(steamid, chestID);
      if (!hasChest) throw new Error("You don't have this item");

      await Logs.addTransactionLog(steamid, "open_chest", {
        steamID: steamid,
        chestID,
      });

      // Increment chest opening progress
      // this.addQuestProgressByStat(steamid, "chests_opened", 1);

      const { itemRewards, coinRewards, bonusRewards } =
        await this.generateRandomChestRewards(chestID);

      let chestItems = [];
      let pityCoins = 0;
      let pityCoinRarities = {};
      for (const itemReward of itemRewards) {
        let { reward_rarity, reward_odds } = itemReward;

        while (reward_odds > 0) {
          const rewardProbability = reward_odds;
          // generate a random number (1-100) (inclusive)
          const roll = Math.floor(Math.random() * 100) + 1;

          if (rewardProbability >= roll) {
            const randomReward = await this.getRandomReward(
              steamid,
              reward_rarity,
              chestItems
            );

            if (randomReward !== null) {
              chestItems.push(randomReward);
            } else {
              // If you already have the item, convert it to coins
              switch (reward_rarity) {
                case "Common":
                  pityCoins += 30;
                  pityCoinRarities["Common"] = 30;
                  break;
                case "Uncommon":
                  pityCoins += 60;
                  pityCoinRarities["Uncommon"] = 60;
                  break;
                case "Rare":
                  pityCoins += 125;
                  pityCoinRarities["Rare"] = 125;
                  break;
                case "Mythical":
                  pityCoins += 300;
                  pityCoinRarities["Mythical"] = 300;
                  break;
                case "Legendary":
                  pityCoins += 800;
                  pityCoinRarities["Legendary"] = 800;
                  break;
              }
            }
          }
          reward_odds -= 100;
        }
      }

      let chestCoins = 0;
      chestCoins;

      // generate a random number (1-100) (inclusive)
      let roll = Math.floor(Math.random() * 100) + 1;

      for (const itemReward of coinRewards) {
        const { cum_sum, coins } = itemReward;

        if (cum_sum >= roll) {
          chestCoins += coins;
          break;
        }
      }

      // Choose a potential bonus reward
      roll = Math.floor(Math.random() * 100) + 1;

      for (const itemReward of bonusRewards) {
        const { cum_sum, reward_id } = itemReward;

        if (cum_sum >= roll) {
          const bonusReward = await Cosmetics.getCosmetic(reward_id);
          chestItems.push(bonusReward);
          break;
        }
      }

      let items = {};

      // consume this chest as part of the transaction
      items[chestID] = "-1";

      const transaction = {
        coins: chestCoins + pityCoins,
        items,
        companions,
      };

      // add the rewards to the player
      await this.itemTransaction(steamid, transaction);

      return {
        items: chestItems,
        coins: chestCoins,
        pityCoins,
        pityCoinRarities,
      };
    } catch (error) {
      throw error;
    }
  },

  // --------------------------------------------------
  // Quests / Achievements
  // --------------------------------------------------

  // Returns a random sample (either with or without replacement) from an array
  randomSample(arr, k, withReplacement = false) {
    let sample;
    if (withReplacement === true) {
      // sample with replacement
      sample = Array.from(
        { length: k },
        () => arr[Math.floor(Math.random() * arr.length)]
      );
    } else {
      // sample without replacement
      if (k > arr.length) {
        throw new RangeError(
          "Sample size must be less than or equal to array length when sampling without replacement."
        );
      }
      sample = arr
        .map((a) => [a, Math.random()])
        .sort((a, b) => {
          return a[1] < b[1] ? -1 : 1;
        })
        .slice(0, k)
        .map((a) => a[0]);
    }
    return sample;
  },

  /**
   * Gets all active quests and achievements, including
   * achievements that don't have a player_quests row yet
   * @param {string} steamID
   */
  async getAllQuestsForPlayer(steamID) {
    try {
      const sql_query = `
      SELECT * FROM quests q
      JOIN player_quests USING (quest_id)
      WHERE steam_id = $1
	    ORDER BY quest_id
      `;
      const { rows } = await query(sql_query, [steamID]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Creates three random daily quests for the user.
   * This function should only be called when a player is
   * created for the first time.
   * @param {string} steamID
   */
  async createInitialDailyQuests(steamID, numQuests) {
    try {
      const currentQuests = await this.getDailyQuests(steamID);
      if (currentQuests.length > 0)
        throw new Error("Player Daily Quests have already been initialized!");

      // Randomly choose three daily quests
      const allQuests = await Quests.getAllDailyQuests();
      const questsToInsert = this.randomSample(allQuests, numQuests);

      // Add the new quests
      let newQuests = [];
      let index = 1;
      for (const quest of questsToInsert) {
        const insert_query = `
          INSERT INTO player_quests (steam_id, quest_id, quest_index)
          VALUES($1, $2, $3)
          RETURNING *;
        `;
        const { rows } = await query(insert_query, [
          steamID,
          quest.quest_id,
          index,
        ]);
        newQuests.push(rows[0]);

        index++;
      }

      return newQuests;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Initializes all achievements for the player
   * @param {string} steamid
   */
  async initializeAchievements(steamid) {
    try {
      const allAchievements = await Quests.getAllAchievements();

      for (quest of allAchievements) {
        await query(
          `INSERT INTO player_quests (steam_id, quest_id) VALUES($1, $2)`,
          [steamid, quest.quest_id]
        );
      }
      return;
    } catch (error) {
      throw error;
    }
  },

  async getAllRerollableQuests(steamID) {
    try {
      const { rows } = await query(
        `
        SELECT pq.*, q.*
        FROM player_quests pq
        JOIN quests q
        USING (quest_id)
        JOIN players p
        USING (steam_id)
        WHERE steam_id = $1 AND q.is_achievement = FALSE
        ORDER BY quest_index DESC
      `,
        [steamID]
      );

      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Randomly choose a new quest
  async chooseNewQuest(currentQuests, allQuests) {
    const currentQuestIDs = currentQuests.map((quest) => quest.quest_id);
    const currentQuestStats = currentQuests.map((quest) => quest.stat);
    const newQuests = allQuests.filter((quest) => {
      return (
        !currentQuestIDs.includes(quest.quest_id) &&
        !currentQuestStats.includes(quest.stat)
      );
    });

    const questToAdd = newQuests[Math.floor(Math.random() * newQuests.length)];

    return questToAdd;
  },

  /**
   * Removes the given quest, and generates a new one that the player
   * does not already have, and is not the given quest
   * @param {string} steamID
   * @param {number} questID
   */
  async rerollQuest(steamID, questID) {
    try {
      const quest = await Quests.getQuest(questID);

      if (!quest) throw new Error(`Quest with ID ${questID} does not exist`);

      const isWeekly = quest.is_weekly;
      const interval = isWeekly ? 24 * 7 : 23;

      // Make sure the player has the quest, and that it's at least 24 hours old
      let sql_query = `
      SELECT
      created < current_timestamp - $3 * INTERVAL '1 HOURS' as can_reroll
      FROM player_quests
      JOIN quests
      USING (quest_id)
      WHERE is_achievement = FALSE AND steam_id = $1 AND quest_id = $2
      `;
      const { rows: createdRows } = await query(sql_query, [
        steamID,
        questID,
        interval,
      ]);

      if (createdRows.length === 0)
        throw new Error(`Player does not have quest with ID ${questID}`);
      if (!createdRows[0].can_reroll)
        throw new Error(`Can't reroll this quest yet`);

      // Make sure we're rerolling a quest the player actually has
      const currentQuests = await this.getAllRerollableQuests(steamID);
      if (!currentQuests.some((quest) => (quest.quest_id = questID))) {
        throw new Error(`Can't reroll quest ${questID} you don't have`);
      }

      const allQuests = isWeekly
        ? await Quests.getAllWeeklyQuests()
        : await Quests.getAllDailyQuests();

      const questToAdd = await this.chooseNewQuest(currentQuests, allQuests);
      const questToAddID = questToAdd.quest_id;

      // Log the reroll
      await logs.addTransactionLog(steamID, "quest_reroll", {
        steamID,
        oldQuest: questID,
        newQuest: questToAddID,
      });

      // Update the quest
      sql_query = `
        UPDATE player_quests
        SET (quest_id, quest_progress, created, claimed) =
        ($3, DEFAULT, DEFAULT, DEFAULT)
        WHERE steam_id = $1 AND quest_id = $2
        RETURNING *
      `;
      const { rows: newQuestRows } = await query(sql_query, [
        steamID,
        questID,
        questToAddID,
      ]);

      return { ...newQuestRows[0], success: true };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Returns if the player has the quest as one of their
   * current quests. Doesn't count quests the player
   * can't use due to patreon level
   * @param {string} steamID
   * @param {number} questID
   */
  async playerHasQuest(steamID, questID) {
    const dailyQuests = await this.getDailyQuests(steamID);
    for (let quest of dailyQuests) {
      if (quest.quest_id === questID) return true;
    }
    const weeklyQuests = await this.getWeeklyQuests(steamID);
    if (weeklyQuests) {
      for (let quest of weeklyQuests) {
        if (quest.quest_id === questID) return true;
      }
    }
    return false;
  },

  /**
   * Claims the coins/xp for a completed quest/achievement.
   * Only claims if the player has made enough progress to claim
   * and the quest has not been already claimed
   * */
  async claimQuestReward(steamID, questID) {
    try {
      let quest = await Quests.getQuest(questID);

      if (!quest) throw new Error(`Quest with ID ${questID} does not exist`);

      const isWeekly = quest.is_weekly;
      const interval = isWeekly ? 24 * 7 : 23;

      // Get the quest rewards and requirements for the DB,
      // and make sure the quest is actually complete
      let sql_query = `
        SELECT pq.quest_progress, pq.claimed, q.required_amount,
          q.coin_reward, q.xp_reward, is_achievement,
          created < current_timestamp - $3 * INTERVAL '1 HOURS' as can_reroll
        FROM player_quests pq
        JOIN quests q
        USING (quest_id)
        WHERE steam_id = $1 AND quest_id = $2
      `;
      const { rows } = await query(sql_query, [steamID, questID, interval]);

      if (rows.length === 0)
        throw new Error(`Player does not have quest with ID ${questID}`);

      quest = rows[0];

      const questProgress = quest.quest_progress;
      const required = quest.required_amount;
      const claimed = quest.claimed;
      const coins = quest.coin_reward;
      const xp = quest.xp_reward;
      const canReroll = quest.can_reroll && !quest.is_achievement;

      if (questProgress < required)
        throw new Error(`Quest is not completed, ${questProgress}/${required}`);
      if (claimed) throw new Error(`Quest ${questID} has already been claimed`);
      if (!this.playerHasQuest(steamID, questID))
        throw new Error("Player does not have quest");

      // Log the transaction
      await logs.addTransactionLog(steamID, "claim_quest", {
        steamID,
        questID,
        coins,
        xp,
      });

      // Set the quest as claimed
      await query(
        `
      UPDATE player_quests
      SET claimed = TRUE
      WHERE steam_id = $1 AND quest_id = $2
      RETURNING *`,
        [steamID, questID]
      );

      // Reroll if possible
      if (canReroll) {
        await this.rerollQuest(steamID, questID);
      }

      // Add the rewarded coins
      await query(
        `UPDATE players SET coins = coins + $2 WHERE steam_id = $1
    `,
        [steamID, coins]
      );

      // Add the rewarded xp to the battle pass
      await this.addBattlePassExp(steamID, xp);

      return { xp, coins, success: true };
    } catch (error) {
      throw error;
    }
  },

  async getNumDailyQuests(steamID) {
    try {
      return 2;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Gets the active daily quests for a player.
   * @param {String} steamid
   */
  async getDailyQuests(steamid) {
    try {
      const { rows } = await query(
        `
        SELECT pq.*, q.*, p.patreon_level,
          LEAST(quest_progress, required_amount) as capped_quest_progress,
          quest_progress >= required_amount as quest_completed,
          created < current_timestamp - interval '23 hours' as can_reroll
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

      const numQuests = await this.getNumDailyQuests(steamid);

      return rows.slice(0, numQuests);
    } catch (error) {
      throw error;
    }
  },

  async getDailyQuestsIncludeHidden(steamid) {
    try {
      const { rows } = await query(
        `
      SELECT pq.*, q.*, p.patreon_level,
        LEAST(quest_progress, required_amount) as capped_quest_progress,
        quest_progress >= required_amount as quest_completed,
        created < current_timestamp - interval '23 hours' as can_reroll
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

  async incrementQuestProgress(steamid, questID, amount) {
    try {
      await query(
        `
      UPDATE player_quests
      SET quest_progress = quest_progress + $3
      WHERE steam_id = $1 AND quest_id = $2
      `,
        [steamid, questID, amount]
      );
    } catch (error) {
      throw error;
    }
  },

  async addQuestProgressByStat(steamid, stat, amount) {
    try {
      const allQuests = await Quests.getAllQuestsWithStat(stat);
      for (const quest of allQuests) {
        const { quest_id } = quest;
        this.incrementQuestProgress(steamid, quest_id, amount);
      }
    } catch (error) {
      throw error;
    }
  },

  async addGameQuestProgress(playerData, teamData) {
    const { steamid, winner } = playerData;

    const activeQuests = await this.getAllQuestsForPlayer(steamid);

    for (let quest of activeQuests) {
      const questID = quest.quest_id;
      let progress = 0;
      switch (quest.stat) {
        case "games_won":
          progress = winner ? 1 : 0;
          break;
      }
      await this.incrementQuestProgress(steamid, questID, progress);
    }
  },
};
