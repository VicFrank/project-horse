const { query } = require("./index");
const { getMatchRatingChange } = require("../mmr/mmr");
const Players = require("./players");

module.exports = {
  /**
   * When a player is eliminated/wins, upsert the game and add their stats
   */
  async createGamePlayer(event) {
    const { matchID, steamID, username, ranked, place, rounds } = event;
    const { players, endTime, heroes } = event;

    try {
      await this.upsertGame(matchID, ranked);
      const player = await Players.upsertPlayer(steamID, username);
      const currentMMR = player.mmr;
      let mmrChange = 0;

      if (ranked) {
        const winners = players.filter((p) => !p.hasLost);
        const losers = players.filter(
          (p) => p.hasLost && p.steamID !== steamID
        );
        mmrChange = getMatchRatingChange(currentMMR, winners, losers);
      }

      const { rows: gamePlayerRows } = await query(
        `INSERT INTO game_players(game_id, steam_id, rounds, place, end_time, mmr_change)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [matchID, steamID, rounds, place, endTime, mmrChange]
      );
      const gamePlayerId = gamePlayerRows[0].id;

      await Players.modifyMMR(steamID, mmrChange);

      for (const hero of heroes) {
        const { rows: heroRows } = await query(
          `INSERT INTO game_player_heroes(game_player_id, hero_name, hero_level)
           VALUES ($1, $2, $3)`,
          [gamePlayerId, hero.name, hero.level]
        );
        const heroId = heroRows[0].id;

        for (const ability of hero.abilities) {
          await this.upsertAbility(ability.name, ability.element);
          await query(
            `INSERT INTO hero_abilities(game_player_hero_id, ability_name, ability_level, slot_index)
             VALUES ($1, $2)`,
            [heroId, ability.name, ability.level, ability.slot]
          );
        }
      }

      return { matchID, steamID, mmrChange };
    } catch (error) {
      throw error;
    }
  },

  /**
   * When a game is finished, record post game stats, round results
   */
  async addGameResults(results) {
    const { matchID, roundResults, duration, ranked, cheatsEnabled } = results;

    try {
      await this.upsertGame(matchID, ranked);
      await query(
        `UPDATE games SET duration = $1, chests_enabled = $2, ranked = $3 WHERE id = $4`,
        [duration, cheatsEnabled, ranked, matchID]
      );

      for (const round of roundResults) {
        for (const combat of round.combats) {
          const { rows: combatResultRows } = await query(
            `INSERT INTO combat_results(game_id, round_number)
             VALUES ($1, $2)`,
            [matchID, round.roundNumber]
          );
          const combatResultId = combatResultRows[0].id;

          for (const player of combat.combatants) {
            await query(
              `INSERT INTO combat_players(combat_result_id, steam_id, damage_taken, is_dummy)
               VALUES ($1, $2, $3, $4)`,
              [
                combatResultId,
                player.steamID,
                player.damageTaken,
                player.isDummy,
              ]
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

  async upsertAbility(abilityName, element) {
    try {
      const { rows } = await query(
        `INSERT INTO abilities(ability_name, element)
         VALUES ($1, $2)
         ON CONFLICT(ability_name)
         DO UPDATE SET element = $2
         RETURNING *`,
        [abilityName, element]
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
      WITH recent_games AS (
        SELECT * FROM games
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      )
      SELECT * FROM recent_games rg
      JOIN game_players gp
      USING (game_id)
      ORDER BY created_at DESC
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
};
