const { query } = require("./index");

module.exports = {
  async addTransactionLog(steamID, type, transaction) {
    try {
      const sql_query = `
      INSERT INTO player_logs (steam_id, log_event, log_data)
      VALUES ($1, $2, $3)
      `;
      await query(sql_query, [steamID, type, transaction]);
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

  async getPaypalPayments() {
    try {
      const sql_query = `
      SELECT steam_id, log_time,
        log_data->'capture'->'result'->'purchase_units'->0->'payments'->'captures'->0->'seller_receivable_breakdown'->'gross_amount'->>'value' AS gross_amount,
        log_data->'capture'->'result'->'purchase_units'->0->'payments'->'captures'->0->'seller_receivable_breakdown'->'paypal_fee'->>'value' AS paypal_fee,
        log_data->'capture'->'result'->'purchase_units'->0->'payments'->'captures'->0->'seller_receivable_breakdown'->'net_amount'->>'value' AS net_amount
      FROM player_logs
      WHERE log_event = 'paypal'
      ORDER BY log_time DESC
      `;
      const { rows } = await query(sql_query);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getTotalPaypalPayments() {
    try {
      const sql_query = `
      SELECT SUM((log_data->'capture'->'result'->'purchase_units'->0->'payments'->'captures'->0->'seller_receivable_breakdown'->'net_amount'->>'value') :: DECIMAL) AS net_amount
      FROM player_logs
      WHERE log_event = 'paypal';
      `;
      const { rows } = await query(sql_query);
      return rows[0].net_amount;
    } catch (error) {
      throw error;
    }
  },

  async getStripePayments() {
    try {
      const sql_query = `
      SELECT steam_id, log_time,
        log_data->'intent'->>'amount' AS amount
      FROM player_logs
      WHERE log_event = 'stripe'
      ORDER BY log_time DESC;
      `;
      const { rows } = await query(sql_query);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getTotalStripePayments() {
    try {
      const sql_query = `
      SELECT SUM((log_data->'intent'->>'amount') :: DECIMAL * 0.01) AS amount
      FROM player_logs
      WHERE log_event = 'stripe';`;
      const { rows } = await query(sql_query);
      return rows[0].amount;
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

  async getLogsOfTypeForPlayer(steamID, type) {
    try {
      const sql_query = `
      SELECT * FROM player_logs
      WHERE steam_id = $1 AND log_event = $2
      ORDER BY log_time DESC
      `;
      const { rows } = await query(sql_query, [steamID, type]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getLastLogEvent(steamID, event) {
    try {
      const sql_query = `
      SELECT * FROM player_logs
      WHERE steam_id = $1 AND log_event = $2
      ORDER BY log_time DESC
      `;
      const { rows } = await query(sql_query, [steamID, event]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },
};
