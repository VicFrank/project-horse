const { query } = require("./index");
const { getMatchRatingChange } = require("../mmr/mmr");
const Players = require("./players");

module.exports = {
  /**
   * When a player is eliminated/wins, upsert the game and add their stats
   */
  async createGamePlayer(postGamePlayerData) {
    const { matchID, steamID, username, place } = postGamePlayerData;
    const { rounds, endTime, heroes, team, wins, losses } = postGamePlayerData;
    const { god } = postGamePlayerData;
    const ranked = true;

    try {
      await this.upsertGame(matchID, ranked);
      const player = await Players.upsertPlayer(steamID, username);
      const currentMMR = player.mmr;
      let mmrChange = 0;

      const { players } = postGamePlayerData;
      if (ranked && players) {
        const winners = players.filter((p) => p.hasLost === false);
        const losers = players.filter(
          (p) => p.hasLost === true && p.steamID !== steamID
        );
        mmrChange = getMatchRatingChange(currentMMR, winners, losers);
      }

      // prettier-ignore
      const { rows: gamePlayerRows } = await query(
        `INSERT INTO game_players
         (game_id, steam_id, rounds, place, end_time, mmr, mmr_change, team, wins, losses, god)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING *`,
        [matchID, steamID, rounds, place, endTime, currentMMR, mmrChange, team, wins, losses, god]
      );
      const gamePlayerId = gamePlayerRows[0].game_player_id;

      await Players.modifyMMR(steamID, mmrChange);

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

      if (ranked) await Players.addGameQuestProgress(postGamePlayerData);

      return { matchID, steamID, mmrChange };
    } catch (error) {
      throw error;
    }
  },

  /**
   * When a game is finished, record post game stats, round results
   */
  async addGameResults(results) {
    const { matchID, duration, rounds, ranked, cheatsEnabled, roundResults } =
      results;

    try {
      await this.upsertGame(matchID, ranked);
      await query(
        `UPDATE games SET
        (duration, rounds, ranked, cheats_enabled) =
        ($1, $2, $3, $4)
         WHERE game_id = $5`,
        [duration, rounds, ranked, cheatsEnabled, matchID]
      );

      for (const round of roundResults) {
        for (const combat of round.combatResults) {
          const { rows: combatResultRows } = await query(
            `INSERT INTO combat_results(game_id, round_number, duration)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [matchID, round.round, round.duration]
          );
          const combatResultId = combatResultRows[0].combat_results_id;

          for (const player of combat.participants) {
            if (player.steamID === 0) player.steamID = player.playerID;
            await query(
              `INSERT INTO combat_players(combat_results_id, steam_id, damage_taken, ghost)
               VALUES ($1, $2, $3, $4)`,
              [combatResultId, player.steamID, player.damageTaken, player.ghost]
            );
          }
        }
      }
    } catch (error) {
      throw error;
    }
  },

  async upsertGame(matchID, ranked) {
    try {
      const { rows } = await query(
        `INSERT INTO games(game_id, ranked)
         VALUES ($1, $2)
         ON CONFLICT(game_id)
         DO NOTHING
         RETURNING *`,
        [matchID, ranked]
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
    let whereClause = "";
    if (hours) {
      whereClause = "AND created_at >= NOW() - $3 * INTERVAL '1 HOURS'";
    }
    const sql_query = `
      SELECT * FROM games
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2      
    `;
    try {
      if (hours) {
        const { rows } = await query(sql_query, [limit, offset, hours]);
        return rows;
      } else {
        const { rows } = await query(sql_query, [limit, offset]);
        return rows;
      }
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

      // Players
      const { rows: gamePlayers } = await query(
        `
          SELECT gp.steam_id, gp.rounds, gp.wins, gp.losses, gp.end_time, gp.place, gp.team,
            gp.game_player_id, gp.god, gp.mmr_change, gp.mmr, p.username
          FROM game_players AS gp
          JOIN players AS p
          USING (steam_id)
          WHERE game_id = $1
          ORDER BY gp.place ASC
        `,
        [gameID]
      );

      for (const player of gamePlayers) {
        const { rows: gamePlayerHeroes } = await query(
          `
            SELECT h.hero_name, h.tier, game_player_hero_id
            FROM game_player_heroes AS h
            WHERE game_player_id = $1
          `,
          [player.game_player_id]
        );
        delete player.game_player_id;

        for (const hero of gamePlayerHeroes) {
          const { rows: heroAbilities } = await query(
            `
              SELECT ha.ability_level, ha.slot_index, a.*
              FROM hero_abilities AS ha
              JOIN abilities AS a
              USING (ability_name)
              WHERE game_player_hero_id = $1
            `,
            [hero.game_player_hero_id]
          );
          delete hero.game_player_hero_id;

          hero.abilities = heroAbilities;
        }

        player.heroes = gamePlayerHeroes;
      }

      // Rounds
      const { rows: combatResults } = await query(
        `
          SELECT combat_results_id, duration, round_number FROM combat_results
          WHERE game_id = $1
        `,
        [gameID]
      );

      for (const combat of combatResults) {
        const { rows: combatPlayers } = await query(
          `
            SELECT steam_id, damage_taken, ghost FROM combat_players
            WHERE combat_results_id = $1
          `,
          [combat.combat_results_id]
        );
        delete combat.combat_results_id;

        combat.participants = combatPlayers;
      }

      // get all unique round numbers from combats
      const roundNumbers = combatResults.map((combat) => combat.round_number);
      const uniqueRoundNumbers = [...new Set(roundNumbers)].sort();

      const rounds = [];

      for (const roundNumber of uniqueRoundNumbers) {
        const round = {
          round: roundNumber,
          combatResults: combatResults
            .filter((result) => result.round_number === roundNumber)
            .map(({ round_number, ...result }) => result),
        };

        rounds.push(round);
      }

      return {
        ...game,
        players: gamePlayers,
        rounds: rounds,
      };
    } catch (error) {
      throw error;
    }
  },
};
