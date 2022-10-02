const { query } = require("./index");
const Players = require("./players");
const mmr = require("../mmr/mmr");

module.exports = {
  /**
   * When a player is eliminated/wins, upsert the game and add their stats
   */
  async createGamePlayer(postGamePlayerData) {
    const { matchID, steamID, username, place, god } = postGamePlayerData;
    const { rounds, endTime, heroes, team, wins, losses } = postGamePlayerData;
    const { players, doubledown, isProd } = postGamePlayerData;
    let { ranked } = postGamePlayerData;

    if (players.length !== 8) ranked = false;

    try {
      await this.upsertGame(matchID, ranked, isProd);
      const player = await Players.upsertPlayer(steamID, username);
      const currentMMR = player.mmr;
      const currentLadderMMR = player.ladder_mmr;
      let mmrChange = 0;
      let xpChange = 0;
      let coinsChange = 0;
      let ladderRatingChange = 0;

      if (ranked && players) {
        const winners = players.filter(
          (p) => p.hasLost === false && p.steamID !== steamID
        );
        const losers = players.filter(
          (p) => p.hasLost === true && p.steamID !== steamID
        );
        mmrChange = mmr.getMatchRatingChange(currentMMR, winners, losers);
        ladderRatingChange = mmr.getMatchLadderRatingChange(
          currentLadderMMR,
          place
        );
        if (doubledown) {
          mmrChange *= 2;
          ladderRatingChange *= 2;
        }
      }

      if (ranked) {
        const { xp, coins } = await Players.givePostGameRewards(steamID, place);
        xpChange = xp;
        coinsChange = coins;
        await Players.addGameQuestProgress(postGamePlayerData);
        // If we placed top four, add god progress
        if (place <= 4) {
          // await Players.addPlayerGodProgress(steamID, god, 1);
        }
      }

      // prettier-ignore
      const { rows: gamePlayerRows } = await query(
        `INSERT INTO game_players
         (game_id, steam_id, rounds, place, end_time, mmr, mmr_change, ladder_mmr_change,
           team, wins, losses, god, xp_change, coins_change)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
         RETURNING *`,
        [matchID, steamID, rounds, place, endTime, currentMMR, mmrChange, ladderRatingChange,
          team, wins, losses, god, xpChange, coinsChange]
      );
      const gamePlayer = gamePlayerRows[0];
      const gamePlayerId = gamePlayer.game_player_id;

      await Players.modifyMMR(steamID, mmrChange);
      await Players.modifyLadderRating(steamID, ladderRatingChange);

      for (const hero of heroes) {
        const { rows: heroRows } = await query(
          `INSERT INTO game_player_heroes(game_player_id, hero_name, tier)
           VALUES ($1, $2, $3)
           RETURNING *`,
          [gamePlayerId, hero.name, hero.tier]
        );
        const heroId = heroRows[0].game_player_hero_id;

        for (const [i, ability] of hero.abilities.entries()) {
          await this.upsertAbility(
            ability.name,
            ability.isUltimate,
            ability.icon
          );
          await query(
            `INSERT INTO hero_abilities(game_player_hero_id, ability_name, ability_level, slot_index)
             VALUES ($1, $2, $3, $4)`,
            [heroId, ability.name, ability.level, i]
          );
        }
      }

      // async but we don't need to await
      Players.tryCompleteLoginQuest(steamID);

      const oldPips = mmr.getRankPips(currentLadderMMR);
      const newPips = mmr.getRankPips(currentLadderMMR + ladderRatingChange);
      const oldBadge = mmr.getRankBadge(currentLadderMMR);
      const newBadge = mmr.getRankBadge(currentLadderMMR + ladderRatingChange);
      const badgeChange = newBadge !== oldBadge ? newBadge : null;

      let post_match_leaderboard_rank;
      if (newBadge == "Immortal" && ranked) {
        post_match_leaderboard_rank = await Players.getLeaderboardPosition(
          currentMMR + mmrChange
        );
      }

      const mmrChangeType =
        newPips > oldPips || (badgeChange && ladderRatingChange > 0)
          ? "up"
          : "neutral";

      return {
        ...gamePlayer,
        pips_change: newPips - oldPips,
        badge_change: badgeChange,
        post_match_pips: newBadge == "Immortal" ? undefined : newPips,
        post_match_badge: newBadge,
        post_match_ladder_mmr:
          newBadge == "Immortal"
            ? currentLadderMMR + ladderRatingChange
            : undefined,
        coins_change: coinsChange,
        xp_change: xpChange,
        mmr_change_type: mmrChangeType,
        post_match_leaderboard_rank,
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * When a game is finished, record post game stats, round results
   */
  async addGameResults(results) {
    const { matchID, duration, rounds, cheatsEnabled, roundResults } = results;

    try {
      const game = await this.getGame(matchID);
      if (!game) throw new Error("Game not found");

      await query(
        `UPDATE games SET
        (duration, rounds, cheats_enabled) = ($1, $2, $3)
        WHERE game_id = $4`,
        [duration, rounds, cheatsEnabled, matchID]
      );

      // for (const round of roundResults) {
      //   for (const combat of round.combatResults) {
      //     const { rows: combatResultRows } = await query(
      //       `INSERT INTO combat_results(game_id, round_number, duration)
      //        VALUES ($1, $2, $3)
      //        RETURNING *`,
      //       [matchID, round.round, round.duration]
      //     );
      //     const combatResultId = combatResultRows[0].combat_results_id;

      //     for (const player of combat.participants) {
      //       if (player.steamID === 0) player.steamID = player.playerID;
      //       await query(
      //         `INSERT INTO combat_players(combat_results_id, steam_id, damage_taken, ghost)
      //          VALUES ($1, $2, $3, $4)`,
      //         [combatResultId, player.steamID, player.damageTaken, player.ghost]
      //       );
      //     }
      //   }
      // }
    } catch (error) {
      throw error;
    }
  },

  async upsertGame(matchID, ranked, isProd) {
    const environment = isProd ? "prod" : "dev";
    try {
      const { rows } = await query(
        `INSERT INTO games(game_id, ranked, environment)
         VALUES ($1, $2, $3)
         ON CONFLICT(game_id)
         DO NOTHING
         RETURNING *`,
        [matchID, ranked, environment]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async upsertAbility(abilityName, isUltimate, icon) {
    try {
      const { rows } = await query(
        `INSERT INTO abilities(ability_name, is_ultimate, icon)
         VALUES ($1, $2, $3)
         ON CONFLICT(ability_name)
         DO UPDATE SET (is_ultimate, icon) = ($2, $3)
         RETURNING *`,
        [abilityName, isUltimate, icon]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getGames(limit = 100, offset = 0, hours) {
    let args = [limit, offset];
    let whereClause = "";
    if (hours) {
      whereClause = "AND created_at >= NOW() - $3 * INTERVAL '1 HOURS'";
      args.push(hours);
    }

    try {
      // get games and number of players
      const { rows } = await query(
        `
          SELECT games.*, count(game_players.game_player_id) as players
          FROM games
          JOIN game_players USING (game_id)
          GROUP BY games.game_id
          ${whereClause}
          ORDER BY created_at DESC
          LIMIT $1 OFFSET $2`,
        args
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getNumGames(hours) {
    try {
      const gamesQuery = await query(
        `SELECT COUNT(*) FROM games WHERE created_at >  NOW() - $1 * INTERVAL '1 HOUR'`,
        [hours]
      );
      const numGames = gamesQuery.rows[0].count;
      return numGames;
    } catch (error) {
      throw error;
    }
  },

  async getGame(gameID) {
    try {
      // Game
      const { rows: games } = await query(
        `
          SELECT g.*
          FROM games AS g
          WHERE game_id = $1
        `,
        [gameID]
      );
      const game = games[0];

      if (!game) return null;

      // Players
      const { rows: gamePlayers } = await query(
        `
          SELECT gp.steam_id, gp.rounds, gp.wins, gp.losses, gp.end_time, gp.place, gp.team,
            gp.game_player_id, gp.god, gp.mmr_change, gp.mmr, p.ladder_mmr, gp.ladder_mmr_change,
            p.username
          FROM game_players AS gp
          JOIN players AS p
          USING (steam_id)
          WHERE game_id = $1
          ORDER BY gp.place ASC
        `,
        [gameID]
      );

      const { rows: heroAbilities } = await query(
        `
        SELECT ha.ability_level, ha.slot_index, a.*, gph.game_player_hero_id
        FROM game_players
        JOIN game_player_heroes as gph USING (game_player_id)
        JOIN hero_abilities AS ha USING (game_player_hero_id)
        JOIN abilities AS a USING (ability_name)
        WHERE game_id = $1;
        `,
        [gameID]
      );

      const setGamePlayerHeroes = async (player) => {
        try {
          const { rows: gamePlayerHeroes } = await query(
            `
              SELECT h.hero_name, h.tier, game_player_hero_id
              FROM game_player_heroes AS h
              WHERE game_player_id = $1
            `,
            [player.game_player_id]
          );
          for (const hero of gamePlayerHeroes) {
            const abilities = heroAbilities.filter(
              (ability) =>
                ability.game_player_hero_id === hero.game_player_hero_id
            );
            delete hero.game_player_hero_id;
            hero.abilities = abilities;
          }

          player.heroes = gamePlayerHeroes;
          player.badge = mmr.getRankBadge(player.mmr);
          player.pips = mmr.getRankPips(player.mmr);
        } catch (error) {
          throw error;
        }
      };

      const promises = [];
      for (const player of gamePlayers) {
        promises.push(setGamePlayerHeroes(player));
      }

      await Promise.all(promises);

      // // Rounds
      // const { rows: combatResults } = await query(
      //   `
      //     SELECT combat_results_id, duration, round_number FROM combat_results
      //     WHERE game_id = $1
      //   `,
      //   [gameID]
      // );

      // for (const combat of combatResults) {
      //   const { rows: combatPlayers } = await query(
      //     `
      //       SELECT steam_id, damage_taken, ghost FROM combat_players
      //       WHERE combat_results_id = $1
      //     `,
      //     [combat.combat_results_id]
      //   );
      //   delete combat.combat_results_id;

      //   combat.participants = combatPlayers;
      // }

      // // get all unique round numbers from combats
      // const roundNumbers = combatResults.map((combat) => combat.round_number);
      // const uniqueRoundNumbers = [...new Set(roundNumbers)].sort();

      // const rounds = [];

      // for (const roundNumber of uniqueRoundNumbers) {
      //   const round = {
      //     round: roundNumber,
      //     combatResults: combatResults
      //       .filter((result) => result.round_number === roundNumber)
      //       .map(({ round_number, ...result }) => result),
      //   };

      //   rounds.push(round);
      // }

      return {
        ...game,
        players: gamePlayers,
        // rounds: rounds,
      };
    } catch (error) {
      throw error;
    }
  },
};
