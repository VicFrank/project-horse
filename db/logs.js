const { query } = require("./index");

module.exports = {
  async addTransactionLog(steamid, type, transaction) {
    try {
      const sql_query = `
      INSERT INTO player_logs (steam_id, log_event, log_data)
      VALUES ($1, $2, $3)
      `;
      await query(sql_query, [steamid, type, transaction]);
    } catch (error) {
      throw error;
    }
  },

  async getLogsOfType(type) {
    try {
      const sql_query = `
      SELECT * FROM player_logs
      WHERE log_event = $1
      ORDER BY log_time DESC
      `;
      const { rows } = await query(sql_query, [type]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getLogsForPlayer(steamID) {
    try {
      const sql_query = `
      SELECT * FROM player_logs
      WHERE steam_id = $1
      ORDER BY log_time DESC
      `;
      const { rows } = await query(sql_query, [steamID]);
      return rows;
    } catch (error) {
      throw error;
    }
  },
};
