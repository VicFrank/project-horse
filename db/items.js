const { query } = require("./index");
const games = require("./games");
const players = require("./players");

const getItemFreqs = async (hours, steamID, minMMR = 0) => {
  try {
    const args = [hours, minMMR];
    if (steamID) args.push(steamID);
    const { rows } = await query(
      `
      WITH g AS (
        SELECT * FROM games
        WHERE games.created_at > NOW() - $1 * INTERVAL '1 HOUR' AND RANKED = TRUE        
      )
      SELECT item_name, COUNT(*) AS freq
        FROM game_player_pantheon_items
        JOIN game_players USING (game_player_id)
        JOIN g USING (game_id)
        WHERE game_players.mmr > $2
        ${steamID ? `AND game_players.steam_id = $3` : ""}
        GROUP BY item_name
        ORDER BY freq DESC;
      `,
      args
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

const getWinnerItemFreqs = async (hours, steamID, minMMR = 0) => {
  try {
    const args = [hours, minMMR];
    if (steamID) args.push(steamID);
    const { rows } = await query(
      `
      WITH g AS (
        SELECT * FROM games
        WHERE games.created_at > NOW() - $1 * INTERVAL '1 HOUR' AND RANKED = TRUE
      )
      SELECT item_name, COUNT(*) AS freq
        FROM game_player_pantheon_items
        JOIN game_players USING (game_player_id)
        JOIN g USING (game_id)
        WHERE game_players.place = 1
          ${steamID ? `AND game_players.steam_id = $3` : ""}
          AND game_players.mmr > $2
        GROUP BY item_name
        ORDER BY freq DESC
      `,
      args
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

const getItemPickOrders = async (hours, steamID, minMMR = 0) => {
  try {
    const args = [hours, minMMR];
    if (steamID) args.push(steamID);
    const { rows } = await query(
      `
      WITH g AS (
        SELECT * FROM games
        WHERE games.created_at > NOW() - $1 * INTERVAL '1 HOUR' AND RANKED = TRUE
      )
      SELECT item_name, pick, COUNT(*) AS freq
        FROM game_player_pantheon_items
        JOIN game_players USING (game_player_id)
        JOIN g USING (game_id)
        WHERE game_players.mmr > $2
          ${steamID ? `AND game_players.steam_id = $3` : ""}
        GROUP BY item_name, pick
        ORDER BY item_name, pick
      `,
      args
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  async getItems() {
    try {
      const { rows } = await query(
        `SELECT * FROM items ORDER BY item_name ASC`
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async getItemStats(hours = 24, minMMR = 0) {
    try {
      const itemFreqs = await getItemFreqs(hours, null, minMMR);
      const winnerItemFreqs = await getWinnerItemFreqs(hours, null, minMMR);
      const items = await this.getItems();
      const numGames = await games.getNumGames(hours);

      // combine the three arrays
      const combined = itemFreqs.map((item) => {
        const dbItem = items.find((i) => i.item_name === item.item_name);

        return {
          item_name: item.item_name,
          icon: dbItem.icon,
          tier: dbItem.tier,
          numGames,
          freq: Number(item.freq),
          winner_freq: Number(
            winnerItemFreqs.find(
              (winnerItem) => winnerItem.item_name === item.item_name
            )?.freq ?? 0
          ),
        };
      });

      // sort by tier, then by freq
      combined.sort((a, b) => {
        if (a.tier === b.tier) {
          return b.freq - a.freq;
        }
        return a.tier - b.tier;
      });

      return combined;
    } catch (error) {
      throw error;
    }
  },
};
