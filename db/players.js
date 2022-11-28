const { query } = require("./index");
const Cosmetics = require("./cosmetics");
const Logs = require("./logs");
const Quests = require("./quests");
const BattlePasses = require("./battlepass");
const RedemptionCodes = require("./redemption-codes");
const mmr = require("../mmr/mmr");
const moment = require("moment");
const { addTransactionLog } = require("./logs");
const cosmetics = require("./cosmetics");

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

  // This is just for doing bulk operations over all steam ids
  async getAllSteamIDs() {
    try {
      const { rows } = await query(`SELECT steam_id from players`);
      return rows.map((row) => row.steam_id);
    } catch (error) {
      throw error;
    }
  },

  async getLeaderboard() {
    try {
      const { rows } = await query(`
        SELECT mmr, steam_id, username, ladder_mmr from players
        ORDER BY LEAST (ladder_mmr, 4500) DESC, mmr DESC
        LIMIT 100
      `);
      // add index to rows
      for (let i = 0; i < rows.length; i++) {
        rows[i].rank = i + 1;
      }
      // add band and pips to each player
      for (const player of rows) {
        player.badge = mmr.getRankBadge(player.ladder_mmr);
        player.pips = mmr.getRankPips(player.ladder_mmr);
        delete player.mmr;
        delete player.ladder_mmr;
      }
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getPlayer(steamID) {
    try {
      const { rows } = await query(
        `SELECT
          players.*,
          plus_expiration IS NOT NULL AND plus_expiration > NOW() as has_plus
         FROM players WHERE steam_id = $1`,
        [steamID]
      );
      const player = rows[0];

      if (!player) return null;

      const rank = await this.getLeaderboardPosition(player.mmr);

      // const achievements = await Quests.getAchievementsForPlayer(steamID);
      // const achievementsToClaim = achievements.filter((achievement) => {
      //   return achievement.quest_completed && !achievement.claimed;
      // }).length;
      const achievementsToClaim = 0;

      player.badge = mmr.getRankBadge(player.ladder_mmr);
      player.pips = mmr.getRankPips(player.ladder_mmr);

      const unopened_chests = await this.getNumUnopenedChests(steamID);
      const unclaimed_bp_rewards = await this.getNumUnclaimedBattlepassRewards(
        steamID
      );
      const unclaimed_quests = await this.getNumUnclaimedQuests(steamID);

      return {
        ...player,
        rank,
        achievements_to_claim: achievementsToClaim,
        unopened_chests,
        unclaimed_bp_rewards,
        unclaimed_quests,
        games: 0,
      };
    } catch (error) {
      throw error;
    }
  },

  async hasPlus(steamID) {
    try {
      const { rows } = await query(
        `SELECT
          plus_expiration IS NOT NULL AND plus_expiration > NOW() as has_plus
         FROM players WHERE steam_id = $1`,
        [steamID]
      );
      const player = rows[0];
      return player?.has_plus ?? false;
    } catch (error) {
      throw error;
    }
  },

  async getStats(steamID) {
    try {
      const { rows } = await query(
        `SELECT * FROM players WHERE steam_id = $1`,
        [steamID]
      );
      const player = rows[0];
      if (!player) return null;

      const numGames = await this.getNumTotalNumGames(steamID);
      const results = await this.getGameResults(steamID);
      const rank = await this.getLeaderboardPosition(player.mmr);

      player.rank = rank;
      player.games = numGames;
      player.results = results;
      player.pips = mmr.getRankPips(player.ladder_mmr);
      player.badge = mmr.getRankBadge(player.ladder_mmr);

      return player;
    } catch (error) {
      throw error;
    }
  },

  async getNumGames(steamID, hours) {
    try {
      const gamesQuery = await query(
        `SELECT COUNT(*) FROM
        games JOIN game_players USING (game_id)
        WHERE created_at > NOW() - $1 * INTERVAL '1 HOUR'
          AND game_players.steam_id = $2`,
        [hours, steamID]
      );
      const numGames = Number(gamesQuery.rows[0].count);
      return numGames;
    } catch (error) {
      throw error;
    }
  },

  async getNumTopsWithGod(steamID, god) {
    try {
      const gamesQuery = await query(
        `SELECT COUNT(*) FROM
        games JOIN game_players USING (game_id)
        WHERE ranked = true AND steam_id = $1 AND god = $2 AND place <= 4`,
        [steamID, god]
      );
      const numGames = Number(gamesQuery.rows[0].count);
      return numGames;
    } catch (error) {
      throw error;
    }
  },

  async getNumTotalNumGames(steamID) {
    try {
      const gamesQuery = await query(
        `SELECT COUNT(*) FROM
        games JOIN game_players USING (game_id)
        WHERE ranked = TRUE AND game_players.steam_id = $1`,
        [steamID]
      );
      const numGames = Number(gamesQuery.rows[0].count);
      return numGames;
    } catch (error) {
      throw error;
    }
  },

  async getGameResults(steamID) {
    try {
      const gamesQuery = await query(
        `SELECT 
          count(*) as games,
          count(*) FILTER (WHERE place = 1) AS first_place,
          count(*) FILTER (WHERE place = 2) AS second_place,
          count(*) FILTER (WHERE place = 3) AS third_place,
          count(*) FILTER (WHERE place = 4) AS fourth_place,
          count(*) FILTER (WHERE place = 5) AS fifth_place,
          count(*) FILTER (WHERE place = 6) AS sixth_place,
          count(*) FILTER (WHERE place = 7) AS seventh_place,
          count(*) FILTER (WHERE place = 8) AS eighth_place,
          TRUNC (SUM(place)::decimal / count(*)::decimal, 2) AS avg_place
        FROM games JOIN game_players USING (game_id)
        WHERE ranked = TRUE AND game_players.steam_id = $1`,
        [steamID]
      );
      const result = gamesQuery.rows[0];
      const placements = [
        result.first_place / result.games,
        result.second_place / result.games,
        result.third_place / result.games,
        result.fourth_place / result.games,
        result.fifth_place / result.games,
        result.sixth_place / result.games,
        result.seventh_place / result.games,
        result.eighth_place / result.games,
      ];
      return {
        avg_place: result.avg_place,
        placements,
      };
    } catch (error) {
      throw error;
    }
  },

  async doesPlayerExist(steamID) {
    const result = await query(`SELECT * FROM players WHERE steam_id = $1`, [
      steamID,
    ]);
    return result.rows.length > 0;
  },

  async getMMR(steamID) {
    const result = await query(`SELECT mmr FROM players WHERE steam_id = $1`, [
      steamID,
    ]);
    return result.rows[0]?.mmr ?? 0;
  },

  async getLeaderboardPosition(mmr) {
    try {
      const { rows } = await query(
        `SELECT count(*) FROM players WHERE mmr > $1 AND ladder_mmr >= 4500`,
        [mmr]
      );
      if (rows.length === 0) return 0;
      return parseInt(rows[0].count) + 1;
    } catch (error) {
      throw error;
    }
  },

  async getLeaderboardPositionForPlayer(steamID) {
    try {
      const mmr = await this.getMMR(steamID);
      return await this.getLeaderboardPosition(mmr);
    } catch (error) {
      throw error;
    }
  },

  async getCoins(steamID) {
    try {
      const { rows } = await query(
        `SELECT coins FROM players WHERE steam_id = $1`,
        [steamID]
      );
      if (rows[0]) return rows[0].coins;
      return 0;
    } catch (error) {
      throw error;
    }
  },

  async getGames(steamID, limit = 100, offset = 0, hours) {
    let whereClause = "";
    if (hours) {
      whereClause = "AND created_at >= NOW() - $4 * INTERVAL '1 HOURS'";
    }
    try {
      const gamesQuery = `
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
        const { rows } = await query(gamesQuery, [
          steamID,
          limit,
          offset,
          hours,
        ]);
        return rows;
      } else {
        const { rows } = await query(gamesQuery, [steamID, limit, offset]);
        return rows;
      }
    } catch (error) {
      throw error;
    }
  },

  // Get the amount of xp a player has earned today
  async getXpEarnedToday(steamID) {
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
        [steamID]
      );
      return rows[0].daily_xp || 0;
    } catch (error) {
      throw error;
    }
  },

  async updatePingTime(steamID) {
    return await query(
      `UPDATE players SET last_ping = NOW() WHERE steam_id = $1`,
      [steamID]
    );
  },

  // Get the time in seconds since a player last pinged the server
  async getTimeSincePing(steamID) {
    const { rows } = await query(
      `SELECT last_ping FROM players WHERE steam_id = $1`,
      [steamID]
    );
    if (rows.length === 0) return 0;
    const lastPing = rows[0].last_ping;
    const timeSincePing = Math.floor((Date.now() - lastPing) / 1000);
    return timeSincePing;
  },

  // --------------------------------------------------
  // Player logs based functions
  // --------------------------------------------------
  async canUseWeeklyDoubleDown(steamID) {
    try {
      const hasPlus = await this.hasPlus(steamID);
      if (hasPlus) return false;
      const event = await Logs.getLastLogEvent(steamID, "weekly_double_down");
      if (!event) return true;
      // check if it has been a week since we used our double down
      const lastWeek = moment(event.log_time).add(7, "days");
      if (moment().isAfter(lastWeek)) return true;
      return false;
    } catch (error) {
      throw error;
    }
  },

  async useWeeklyDoubleDown(steamID) {
    try {
      const canUse = await this.canUseWeeklyDoubleDown(steamID);
      if (!canUse) throw new Error("Cannot use weekly double down");
      await Logs.addTransactionLog(steamID, "weekly_double_down");
      return true;
    } catch (error) {
      throw error;
    }
  },

  async canClaimDailyPlusGold(steamID) {
    try {
      const hasPlus = await this.hasPlus(steamID);
      if (!hasPlus) return false;
      const event = await Logs.getLastLogEvent(steamID, "daily_plus_gold");
      if (!event) return true;
      // check if the last event was the same day as today
      const usedToday = moment(event.log_time).isSame(moment(), "day");
      if (usedToday) return false;
      return true;
    } catch (error) {
      throw error;
    }
  },

  async claimDailyPlusGold(steamID) {
    try {
      const canClaim = await this.canClaimDailyPlusGold(steamID);
      if (!canClaim) throw new Error("Cannot claim daily plus gold");
      await this.modifyCoins(steamID, 100);
      await Logs.addTransactionLog(steamID, "daily_plus_gold");
      return true;
    } catch (error) {
      throw error;
    }
  },

  // --------------------------------------------------
  // Player Write Functions
  // --------------------------------------------------

  async createPlayer(steamID, username) {
    try {
      const { rows } = await query(
        `INSERT INTO players (steam_id, username) VALUES ($1, $2) RETURNING *`,
        [steamID, username]
      );

      await this.createInitialDailyQuests(steamID, 3);
      await this.resetLoginQuests(steamID);
      await this.resetWelcomeQuests(steamID);
      await this.initializeAchievements(steamID);
      await this.addDefaultCosmetics(steamID);

      const activeBattlePass = await BattlePasses.getActiveBattlePass();
      await this.createBattlePass(steamID, activeBattlePass.battle_pass_id);

      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async updateUsername(steamID, username) {
    try {
      const { rows } = await query(
        `UPDATE players SET username = $2 WHERE steam_id = $1 RETURNING *`,
        [steamID, username]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async upsertPlayer(steamID, username) {
    try {
      const existingPlayer = await this.getPlayer(steamID);
      if (!existingPlayer) return this.createPlayer(steamID, username);
      if (username != "") await this.updateUsername(steamID, username);
      return existingPlayer;
    } catch (error) {
      throw error;
    }
  },

  async setUserType(steamID, userType) {
    try {
      const { rows } = await query(
        `UPDATE players
         SET userType = $2
         WHERE steam_id = $1
         RETURNING *`,
        [steamID, userType]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async modifyCoins(steamID, coins) {
    if (coins === 0) return;
    try {
      await query(`UPDATE players SET coins = coins + $1 WHERE steam_id = $2`, [
        coins,
        steamID,
      ]);
    } catch (error) {
      throw error;
    }
  },

  async modifyMMR(steamID, mmr) {
    if (mmr === 0) return;
    try {
      await query(`UPDATE players SET mmr = mmr + $1 WHERE steam_id = $2`, [
        mmr,
        steamID,
      ]);
    } catch (error) {
      throw error;
    }
  },

  async modifyLadderRating(steamID, ratingChange) {
    if (ratingChange === 0) return;
    try {
      await query(
        `UPDATE players SET ladder_mmr = ladder_mmr + $1 WHERE steam_id = $2`,
        [ratingChange, steamID]
      );
    } catch (error) {
      throw error;
    }
  },

  async addPlayerLog(steamID, event) {
    try {
      await query(
        `INSERT INTO player_logs (steam_id, log_event) VALUES ($1, $2)`,
        [steamID, event]
      );
      return;
    } catch (error) {
      throw error;
    }
  },

  async addDefaultCosmetics(steamID) {
    try {
      const defaultCosmetics = await Cosmetics.getDefaultCosmetics();
      for (const cosmetic of defaultCosmetics) {
        if (!this.hasCosmetic(steamID, cosmetic.cosmetic_id)) {
          await this.giveCosmeticByName(steamID, cosmetic.cosmetic_id);
        }
      }
      return;
    } catch (error) {
      throw error;
    }
  },

  // --------------------------------------------------
  // Player Plus functions
  // --------------------------------------------------
  async addPlusDays(steamID, days) {
    try {
      await query(
        `UPDATE players SET plus_expiration = (
          CASE WHEN plus_expiration < NOW() OR plus_expiration IS NULL
            THEN NOW() + $1 * INTERVAL '1 DAY'
          ELSE
            plus_expiration + $1 * INTERVAL '1 DAY' END
        )
        WHERE steam_id = $2`,
        [days, steamID]
      );
    } catch (error) {
      throw error;
    }
  },

  // --------------------------------------------------
  // Player Battle Pass Functions
  // --------------------------------------------------

  /**
   * Add a battle pass to the player's inventory. Only one battle pass can be active at a time.
   * A new battle pass is created every month.
   */
  async createBattlePass(steamID, bpID) {
    try {
      const { rows } = await query(
        `INSERT INTO player_battle_pass (steam_id, battle_pass_id) VALUES ($1, $2) RETURNING *`,
        [steamID, bpID]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getActiveBattlePass(steamID) {
    try {
      const activeBattlePass = await BattlePasses.getActiveBattlePass();
      const { rows } = await query(
        `SELECT * FROM player_battle_pass WHERE steam_id = $1 AND battle_pass_id = $2`,
        [steamID, activeBattlePass.battle_pass_id]
      );
      const requirements = await BattlePasses.getRequirementsAtLevel(
        activeBattlePass.battle_pass_id,
        rows[0].bp_level
      );
      return {
        ...rows[0],
        requirements,
      };
    } catch (error) {
      throw error;
    }
  },

  async getClaimedBattlePassRewards(steamID, bpID) {
    try {
      const { rows } = await query(
        `SELECT * FROM player_claimed_battle_pass_rewards WHERE steam_id = $1 AND battle_pass_id = $2`,
        [steamID, bpID]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async hasClaimedReward(steamID, bpID, level) {
    try {
      const { rows } = await query(
        `SELECT * FROM player_claimed_battle_pass_rewards
        WHERE steam_id = $1 AND battle_pass_id = $2 AND bp_level = $3`,
        [steamID, bpID, level]
      );
      const hasClaimed = rows.length > 0;
      return hasClaimed;
    } catch (error) {
      throw error;
    }
  },

  async getXpToTargetLevel(steamID, targetLevel) {
    try {
      const { battle_pass_id, bp_level, total_xp } =
        await this.getActiveBattlePass(steamID);
      if (bp_level >= targetLevel) return 0;
      const targetReqs = await BattlePasses.getRequirementsAtLevel(
        battle_pass_id,
        targetLevel
      );
      const targetXp = targetReqs.total_xp;
      return targetXp - total_xp;
    } catch (error) {
      throw error;
    }
  },

  async getXpItemsToTargetLevel(steamID, targetLevel) {
    try {
      const items = [];
      let neededXp = await this.getXpToTargetLevel(steamID, targetLevel);
      if (neededXp < 0) return items;
      // items are ordered by xp, largest to smallest
      const purchaseableXpItems = await Cosmetics.getPurchaseableXpItems();
      purchaseableXpItems.sort((a, b) => b.xp - a.xp);

      // find the most cost efficient way to get to the needed xp
      while (neededXp > 0) {
        let xpItem = purchaseableXpItems.find((item) => item.xp <= neededXp);
        // if we didn't find any, add the smallest
        if (!xpItem) {
          xpItem = purchaseableXpItems[purchaseableXpItems.length - 1];
        }
        // prevent infinite loop if we can't get to the needed xp
        if (!xpItem || !xpItem.xp) break;
        neededXp -= xpItem.xp;
        items.push(xpItem.cosmetic_id);
      }

      return items;
    } catch (error) {
      throw error;
    }
  },

  // get all level rewards (up to 50) and if they've been claimed
  async getBattlePassLevels(steamID) {
    try {
      const activeBattlePass = await BattlePasses.getActiveBattlePass();
      const { bp_level, unlocked, battle_pass_id } =
        await this.getActiveBattlePass(steamID);
      const battlePassID = activeBattlePass.battle_pass_id;
      const claimedRewards = await this.getClaimedBattlePassRewards(
        steamID,
        battle_pass_id
      );
      const levels = await BattlePasses.getBattlePassLevelsAndRewards(
        battlePassID
      );
      // If you're above level 50, append the rewards in that range to the list of levels

      // const targetLevel = Math.max(bp_level, 1000);
      // const levelsAbove50 = await BattlePasses.getLevelsAndRewardsPast50(
      //   targetLevel
      // );
      // levels.push(...levelsAbove50);

      const playerLevels = levels.map((level) => {
        const claimed = claimedRewards.some(
          (reward) => reward.bp_level === level.bp_level
        );
        const can_claim =
          level.bp_level <= bp_level && !claimed && (level.free || unlocked);
        return {
          ...level,
          claimed,
          can_claim,
        };
      });
      return playerLevels;
    } catch (error) {
      throw error;
    }
  },

  async addPlayerClaimedRewardRow(steamID, bpID, level) {
    try {
      await query(
        `INSERT INTO player_claimed_battle_pass_rewards (steam_id, bp_level, battle_pass_id)
        VALUES ($1, $2, $3)`,
        [steamID, level, bpID]
      );
    } catch (error) {
      throw error;
    }
  },

  async claimBattlePassReward(steamID, level) {
    try {
      const { unlocked, battle_pass_id } = await this.getActiveBattlePass(
        steamID
      );
      const hasClaimed = await this.hasClaimedReward(
        steamID,
        battle_pass_id,
        level
      );
      if (hasClaimed) throw new Error("You have already claimed this reward.");

      const { cosmetics } = await BattlePasses.getRewardsFromRange(
        level,
        level,
        battle_pass_id
      );
      if (cosmetics.length === 0)
        throw new Error("No cosmetics to claim at this level.");

      const { cosmetic_id, free } = cosmetics[0];
      if (!free) {
        if (!unlocked)
          throw new Error(
            "You must upgrade your Battle Pass to claim this reward."
          );
      }

      const activeBattlePass = await BattlePasses.getActiveBattlePass();
      await this.addPlayerClaimedRewardRow(
        steamID,
        activeBattlePass.battle_pass_id,
        level
      );

      await this.giveCosmeticByID(steamID, cosmetic_id);
      return true;
    } catch (error) {
      throw error;
    }
  },

  async claimAllBattlePassRewards(steamID) {
    try {
      const battlePass = await this.getActiveBattlePass(steamID);
      const { unlocked, battle_pass_id } = await this.getActiveBattlePass(
        steamID
      );
      const { cosmetics } = await BattlePasses.getRewardsFromRange(
        0,
        battlePass.bp_level,
        battle_pass_id
      );
      const claimedRewards = await this.getClaimedBattlePassRewards(
        steamID,
        battle_pass_id
      );

      const claimedCosmetics = [];
      for (const cosmetic of cosmetics) {
        const { cosmetic_id, free, bp_level } = cosmetic;
        if (!free && !unlocked) continue;
        const hasClaimed = claimedRewards.some(
          (reward) => reward.bp_level === bp_level
        );
        if (hasClaimed) continue;

        await this.addPlayerClaimedRewardRow(
          steamID,
          battlePass.battle_pass_id,
          bp_level
        );
        await this.giveCosmeticByID(steamID, cosmetic_id);
        claimedCosmetics.push(cosmetic);
      }

      return claimedCosmetics;
    } catch (error) {
      throw error;
    }
  },

  async unlockBattlePass(steamID) {
    try {
      const battlePass = await this.getActiveBattlePass(steamID);
      if (battlePass.unlocked) return false;

      await query(
        `UPDATE player_battle_pass
         SET unlocked = true
         WHERE steam_id = $1`,
        [steamID]
      );

      return true;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Gives Battle Pass Experience, and handles giving awards
   * based on levels gained. This is the only way you should
   * ever add battle pass exp to a player, to ensure they get
   * their rewards.
   * @param {*} steamID
   * @param {*} xp
   */
  async addBattlePassXp(steamID, xp) {
    if (xp <= 0 || xp == undefined) return;

    try {
      const { rows } = await query(
        `
        UPDATE player_battle_pass
        SET total_xp = total_xp + $2
        WHERE steam_id = $1
        RETURNING *
      `,
        [steamID, xp]
      );

      if (rows.length === 0) throw new Error("No battle pass found");

      // Give rewards for every level of the battle pass that we passed
      const {
        bp_level: previousLevel,
        total_xp: totalXp,
        battle_pass_id,
      } = rows[0];

      // Get the level we were at, and the level we are at now
      const currentLevel = await BattlePasses.calculateBattlePassLevel(
        battle_pass_id,
        totalXp
      );

      // We haven't gained any levels, we're done here
      if (previousLevel === currentLevel) return;

      // Update the level in the database
      const { rows: updatedBP } = await query(
        `
        UPDATE player_battle_pass
        SET bp_level = $2
        WHERE steam_id = $1
        RETURNING *
      `,
        [steamID, currentLevel]
      );

      // Auto claim rewards for every level past 40
      if (currentLevel > 40) {
        try {
          await this.claimBattlePassReward(steamID, currentLevel);
        } catch (error) {
          // If we can't claim the reward, we don't care
        }
      }

      return updatedBP;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Awards battle pass experience to a player after a game
   *
   * @param {string} steamID
   * @param {number} placement
   * @param {number} bonusMultiplier
   */
  async givePostGameRewards(steamID, placement) {
    try {
      let hasPlus;
      try {
        hasPlus = await this.hasPlus(steamID);
      } catch (error) {
        hasPlus = false;
      }
      const rewards = {
        1: { xp: 100, coins: 100 },
        2: { xp: 90, coins: 60 },
        3: { xp: 60, coins: 40 },
        4: { xp: 45, coins: 30 },
        5: { xp: 30, coins: 20 },
        6: { xp: 20, coins: 14 },
        7: { xp: 10, coins: 8 },
        8: { xp: 5, coins: 4 },
      };

      const reward = rewards[placement];
      if (!reward) return { xp: 0, coins: 0 };
      let { coins, xp } = reward;
      if (hasPlus) coins *= 2;

      await Logs.addTransactionLog(steamID, "game_xp", {
        placement,
        coins,
        xp,
      });

      await this.addBattlePassXp(steamID, xp);
      await this.modifyCoins(steamID, coins);

      return { xp, coins };
    } catch (error) {
      throw error;
    }
  },

  // --------------------------------------------------
  // Player God Functions
  // --------------------------------------------------

  async addPlayerGod(steamID, godName, progress = 0) {
    try {
      const { rows } = await query(
        `
        INSERT INTO player_gods (steam_id, god_name, progress)
        VALUES ($1, $2, $3)
        ON CONFLICT (steam_id, god_name) DO UPDATE
        SET progress = $3
        RETURNING *
      `,
        [steamID, godName, progress]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async addPlayerGodProgress(steamID, godName, progress) {
    try {
      // Upsert the player god
      const { rows } = await query(
        `
        INSERT INTO player_gods (steam_id, god_name, progress)
        VALUES ($1, $2, $3)
        ON CONFLICT (steam_id, god_name) DO UPDATE
        SET progress = player_gods.progress + $3
        RETURNING *
      `,
        [steamID, godName, progress]
      );

      const playerGod = rows[0];
      if (playerGod.progress > playerGod.amount_required) {
        const goldenGod = await Cosmetics.getCosmeticByName(
          `gold_card_${godName}`
        );
        const hasCosmetic = await this.hasCosmetic(
          steamID,
          goldenGod.cosmetic_id
        );
        if (!hasCosmetic) {
          this.doItemTransaction(steamID, {
            items: { [goldenGod.cosmetic_id]: 1 },
          });
        }
      }

      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getGodCards(steamID) {
    try {
      const { rows } = await query(
        `SELECT player_cosmetics.*, cosmetics.cosmetic_name
        FROM player_cosmetics JOIN cosmetics USING (cosmetic_id)
        WHERE steam_id = $1 AND cosmetic_type = 'Card Frame'`,
        [steamID]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getGods(steamID) {
    const getAllGods = async () => {
      try {
        const { rows } = await query(
          `SELECT * from gods WHERE god_enabled = true`
        );
        return rows;
      } catch (error) {
        throw error;
      }
    };

    const getPlayerGods = async () => {
      try {
        const { rows } = await query(
          `SELECT * FROM player_gods WHERE steam_id = $1`,
          [steamID]
        );
        return rows;
      } catch (error) {
        throw error;
      }
    };

    try {
      const allGods = await getAllGods();
      const playerGods = await getPlayerGods();
      const godCards = await this.getGodCards(steamID);
      const player = await this.getPlayer(steamID);
      const loggedGods = await Logs.getLogsOfTypeForPlayer(
        steamID,
        "god_opened"
      );

      for (const god of allGods) {
        const hasGoldGod = godCards.some(
          (card) => card.cosmetic_name.substring(10) === god.god_name
        );
        const hasGod =
          godCards.some(
            (card) => card.cosmetic_name.substring(5) === god.god_name
          ) || hasGoldGod;
        const numOpened = loggedGods.filter(
          (log) => log.log_data.cosmeticName === `card_${god.god_name}`
        ).length;
        let playerGod = playerGods.find((pg) => pg.god_name === god.god_name);
        if (!playerGod) {
          try {
            const numTops = await this.getNumTopsWithGod(steamID, god.god_name);
            const progress =
              numOpened > 1 ? numTops + (numOpened - 1) * 10 : numTops;
            playerGod = await this.addPlayerGod(
              steamID,
              god.god_name,
              progress
            );
          } catch (error) {
            console.log(
              `Error adding player god ${god.god_name} for ${steamID}`
            );
            console.log(error);
            playerGod = {
              banned: false,
              progress: 0,
              amount_required: 100,
            };
          }
        }
        const isBanned = playerGod.banned;
        const progress = Math.min(
          playerGod.progress,
          playerGod.amount_required
        );
        const amount_required = playerGod.amount_required;

        god.owned =
          hasGod || god.free || (player?.has_plus && god.plus_exclusive);
        god.banned = isBanned;
        god.plus_exclusive = god.plus_exclusive;
        god.gold = hasGoldGod;
        god.num_opened = numOpened;
        god.progress = progress;
        god.amount_required = amount_required;
      }
      return allGods;
    } catch (error) {
      throw error;
    }
  },

  async getGodFreqs(steamID) {
    try {
      const { rows } = await query(
        `
        SELECT god, COUNT(*) AS freq
        FROM game_players
        JOIN games USING (game_id)
        WHERE ranked = TRUE AND steam_id = $1
        GROUP BY god
        ORDER BY freq DESC
        `,
        [steamID]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getGodsWithRewards(steamID) {
    const getRandomReward = (type) => {
      const roll = Math.random();
      if (roll < 0.6) {
        return type;
      } else if (roll < 0.625) {
        return "chest_basic";
      } else if (roll < 0.63) {
        return "chest_god";
      } else return false;
    };

    const addRewardToRandomGod = (gods, type) => {
      for (const god of gods) {
        if (god.reward) continue;
        const reward = getRandomReward(type);
        if (reward) {
          god.reward = reward;
          return;
        }
      }
    };

    try {
      const playerGods = await this.getGods(steamID);
      const godFreqs = await this.getGodFreqs(steamID);
      const numRewardsOfType = Math.floor(playerGods.length * 0.15);
      const rewardTypes = ["gold", "doubledown", "xp"];

      for (const god of playerGods) {
        const godFreq = godFreqs.find((gf) => gf.god === god.god_name);
        god.freq = godFreq ? godFreq.freq : 0;
      }
      playerGods.sort((a, b) => b.freq - a.freq);
      for (const god of playerGods) {
        delete god.freq;
      }

      for (const type of rewardTypes) {
        for (let i = 0; i < numRewardsOfType; i++) {
          addRewardToRandomGod(playerGods, type);
        }
      }

      return playerGods;
    } catch (error) {
      throw error;
    }
  },

  async setGodBanned(steamID, godName, banned) {
    try {
      // Upsert the god into the player_gods table
      const { rows } = await query(
        `
        INSERT INTO player_gods (steam_id, god_name, banned)
        VALUES ($1, $2, $3)
        ON CONFLICT (steam_id, god_name) DO UPDATE
        SET banned = $3
        RETURNING *`,
        [steamID, godName, banned]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // --------------------------------------------------
  // Player Cosmetics Functions
  // --------------------------------------------------
  async getCosmetics(steamID, onlyEquipped = false) {
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
        ORDER BY cosmetic_type, cosmetic_name
      `,
        [steamID]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getOwnedCosmeticCount(steamID, cosmeticID) {
    try {
      const { rows } = await query(
        `
        SELECT count(*)
        FROM player_cosmetics
        WHERE steam_id = $1 AND cosmetic_id = $2
      `,
        [steamID, cosmeticID]
      );
      return rows[0].count;
    } catch (error) {
      throw error;
    }
  },

  async getNumUnopenedChests(steamID) {
    try {
      const { rows } = await query(
        `
        SELECT *
        FROM player_cosmetics
        JOIN cosmetics
        USING (cosmetic_id)
        WHERE steam_id = $1
        AND cosmetic_type = 'Chest'
      `,
        [steamID]
      );
      return rows.length;
    } catch (error) {
      throw error;
    }
  },

  async getNumUnclaimedQuests(steamID) {
    try {
      const dailyQuests = await this.getDailyQuests(steamID);
      const loginQuests = await this.getLoginQuests(steamID);
      const welcomeQuests = await this.getWelcomeQuests(steamID);

      const unclaimedDailyQuests = dailyQuests.filter(
        (quest) => !quest.claimed && quest.quest_completed
      ).length;
      const unclaimedLoginQuests = loginQuests.filter(
        (quest) => !quest.claimed && quest.completed
      ).length;
      const unclaimedWelcomeQuests = welcomeQuests.filter(
        (quest) => quest.can_claim
      ).length;
      return (
        unclaimedDailyQuests + unclaimedLoginQuests + unclaimedWelcomeQuests
      );
    } catch (error) {
      throw error;
    }
  },

  async getNumUnclaimedBattlepassRewards(steamID) {
    try {
      const { bp_level, unlocked, battle_pass_id } =
        await this.getActiveBattlePass(steamID);
      const { rows } = await query(
        `
        SELECT *
        FROM player_claimed_battle_pass_rewards
        WHERE steam_id = $1 AND battle_pass_id = $2
      `,
        [steamID, battle_pass_id]
      );
      const numClaimedRewards = rows.length;
      const numRewards = BattlePasses.getNumClaimableRewardsAtLevel(
        bp_level,
        unlocked
      );
      return numRewards - numClaimedRewards;
    } catch (error) {
      throw error;
    }
  },

  async hasRedeemedCode(steamID, code) {
    try {
      const { rows } = await query(
        `SELECT * FROM player_redeemed_codes WHERE steam_id = $1 AND lower(code) = lower($2)`,
        [steamID, code]
      );
      return rows.length > 0;
    } catch (error) {
      throw error;
    }
  },

  async redeemCode(steamID, code) {
    try {
      const hasRedeemedCode = await this.hasRedeemedCode(steamID, code);
      if (hasRedeemedCode) throw new Error("Code already redeemed");

      const redemptionCode = await RedemptionCodes.getCode(code);
      if (!redemptionCode) throw new Error("Code not found");
      if (!redemptionCode.active) throw new Error("Code expired");
      const redemptionLimit = redemptionCode.redemption_limit;
      const numRedeemed = await RedemptionCodes.getNumRedeemed(code);
      if (redemptionLimit != null && numRedeemed >= redemptionLimit)
        throw new Error("Code expired");

      addTransactionLog(steamID, "redeem_code", redemptionCode);

      const rewards = redemptionCode.rewards;
      await query(
        `
        INSERT INTO player_redeemed_codes (steam_id, code)
        VALUES ($1, $2)`,
        [steamID, code]
      );

      const items = {};
      for (const reward of rewards) {
        items[reward.cosmetic_id] = items[reward.cosmetic_id] + 1 || 1;
      }
      await this.doItemTransaction(steamID, {
        items,
        coins: redemptionCode.coins,
      });

      return true;
    } catch (error) {
      throw error;
    }
  },

  async equipCosmetic(steamID, cosmeticID, equipped) {
    try {
      if (equipped) {
        // unequip all other items in this equip group
        const equipGroup = await Cosmetics.getEquipGroup(cosmeticID);

        await query(
          `
          UPDATE player_cosmetics pc
          SET equipped = FALSE
          FROM cosmetics c
          WHERE pc.steam_id = $1
            AND c.equip_group = $2
            AND c.cosmetic_id = pc.cosmetic_id
          `,
          [steamID, equipGroup]
        );
      }

      let { rows } = await query(
        `
        UPDATE player_cosmetics
        SET equipped = ${equipped}
        WHERE steam_id = $1 AND cosmetic_id = $2
        RETURNING *
      `,
        [steamID, cosmeticID]
      );

      return rows;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Checks if a player has a cosmetic with the given ID
   * @param {string} steamID
   * @param {number} cosmeticID
   * @returns
   */
  async hasCosmetic(steamID, cosmeticID) {
    try {
      const allCosmetics = await this.getCosmetics(steamID);
      return allCosmetics.some(
        (cosmetic) => cosmetic.cosmetic_id == cosmeticID
      );
    } catch (error) {
      throw error;
    }
  },

  async giveCosmeticByID(steamID, cosmeticID) {
    try {
      const cosmetic = await Cosmetics.getCosmetic(cosmeticID);
      await Logs.addTransactionLog(steamID, "add_cosmetic", cosmetic);
      await query(
        `
        INSERT INTO player_cosmetics (steam_id, cosmetic_id)
        VALUES ($1, $2)
        `,
        [steamID, cosmeticID]
      );
    } catch (error) {
      throw error;
    }
  },

  async giveCosmeticByName(steamID, name) {
    try {
      const cosmetic = await Cosmetics.getCosmeticByName(name);
      if (!cosmetic) return false;
      await Logs.addTransactionLog(steamID, "add_cosmetic", cosmetic);
      await query(
        `
        INSERT INTO player_cosmetics (steam_id, cosmetic_id)
        VALUES ($1, $2)
        `,
        [steamID, cosmetic.cosmetic_id]
      );
    } catch (error) {
      throw error;
    }
  },

  async giveUniqueCosmeticByName(steamID, cosmeticName) {
    try {
      const cosmetic = await Cosmetics.getCosmeticByName(cosmeticName);
      if (!cosmetic) return false;
      const hasCosmetic = await this.hasCosmetic(steamID, cosmetic.cosmetic_id);
      if (hasCosmetic) return false;
      await this.giveCosmeticByID(steamID, cosmetic.cosmetic_id);
    } catch (error) {
      throw error;
    }
  },

  async giveUniqueCosmeticByID(steamID, cosmeticID) {
    try {
      const hasCosmetic = await this.hasCosmetic(steamID, cosmeticID);
      if (hasCosmetic) return false;
      await this.giveCosmeticByID(steamID, cosmeticID);
    } catch (error) {
      throw error;
    }
  },

  async removeCosmeticByID(steamID, cosmeticID) {
    try {
      const { rows } = await query(
        `
        WITH deleted AS
          (DELETE FROM player_cosmetics
          WHERE ctid IN (
            SELECT ctid
            FROM player_cosmetics
            WHERE steam_id = $1 AND cosmetic_id = $2
            LIMIT 1)
          RETURNING *)
          SELECT count(*) FROM deleted;`,
        [steamID, cosmeticID]
      );
      const rowsDeleted = rows[0].count;
      if (rowsDeleted == 0)
        throw new Error("Tried to remove non-existent cosmetic");
      return rowsDeleted;
    } catch (error) {
      throw error;
    }
  },

  async setCosmeticTypeViewed(steamID, cosmeticType) {
    try {
      await query(
        `
        UPDATE player_cosmetics SET viewed = TRUE
        FROM cosmetics
        WHERE
          player_cosmetics.cosmetic_id = cosmetics.cosmetic_id AND
          player_cosmetics.steam_id = $1 AND
          cosmetics.cosmetic_type = $2
        `,
        [steamID, cosmeticType]
      );
      return;
    } catch (error) {
      throw error;
    }
  },

  async getUnviewedCosmeticTypes(steamID) {
    try {
      const { rows } = await query(
        `
        SELECT DISTINCT cosmetics.cosmetic_type
        FROM cosmetics JOIN player_cosmetics USING (cosmetic_id)
        WHERE player_cosmetics.steam_id = $1 AND player_cosmetics.viewed = FALSE
        `,
        [steamID]
      );
      return rows.map((row) => row.cosmetic_type);
    } catch (error) {
      throw error;
    }
  },

  async doItemTransaction(steamID, transactionData, consumePlus = false) {
    try {
      if (!transactionData) throw new Error("No transaction supplied");

      // Log the transaction
      await Logs.addTransactionLog(steamID, "transaction", transactionData);

      // Add or remove coins
      if (transactionData.coins) {
        const { coins } = transactionData;
        await query(
          `
          UPDATE players
          SET coins = coins + $1
          WHERE steam_id = $2`,
          [coins, steamID]
        );
      }

      // Update battle pass
      if (transactionData.battlePass) {
        const { battlePass } = transactionData;
        const { bonusExp } = battlePass;

        const xpToAdd = bonusExp || 0;
        if (xpToAdd > 0) await this.addBattlePassXp(steamID, xpToAdd);
      }

      // Add or remove misc/cosmetic items
      if (transactionData.items) {
        const { items } = transactionData;
        const entries = Object.entries(items);

        for (const [cosmeticID, amount] of entries) {
          if (amount > 0) {
            const cosmetic = await Cosmetics.getCosmetic(cosmeticID);
            if (Cosmetics.isUniqueCosmetic(cosmetic.cosmetic_type)) {
              const hasCosmetic = await this.hasCosmetic(steamID, cosmeticID);
              if (hasCosmetic) continue;
            }
            for (let i = 0; i < amount; i++) {
              await this.giveCosmeticByID(steamID, cosmeticID);
              if (Cosmetics.shouldAutoConsume(cosmetic)) {
                try {
                  await this.consumeItem(steamID, cosmeticID);
                } catch (error) {
                  console.error(
                    `Failed to consume item ${cosmeticID} for player ${steamID}`
                  );
                }
              } else if (consumePlus) {
                const cosmeticName = cosmetic.cosmetic_name;
                const isPlus =
                  cosmeticName === "plus_year_package" ||
                  cosmeticName === "plus_month";
                if (isPlus) {
                  try {
                    await this.consumeItem(steamID, cosmeticID);
                  } catch (error) {
                    console.error(
                      `Failed to consume item ${cosmeticID} for player ${steamID}`
                    );
                  }
                }
              }
            }
          } else if (amount < 0) {
            for (let i = 0; i < amount * -1; i++) {
              const { rows } = await query(
                `
                WITH deleted AS
                  (DELETE FROM player_cosmetics
                  WHERE ctid IN (
                    SELECT ctid
                    FROM player_cosmetics
                    WHERE steam_id = $1 AND cosmetic_id = $2
                    LIMIT 1)
                  RETURNING *)
                  SELECT count(*) FROM deleted;`,
                [steamID, cosmeticID]
              );
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

  async consumeDoubledown(steamID) {
    try {
      const cosmetic = await Cosmetics.getCosmeticByName("doubledown");
      const hasCosmetic = await this.hasCosmetic(steamID, cosmetic.cosmetic_id);
      if (!hasCosmetic) throw new Error("You don't own this item");

      await Logs.addTransactionLog(steamID, "consume_item", {
        steamID: steamID,
        cosmeticName: "doubledown",
      });
      await this.removeCosmeticByID(steamID, cosmetic.cosmetic_id);
    } catch (error) {
      throw error;
    }
  },

  async openEmotePack(steamID, cosmeticName) {
    try {
      const itemNames = Cosmetics.getEmotePackItems(cosmeticName);
      const items = {};
      for (const itemName of itemNames) {
        const cosmetic = await Cosmetics.getCosmeticByName(itemName);
        items[cosmetic.cosmetic_id] = 1;
      }
      await this.doItemTransaction(steamID, { items });
      return itemNames;
    } catch (error) {
      throw error;
    }
  },

  async openRandomDrop(steamID, cosmeticName) {
    try {
      const itemNames = Cosmetics.getRandomDrops(cosmeticName);
      const ownedItems = (await this.getCosmetics(steamID)).map(
        (c) => c.cosmetic_name
      );
      const itemsToChooseFrom = itemNames.filter(
        (itemName) => !ownedItems.includes(itemName)
      );
      if (itemsToChooseFrom.length == 0) return;
      const randomItem =
        itemsToChooseFrom[Math.floor(Math.random() * itemsToChooseFrom.length)];
      const cosmetic = await Cosmetics.getCosmeticByName(randomItem);
      await this.doItemTransaction(steamID, {
        items: { [cosmetic.cosmetic_id]: 1 },
      });
      return randomItem;
    } catch (error) {
      throw error;
    }
  },

  async consumeItem(steamID, cosmeticID) {
    try {
      let results = [];
      const cosmetic = await Cosmetics.getCosmetic(cosmeticID);

      if (!cosmetic) throw new Error(`Invalid cosmetic ID ${cosmeticID}`);
      if (cosmetic.cosmetic_type !== "Consumable")
        throw new Error("Tried to consume non-consumable item");

      const hasCosmetic = await this.hasCosmetic(steamID, cosmetic.cosmetic_id);
      if (!hasCosmetic) throw new Error("You don't own this item");

      const cosmeticName = cosmetic.cosmetic_name;

      let xp = 0;
      let gold = 0;
      switch (cosmeticName) {
        case "get_xp_250":
          xp = 250;
          break;
        case "get_xp_500":
          xp = 500;
          break;
        case "get_xp_1000":
          xp = 1000;
          break;
        case "get_xp_2500":
          xp = 2500;
          break;
        case "get_xp_5000":
          xp = 5000;
          break;
        case "buy_xp_5000":
          xp = 5000;
          break;
        case "buy_xp_1000":
          xp = 1000;
          break;
        case "buy_xp_300":
          xp = 300;
          break;
        case "drop_gold_50":
          gold = 50;
          break;
        case "drop_gold_100":
          gold = 100;
          break;
        case "drop_gold_200":
          gold = 200;
          break;
        case "drop_gold_400":
          gold = 400;
          break;
        case "drop_gold_1000":
          gold = 1000;
          break;
        case "gold_3500":
          gold = 3500;
          break;
        case "gold_10000":
          gold = 10000;
          break;
        case "gold_33000":
          gold = 33000;
          break;
        case "gold_70000":
          gold = 70000;
          break;
        case "gold_200000":
          gold = 200000;
          break;
        case "drop_gold_4000":
          gold = 4000;
          break;
        case "drop_gold_10000":
          gold = 10000;
          break;
      }

      // Handle plus extensions
      switch (cosmeticName) {
        case "plus_year_package":
          // add two god chests
          const godChest = await Cosmetics.getCosmeticByName("chest_god");
          const nameRainbow = await Cosmetics.getCosmeticByName("name_rainbow");
          this.doItemTransaction(steamID, {
            items: {
              [godChest.cosmetic_id]: 2,
              [nameRainbow.cosmetic_id]: 1,
            },
          });
          this.addPlusDays(steamID, 365);
          break;
        case "plus_1day":
          this.addPlusDays(steamID, 1);
          break;
        case "plus_2day":
          this.addPlusDays(steamID, 2);
          break;
        case "plus_4day":
          this.addPlusDays(steamID, 4);
          break;
        case "plus_month":
          this.addPlusDays(steamID, 30);
          break;
      }

      // Handle emote packs
      if (cosmeticName.startsWith("emote_pack_")) {
        results = await this.openEmotePack(steamID, cosmeticName);
      }

      // Handle random items
      if (cosmeticName === "avatar_random" || cosmeticName === "emote_random") {
        const itemDrop = await this.openRandomDrop(steamID, cosmeticName);
        if (!itemDrop) {
          throw new Error("You already own all items of this type");
        }
        results.push(itemDrop);
      }

      // Handle upgrading the battle pass
      if (cosmeticName === "buy_bp") {
        const success = await this.unlockBattlePass(steamID);
        if (!success) throw new Error("Battle Pass is already upgraded");
      }

      // Log the transaction
      await Logs.addTransactionLog(steamID, "consume_item", {
        steamID: steamID,
        cosmeticName,
      });

      // remove the item
      await this.removeCosmeticByID(steamID, cosmetic.cosmetic_id);
      await this.addBattlePassXp(steamID, xp);
      await this.modifyCoins(steamID, gold);

      return results;
    } catch (error) {
      throw error;
    }
  },

  async realMoneyPurchase(steamID, item, amount) {
    try {
      if (item === "COINS") {
        await this.modifyCoins(steamID, amount);
      } else if (item === "XP") {
        await this.addBattlePassXp(steamID, amount);
      } else if (item === "BATTLE_PASS") {
        await this.addBattlePassTier(steamID, 1, 31 * amount);
      } else {
        throw new Error("Bad item type");
      }
    } catch (error) {
      throw error;
    }
  },

  async buyCosmetic(steamID, cosmeticID) {
    try {
      const cosmetic = await Cosmetics.getCosmetic(cosmeticID);

      if (!cosmetic) throw new Error(`Invalid cosmeticID ${cosmeticID}`);
      // Make sure the player has enough coins
      const coins = await this.getCoins(steamID);
      const price = cosmetic.cost_coins;

      if (coins < price) throw new Error("Not enough coins!");
      if (price < 1) throw new Error("Item is not purchaseable with coins");

      // Don't allow purchasing duplicate cosmetics (with some exceptions)
      const cosmeticType = cosmetic.cosmetic_type;
      const canBuyMultiple =
        cosmeticType == "Consumable" || cosmeticType == "Chest";

      if (!canBuyMultiple) {
        const hasCosmetic = await this.hasCosmetic(steamID, cosmeticID);
        if (hasCosmetic) throw new Error("You already own this item");
      }

      // log the transaction
      await Logs.addTransactionLog(steamID, "coins_purchase", {
        price,
        cosmeticID,
      });

      // Do the transaction
      await this.modifyCoins(steamID, -price);
      await this.giveCosmeticByID(steamID, cosmeticID);
    } catch (error) {
      throw error;
    }
  },

  async doesPlayerHaveItem(steamID, cosmeticID) {
    try {
      const { rows } = await query(
        `SELECT * FROM player_cosmetics
        WHERE cosmetic_id = $1 AND steam_id = $2`,
        [cosmeticID, steamID]
      );
      return rows.length > 0;
    } catch (error) {
      throw error;
    }
  },

  async getRandomChestReward(steamID, chestCosmeticID) {
    try {
      const consumableTypes = ["Consumable", "Game Consumable", "Chest"];
      const dropType = await Cosmetics.getRandomChestDropType(chestCosmeticID);
      const chest = await Cosmetics.getCosmetic(chestCosmeticID);
      if (!dropType)
        throw new Error(`No drop type found for chest ${chestCosmeticID}`);
      const dropTypeRewards = await Cosmetics.getDropTypeRewards(dropType);

      const handleGodOpening = async () => {
        try {
          // if the player already has a golden god, remove it from the drop table
          const godCards = await this.getGodCards();
          const goldenGods = godCards
            .filter((card) => card.cosmetic_name.startsWith("gold"))
            .map((card) => card.cosmetic_name.substring(10));
          const drops = dropTypeRewards.filter(
            (drop) => !goldenGods.includes(drop.cosmetic_name.substring(5))
          );

          // If we already have every god at gold
          if (drops.length === 0) return { coins: chest.cost_coins / 4 };

          // choose a random drop
          const drop = drops[Math.floor(Math.random() * drops.length)];

          // log that we've opened this god
          await Logs.addTransactionLog(steamID, "god_opened", {
            cosmeticName: drop.cosmetic_name,
          });

          const alreadyHasGod = await this.hasCosmetic(
            steamID,
            drop.cosmetic_id
          );

          if (!alreadyHasGod) {
            return { items: { [drop.cosmetic_id]: 1 } };
          } else {
            const godName = drop.cosmetic_name.substring(5);
            this.addPlayerGodProgress(steamID, godName, 5);
            return { missed_item: drop, coins: chest.cost_coins / 4 };
          }
        } catch (error) {
          throw error;
        }
      };

      const handleNormalOpening = async () => {
        const roll = Math.random() * 100;
        for (const reward of dropTypeRewards) {
          if (roll <= reward.cum_sum_odds) {
            const rewardID = reward.reward_cosmetic_id;
            const rewardCosmetic = await Cosmetics.getCosmetic(rewardID);
            if (rewardCosmetic.cosmetic_name === "gold_placeholder") {
              // The rewards for the gold chest
              const coins = Math.floor(Math.random() * 100) + 50;
              return { coins };
            } else if (consumableTypes.includes(rewardCosmetic.cosmetic_type)) {
              // we can win as many consumables as we want
              return { items: { [rewardID]: 1 } };
            }
            // Check if the player already has this item, and it's not a consumable
            // In that case, we'll return pity coins
            const hasItem = await this.doesPlayerHaveItem(steamID, rewardID);
            if (hasItem) {
              // Return coins equal to 25% the price of the chest
              if (chest.cost_coins > 0)
                return {
                  coins: chest.cost_coins / 4,
                  missed_item: rewardCosmetic,
                };
              return { coins: 100 };
            } else return { items: { [rewardID]: 1 } };
          }
        }
        throw new Error(`Failed to find a reward for chest ${chestCosmeticID}`);
      };

      const isGodChest = chest.cosmetic_name === "chest_god";
      if (isGodChest) return await handleGodOpening();
      else return await handleNormalOpening();
    } catch (error) {
      throw error;
    }
  },

  async openChest(steamID, chestID) {
    try {
      const hasChest = await this.doesPlayerHaveItem(steamID, chestID);
      if (!hasChest) throw new Error("You don't have this item");

      const rewardsTransaction = await this.getRandomChestReward(
        steamID,
        chestID
      );

      // consume this chest as part of the transaction
      rewardsTransaction.items = { ...rewardsTransaction.items, [chestID]: -1 };

      // add the rewards to the player
      await this.doItemTransaction(steamID, rewardsTransaction);

      // log the transaction
      Logs.addTransactionLog(steamID, "open_chest", { steamID, chestID });
      this.addQuestProgressByStat(steamID, "chests_opened", 1);

      // get the names of the rewarded items
      const itemIDs = Object.keys(rewardsTransaction.items);
      const items = [];
      for (const id of itemIDs) {
        if (id !== chestID) {
          const item = await Cosmetics.getCosmetic(id);
          items.push(item);
        }
      }

      rewardsTransaction.items = items;
      return rewardsTransaction;
    } catch (error) {
      throw error;
    }
  },

  // --------------------------------------------------
  // Unique Chests
  // --------------------------------------------------
  async getActiveUniqueChest(steamID, uniqueChestID) {
    try {
      const { rows } = await query(
        `
        SELECT * FROM player_unique_chests
        WHERE steam_id = $1 AND unique_chest_id = $2 AND active = true`,
        [steamID, uniqueChestID]
      );
      // log an error, but chest opening should still function
      // we don't want to automatically fix this, as we might wipe the wrong chest
      if (rows.length > 1) {
        console.error(`Multiple active unique chests for ${steamID}`);
      }
      // if we don't have an active chest, try to create one
      if (rows.length === 0) {
        // If we currently don't have an active chest, make a new one
        return await this.createUniqueChest(steamID, uniqueChestID);
      }
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // return the cosmetic ids the player has already gotten from this chest
  async getChestAlreadyDroppedIDs(playerChestID) {
    try {
      const { rows } = await query(
        `
        SELECT * FROM player_unique_chests_drops
        WHERE player_unique_chest_id = $1`,
        [playerChestID]
      );
      return rows.map((row) => row.cosmetic_id);
    } catch (error) {
      throw error;
    }
  },

  async getUniqueChestNumber(steamID, uniqueChestID) {
    try {
      const { rows } = await query(
        `
        SELECT count(*) FROM player_unique_chests
        WHERE steam_id = $1 AND unique_chest_id = $2`,
        [steamID, uniqueChestID]
      );
      return rows[0].count;
    } catch (error) {
      throw error;
    }
  },

  async createUniqueChest(steamID, uniqueChestID) {
    try {
      const isValidID = await Cosmetics.isValidUniqueChestID(uniqueChestID);
      if (!isValidID)
        throw new Error(`Invalid unique chest ID ${uniqueChestID}`);
      // inactivate any existing chests for this player
      await query(
        `
        UPDATE player_unique_chests
        SET active = false
        WHERE steam_id = $1 AND unique_chest_id = $2`,
        [steamID, uniqueChestID]
      );

      const { rows } = await query(
        `
        INSERT INTO player_unique_chests (steam_id, unique_chest_id, active)
        VALUES ($1, $2, true)
        RETURNING *`,
        [steamID, uniqueChestID]
      );
      const chest = rows[0];

      const numChests = await this.getUniqueChestNumber(steamID, uniqueChestID);
      if (numChests === 1) {
        // if this is their first chest of this type, we want to remove the gods they already own
        const godCards = await this.getGodCards();
        for (const drop of chestDrops) {
          const hasGod = godCards.some(
            (card) => card.cosmetic_name === drop.cosmetic_name
          );
          if (hasGod) {
            await this.removeUniqueChestItem(
              chest.player_unique_chest_id,
              drop.cosmetic_id
            );
          }
        }
      }

      return chest;
    } catch (error) {
      throw error;
    }
  },

  async getMissedDropCount(playerChestID, cosmeticID) {
    try {
      const { rows } = await query(
        `
        SELECT missed_drop_count FROM player_missed_drop_counts
        WHERE player_unique_chest_id = $1 AND cosmetic_id = $2`,
        [playerChestID, cosmeticID]
      );
      if (rows.length === 0) return 0;
      return rows[0].missed_drop_count;
    } catch (error) {
      throw error;
    }
  },

  async incrementMissedDropCount(playerChestID, cosmeticID) {
    try {
      const { rows } = await query(
        `
        INSERT INTO player_missed_drop_counts (player_unique_chest_id, cosmetic_id, missed_drop_count)
        VALUES ($1, $2, 1)
        ON CONFLICT (player_unique_chest_id, cosmetic_id)
        DO UPDATE SET missed_drop_count = player_missed_drop_counts.missed_drop_count + 1
        RETURNING *`,
        [playerChestID, cosmeticID]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async resetMissedDropCount(playerChestID, cosmeticID) {
    try {
      await query(
        `
        INSERT INTO player_missed_drop_counts (player_unique_chest_id, cosmetic_id, missed_drop_count)
        VALUES ($1, $2, 0)
        ON CONFLICT (player_unique_chest_id, cosmetic_id)
        DO UPDATE SET missed_drop_count = 0`,
        [playerChestID, cosmeticID]
      );
    } catch (error) {
      throw error;
    }
  },

  async removeUniqueChestItem(playerChestID, cosmeticID) {
    try {
      await query(
        `
        INSERT INTO player_unique_chests_drops (player_unique_chest_id, cosmetic_id)
        VALUES ($1, $2)`,
        [playerChestID, cosmeticID]
      );
    } catch (error) {
      throw error;
    }
  },

  async getUniqueChestDropsForPlayer(steamID, uniqueChestID) {
    try {
      const chestDrops = await cosmetics.getUniqueChestDropsWithOdds(
        uniqueChestID
      );
      let activeChest = await this.getActiveUniqueChest(steamID, uniqueChestID);

      // If we currently don't have an active chest, make a new one
      if (!activeChest) {
        activeChest = await this.createUniqueChest(steamID, uniqueChestID);
      }

      const alreadyDropped = await this.getChestAlreadyDroppedIDs(
        activeChest.player_unique_chest_id
      );

      // Remove the items the player has already gotten from this chest
      let drops = chestDrops.filter(
        (drop) => !alreadyDropped.some((id) => id === drop.cosmetic_id)
      );

      // If we've run out of drops, make a new chest
      const commonDrops = drops.filter((drop) => !drop.rarity);
      if (commonDrops.length === 0) {
        await this.createUniqueChest(steamID, uniqueChestID);
        drops = chestDrops;
      }

      return drops;
    } catch (error) {
      throw error;
    }
  },

  getEscalatingOdds(odds, missedDropCount) {
    const dropOdds = odds.find((odd) => odd.openingNumber === missedDropCount);
    if (!dropOdds) return odds[odds.length - 1].odds;
    else return dropOdds.odds;
  },

  async openUniqueChest(steamID, chestCosmeticID) {
    try {
      const hasChest = await this.doesPlayerHaveItem(steamID, chestCosmeticID);
      if (!hasChest) throw new Error("You don't have this item");

      const uniqueChestID = await Cosmetics.getUniqueChestID(chestCosmeticID);

      const drops = await this.getUniqueChestDropsForPlayer(
        steamID,
        uniqueChestID
      );

      const activeChest = await this.getActiveUniqueChest(
        steamID,
        uniqueChestID
      );
      const playerChestID = activeChest.player_unique_chest_id;

      // get a random common drop, and then roll for all the rare drops
      const commonDrops = drops.filter((drop) => !drop.rarity);
      const commonDrop =
        commonDrops[Math.floor(Math.random() * commonDrops.length)];
      await this.removeUniqueChestItem(playerChestID, commonDrop.cosmetic_id);

      const rewardsTransaction = {};
      rewardsTransaction.items = {
        [commonDrop.cosmetic_id]: 1,
        [chestCosmeticID]: -1,
      };

      const rareDrops = drops.filter((drop) => drop.rarity);
      for (const drop of rareDrops) {
        const roll = Math.random();
        const missedDrops = await this.getMissedDropCount(
          playerChestID,
          drop.cosmetic_id
        );
        // get the escalating odds for this drop
        const odds = this.getEscalatingOdds(
          drop.escalatingOdds,
          missedDrops.missed_drop_count
        );
        if (roll < 1 / odds) {
          // we got a drop
          await this.removeUniqueChestItem(playerChestID, drop.cosmetic_id);
          await this.resetMissedDropCount(playerChestID, drop.cosmetic_id);

          rewardsTransaction.items[drop.cosmetic_id] = 1;
        } else {
          // we didn't get a drop
          await this.incrementMissedDropCount(playerChestID, drop.cosmetic_id);
        }
      }

      const rewards = Object.entries(rewardsTransaction.items);
      for (const [cosmeticID, count] of rewards) {
        if (count > 0) {
          const item = await Cosmetics.getCosmetic(cosmeticID);
          // log that we've opened this god
          await Logs.addTransactionLog(steamID, "god_opened", {
            cosmeticName: item.cosmetic_name,
          });

          const alreadyHasGod = await this.hasCosmetic(steamID, cosmeticID);

          // add god progress if this is a duplicate
          if (alreadyHasGod) {
            const godName = item.cosmetic_name.substring(5);
            this.addPlayerGodProgress(steamID, godName, 5);
          }
        }
      }
      // add the gods to the player
      await this.doItemTransaction(steamID, rewardsTransaction);

      Logs.addTransactionLog(steamID, "open_unique_chest", {
        steamID,
        chestCosmeticID,
      });
      this.addQuestProgressByStat(steamID, "chests_opened", 1);

      // get the names of the rewarded items
      const itemIDs = Object.keys(rewardsTransaction.items);
      const items = [];
      for (const id of itemIDs) {
        if (id !== chestCosmeticID) {
          const item = await Cosmetics.getCosmetic(id);
          items.push(item);
        }
      }
      rewardsTransaction.items = items;

      return rewardsTransaction;
    } catch (error) {
      throw error;
    }
  },

  async getUniqueChestDrops(steamID, chestCosmeticID) {
    try {
      const uniqueChestID = await Cosmetics.getUniqueChestID(chestCosmeticID);
      const chestDrops = await Cosmetics.getUniqueChestDropsWithOdds(
        uniqueChestID
      );
      const chestName = await Cosmetics.getCosmeticName(chestCosmeticID);
      const activeChest = await this.getActiveUniqueChest(
        steamID,
        uniqueChestID
      );
      const alreadyDropped = await this.getChestAlreadyDroppedIDs(
        activeChest.player_unique_chest_id
      );
      for (const drop of chestDrops) {
        drop.opened = alreadyDropped.includes(drop.cosmetic_id);
        if (drop.escalatingOdds) {
          const missedDropCount = await this.getMissedDropCount(
            activeChest.player_unique_chest_id,
            drop.cosmetic_id
          );
          drop.odds = this.getEscalatingOdds(
            drop.escalatingOdds,
            missedDropCount
          );
        }
        delete drop.escalatingOdds;
      }

      const ownedCount = await this.getOwnedCosmeticCount(
        steamID,
        chestCosmeticID
      );

      return {
        cosmetic_name: chestName,
        owned_count: Number(ownedCount),
        items: chestDrops,
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
      const { rows } = await query(
        `
        SELECT * FROM quests q
        JOIN player_quests USING (quest_id)
        WHERE steam_id = $1
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
        const { rows } = await query(
          `INSERT INTO player_quests (steam_id, quest_id, quest_index) VALUES($1, $2, $3) RETURNING *`,
          [steamID, quest.quest_id, index]
        );
        newQuests.push(rows[0]);

        index++;
      }

      return newQuests;
    } catch (error) {
      throw error;
    }
  },

  async createInitialWeeklyQuests(steamID, numQuests) {
    try {
      const currentQuests = await this.getWeeklyQuestsIncludeHidden(steamID);
      if (currentQuests.length > 0)
        throw new Error("Player Weekly Quests have already been initialized!");

      // Randomly choose three weekly quests
      const allQuests = await Quests.getAllWeeklyQuests();
      const questsToInsert = this.randomSample(allQuests, numQuests);

      // Add the new quests
      let newQuests = [];
      let index = 1;
      for (const quest of questsToInsert) {
        const { rows } = await query(
          `INSERT INTO player_quests (steam_id, quest_id, quest_index) VALUES($1, $2, $3) RETURNING *`,
          [steamID, quest.quest_id, index]
        );
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
   * @param {string} steamID
   */
  async initializeAchievements(steamID) {
    try {
      const allAchievements = await Quests.getAllAchievements();

      for (const quest of allAchievements) {
        await query(
          `INSERT INTO player_quests (steam_id, quest_id) VALUES($1, $2)`,
          [steamID, quest.quest_id]
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

  // Randomly choose a new quest that doesn't share a stat with another active quest
  chooseNewQuest(currentQuests, allQuests) {
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
      const { rows: createdRows } = await query(
        `
        SELECT
        created < current_timestamp - $3 * INTERVAL '1 HOURS' as can_reroll
        FROM player_quests
        JOIN quests
        USING (quest_id)
        WHERE is_achievement = FALSE AND steam_id = $1 AND quest_id = $2
      `,
        [steamID, questID, interval]
      );

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
      await Logs.addTransactionLog(steamID, "quest_reroll", {
        steamID,
        oldQuest: questID,
        newQuest: questToAddID,
      });

      // Update the quest
      const { rows: newQuestRows } = await query(
        `
        UPDATE player_quests
        SET (quest_id, quest_progress, created, claimed) =
        ($3, DEFAULT, DEFAULT, DEFAULT)
        WHERE steam_id = $1 AND quest_id = $2
        RETURNING *
    `,
        [steamID, questID, questToAddID]
      );

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
      const { rows } = await query(
        `
        SELECT pq.quest_progress, pq.claimed, q.required_amount,
          q.coin_reward, q.xp_reward, is_achievement,
          created < current_timestamp - $3 * INTERVAL '1 HOURS' as can_reroll
        FROM player_quests pq
        JOIN quests q
        USING (quest_id)
        WHERE steam_id = $1 AND quest_id = $2
        `,
        [steamID, questID, interval]
      );

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
      const questEvent = { steamID, questID, coins, xp };
      await Logs.addTransactionLog(steamID, "claim_quest", questEvent);

      // Set the quest as claimed
      await query(
        `
        UPDATE player_quests
        SET claimed = TRUE
        WHERE steam_id = $1 AND quest_id = $2
        RETURNING *
        `,
        [steamID, questID]
      );

      // Reroll if possible
      if (canReroll) await this.rerollQuest(steamID, questID);

      await this.modifyCoins(steamID, coins);
      await this.addBattlePassXp(steamID, xp);

      return { xp, coins, success: true };
    } catch (error) {
      throw error;
    }
  },

  // For now, all players have 2 daily quests
  async getNumDailyQuests(steamID) {
    try {
      const hasPlus = await this.hasPlus(steamID);
      if (hasPlus) return 3;
      return 2;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Gets the active daily quests for a player.
   * @param {String} steamID
   */
  async getDailyQuests(steamID) {
    const getQuests = async () => {
      const { rows } = await query(
        `
        SELECT pq.*, q.*,
          LEAST(quest_progress, required_amount) as capped_quest_progress,
          quest_progress >= required_amount as quest_completed,
          (created < current_timestamp - interval '23 hours'
            AND (claimed OR quest_progress < required_amount)) as can_reroll
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
    };

    try {
      let quests = await getQuests();
      const numQuests = await this.getNumDailyQuests(steamID);

      // if the quest can be rerolled, and is already claimed, reroll it
      for (let quest of quests) {
        if (quest.can_reroll && quest.claimed) {
          try {
            await this.rerollQuest(steamID, quest.quest_id);
            quests = await getQuests();
          } catch (error) {
            console.error(
              `Error automatically rerolling quest ${quest.quest_id} for ${steamID}`
            );
          }
        }
      }

      return quests.slice(0, numQuests);
    } catch (error) {
      throw error;
    }
  },

  async getDailyQuestsIncludeHidden(steamID) {
    try {
      const { rows } = await query(
        `
        SELECT pq.*, q.*,
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
        [steamID]
      );

      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getWeeklyQuests(steamID) {
    try {
      const { rows } = await query(
        `
        SELECT pq.*, q.*,
          LEAST(quest_progress, required_amount) as capped_quest_progress,
          quest_progress >= required_amount as quest_completed,
          created < current_timestamp - interval '168 hours' as can_reroll
        FROM player_quests pq
        JOIN quests q
        USING (quest_id)
        JOIN players p
        USING (steam_id)
        WHERE steam_id = $1 AND q.is_achievement = FALSE AND is_weekly = TRUE
        ORDER BY quest_index DESC
      `,
        [steamID]
      );

      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getWeeklyQuestsIncludeHidden(steamID) {
    try {
      const { rows } = await query(
        `
        SELECT pq.*, q.*,
          LEAST(quest_progress, required_amount) as capped_quest_progress,
          quest_progress >= required_amount as quest_completed,
          created < current_timestamp - interval '168 hours' as can_reroll
        FROM player_quests pq
        JOIN quests q
        USING (quest_id)
        JOIN players p
        USING (steam_id)
        WHERE steam_id = $1 AND q.is_achievement = FALSE AND is_weekly = TRUE
        ORDER BY quest_index DESC
      `,
        [steamID]
      );

      return rows;
    } catch (error) {
      throw error;
    }
  },

  async incrementQuestProgress(steamID, questID, amount) {
    try {
      await query(
        `
      UPDATE player_quests
      SET quest_progress = quest_progress + $3
      WHERE steam_id = $1 AND quest_id = $2
      `,
        [steamID, questID, amount]
      );
    } catch (error) {
      throw error;
    }
  },

  async addQuestProgressByStat(steamID, stat, amount) {
    try {
      const allQuests = await Quests.getAllQuestsWithStat(stat);
      for (const quest of allQuests) {
        const { quest_id } = quest;
        this.incrementQuestProgress(steamID, quest_id, amount);
      }
    } catch (error) {
      throw error;
    }
  },

  async addGameQuestProgress(postGamePlayerData) {
    const { steamID, place, heroes, wins } = postGamePlayerData;
    const activeQuests = await this.getAllQuestsForPlayer(steamID);
    const abilities = heroes.reduce(
      (acc, hero) => acc.concat(hero.abilities),
      []
    );

    for (let quest of activeQuests) {
      const questID = quest.quest_id;
      let progress = 0;
      switch (quest.stat) {
        case "games_played":
          progress = 1;
          break;
        case "first_place":
          progress = place === 1 ? 1 : 0;
          break;
        case "top_four":
          progress = place <= 4 ? 1 : 0;
          break;
        case "rounds_won":
          progress = wins;
          break;
        case "gabens":
          const gabens = abilities.filter(
            (ability) => ability.level === 9
          ).length;
          progress = gabens;
          break;
        case "supers":
          const supers = abilities.filter(
            (ability) => ability.level >= 6
          ).length;
          progress = supers;
          break;
      }
      await this.incrementQuestProgress(steamID, questID, progress);
    }
  },

  //////////////////////////////////////////////////////////////////////////////
  // Welcome quests
  //////////////////////////////////////////////////////////////////////////////

  async resetWelcomeQuests(steamID) {
    try {
      await query(`DELETE FROM player_welcome_quests WHERE steam_id = $1`, [
        steamID,
      ]);
      const quests = await Quests.getWelcomeQuests();

      for (const quest of quests) {
        await query(
          `INSERT INTO player_welcome_quests (steam_id, welcome_quest_id) VALUES ($1, $2)`,
          [steamID, quest.welcome_quest_id]
        );
      }
    } catch (error) {
      throw error;
    }
  },

  async getWelcomeQuests(steamID) {
    try {
      const { rows } = await query(
        `SELECT player_welcome_quests.welcome_quest_id, claim_date,
          welcome_quests.day, welcome_quests.coin_reward, claim_date IS NOT NULL as claimed,
          cosmetics.cosmetic_id, cosmetics.cosmetic_name
        FROM player_welcome_quests JOIN welcome_quests USING (welcome_quest_id)
        LEFT JOIN cosmetics USING (cosmetic_id)
        WHERE steam_id = $1
        ORDER BY day ASC`,
        [steamID]
      );
      const lastCompletedQuest = rows.reverse().find((quest) => quest.claimed);
      rows.reverse();
      if (!lastCompletedQuest && rows[0]) rows[0].can_claim = true;
      else {
        const lastCompletedQuestDate = lastCompletedQuest.claim_date;
        // check if the last completed quest is at least a day old
        const canClaimNext =
          lastCompletedQuestDate < new Date(Date.now() - 86400000);
        if (canClaimNext) {
          const indexOfLastCompletedQuest = rows.indexOf(lastCompletedQuest);
          const nextQuestIndex = indexOfLastCompletedQuest + 1;
          if (nextQuestIndex < rows.length) {
            rows[nextQuestIndex].can_claim = true;
          }
        }
      }
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getWelcomeQuest(steamID, questID) {
    try {
      const { rows } = await query(
        `SELECT player_welcome_quests.welcome_quest_id,
          welcome_quests.day, welcome_quests.coin_reward, claim_date IS NOT NULL as claimed,
          cosmetics.cosmetic_id, cosmetics.cosmetic_name
        FROM player_welcome_quests JOIN welcome_quests USING (welcome_quest_id)
        LEFT JOIN cosmetics USING (cosmetic_id)
        WHERE steam_id = $1 AND welcome_quest_id = $2`,
        [steamID, questID]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async claimWelcomeQuests(steamID, questID) {
    try {
      const quest = await this.getWelcomeQuest(steamID, questID);
      if (quest.claimed) throw new Error("Quest has already been claimed");
      const welcomeQuests = await this.getWelcomeQuests(steamID);
      const canClaimQuest = welcomeQuests.find((quest) => quest.can_claim);
      if (!canClaimQuest) throw new Error("Cannot complete this quest yet");
      if (quest.day !== canClaimQuest.day)
        throw new Error("This isn't even the right quest to finish you dingus");

      await query(
        `UPDATE player_welcome_quests
        SET claim_date = NOW()
        WHERE steam_id = $1 AND welcome_quest_id = $2`,
        [steamID, questID]
      );
      const { coin_reward, xp_reward, cosmetic_id } = quest;

      await addTransactionLog(steamID, "claim_welcome_quest", {
        coin_reward,
        xp_reward,
        cosmetic_id,
      });

      await this.modifyCoins(steamID, coin_reward);
      await this.addBattlePassXp(steamID, xp_reward);
      if (cosmetic_id) await this.giveCosmeticByID(steamID, cosmetic_id);

      return true;
    } catch (error) {
      throw error;
    }
  },

  //////////////////////////////////////////////////////////////////////////////
  // Player login quests (aka "weekly quests")
  //////////////////////////////////////////////////////////////////////////////

  async resetLoginQuests(steamID) {
    try {
      await query(`DELETE FROM player_login_quests WHERE steam_id = $1`, [
        steamID,
      ]);
      const loginQuests = await Quests.getLoginQuests();

      for (const quest of loginQuests) {
        await query(
          `INSERT INTO player_login_quests (steam_id, login_quest_id) VALUES ($1, $2)`,
          [steamID, quest.login_quest_id]
        );
      }
    } catch (error) {
      throw error;
    }
  },

  async resetAllLoginQuests() {
    try {
      await query(
        `UPDATE player_login_quests SET (completed, claimed) = (false, false)`
      );
      await query(`UPDATE players SET last_login_quest_claimed = NULL`);
    } catch (error) {
      throw error;
    }
  },
  async getLoginQuests(steamID) {
    try {
      const { rows } = await query(
        `
        SELECT * FROM player_login_quests
        JOIN login_quests
        USING (login_quest_id)
        LEFT JOIN cosmetics
        USING (cosmetic_id)
        WHERE steam_id = $1
        ORDER BY day`,
        [steamID]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getLoginQuest(steamID, loginID) {
    try {
      const { rows } = await query(
        `
        SELECT * FROM player_login_quests
        JOIN login_quests
        USING (login_quest_id)
        WHERE steam_id = $1 AND login_quest_id = $2`,
        [steamID, loginID]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getDaysSinceLoginQuestClaimed(steamID) {
    try {
      const { rows } = await query(
        `
        SELECT
        (NOW()::date - last_login_quest_claimed::date) as days_since_last_claim
        FROM players
        WHERE steam_id = $1`,
        [steamID]
      );
      return rows[0].days_since_last_claim;
    } catch (error) {
      throw error;
    }
  },

  async claimLoginQuest(steamID, loginQuestID) {
    try {
      const quest = await this.getLoginQuest(steamID, loginQuestID);
      const { coin_reward, xp_reward, cosmetic_id, claimed } = quest;

      if (!quest.completed) return false;
      if (quest.claimed) return false;

      await query(
        `UPDATE player_login_quests SET claimed = TRUE
        WHERE steam_id = $1 AND login_quest_id = $2`,
        [steamID, loginQuestID]
      );

      await this.modifyCoins(steamID, coin_reward);
      await this.addBattlePassXp(steamID, xp_reward);
      if (cosmetic_id) await this.giveCosmeticByID(steamID, cosmetic_id);

      await addTransactionLog(steamID, "claim_login_quest", {
        coin_reward,
        xp_reward,
        cosmetic_id,
      });

      return true;
    } catch (error) {
      throw error;
    }
  },

  async tryCompleteLoginQuest(steamID) {
    try {
      const daysSinceClaimed = await this.getDaysSinceLoginQuestClaimed(
        steamID
      );
      if (daysSinceClaimed === 0) return false;

      const loginQuests = await this.getLoginQuests(steamID);
      const loginQuest = loginQuests.find((quest) => !quest.completed);
      if (!loginQuest) return false;

      await query(
        `UPDATE player_login_quests SET completed = TRUE WHERE steam_id = $1 AND login_quest_id = $2`,
        [steamID, loginQuest.login_quest_id]
      );

      await query(
        `UPDATE players SET last_login_quest_claimed = NOW() WHERE steam_id = $1`,
        [steamID]
      );

      return true;
    } catch (error) {
      throw error;
    }
  },
};
