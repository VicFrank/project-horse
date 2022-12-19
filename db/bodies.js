const { query } = require("./index");
const games = require("./games");

const getBodyFreqs = async (hours, steamID, minMMR = 0) => {
  try {
    const args = [hours, minMMR];
    if (steamID) args.push(steamID);
    const { rows } = await query(
      `
      WITH g AS (
        SELECT * FROM games
        WHERE games.created_at > NOW() - $1 * INTERVAL '1 HOUR' AND RANKED = TRUE        
      )
      SELECT hero_name, COUNT(*) AS freq
        FROM game_player_heroes
        JOIN game_players USING (game_player_id)
        JOIN g USING (game_id)
        WHERE game_players.mmr > $2
        ${steamID ? `AND game_players.steam_id = $3` : ""}
        GROUP BY hero_name
        ORDER BY freq DESC;
      `,
      args
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

const getWinnerBodyFreqs = async (hours, steamID, minMMR = 0) => {
  try {
    const args = [hours, minMMR];
    if (steamID) args.push(steamID);
    const { rows } = await query(
      `
      WITH g AS (
        SELECT * FROM games
        WHERE games.created_at > NOW() - $1 * INTERVAL '1 HOUR' AND RANKED = TRUE
      )
        SELECT hero_name, COUNT(*) AS freq
        FROM game_player_heroes
        JOIN game_players USING (game_player_id)
        JOIN g USING (game_id)
        WHERE game_players.place = 1
          ${steamID ? `AND game_players.steam_id = $3` : ""}
          AND game_players.mmr > $2
        GROUP BY hero_name
        ORDER BY freq DESC
      `,
      args
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

const getBodies = async () => {
  try {
    // get bodies from games in the last 24 hours
    const { rows } = await query(
      `SELECT DISTINCT hero_name FROM game_player_heroes
      JOIN game_players USING (game_player_id)
      JOIN games USING (game_id)
      WHERE games.created_at > NOW() - 24 * INTERVAL '1 HOUR'
      ORDER BY hero_name ASC;`
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getBodies,
  async getBodyStats(hours = 24, minMMR = 0) {
    try {
      const bodyFreqs = await getBodyFreqs(hours, null, minMMR);
      const winnerBodyFreqs = await getWinnerBodyFreqs(hours, null, minMMR);
      const numGames = await games.getNumGames(hours);

      const combined = bodyFreqs.map((body) => {
        return {
          hero_name: body.hero_name,
          numGames,
          freq: Number(body.freq),
          winner_freq: Number(
            winnerBodyFreqs.find(
              (winnderBody) => winnderBody.hero_name === body.hero_name
            )?.freq ?? 0
          ),
        };
      });

      return combined;
    } catch (error) {
      throw error;
    }
  },
};
