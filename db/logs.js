const { query } = require("./index");
const Cosmetics = require("./cosmetics");

module.exports = {
  async addTransactionLog(steamID, type, transaction) {
    try {
      await query(
        `
        INSERT INTO player_logs (steam_id, log_event, log_data)
        VALUES ($1, $2, $3)
      `,
        [steamID, type, transaction]
      );
    } catch (error) {
      throw error;
    }
  },

  async getLogsOfType(type) {
    try {
      const { rows } = await query(
        `
        SELECT * FROM player_logs
        WHERE log_event = $1
        ORDER BY log_time DESC
      `,
        [type]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getLogsForPlayer(steamID) {
    try {
      const { rows } = await query(
        `
        SELECT * FROM player_logs
        WHERE steam_id = $1
        ORDER BY log_time DESC
      `,
        [steamID]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getLogsOfTypeForPlayer(steamID, type) {
    try {
      const { rows } = await query(
        `
        SELECT * FROM player_logs
        WHERE steam_id = $1 AND log_event = $2
        ORDER BY log_time DESC
      `,
        [steamID, type]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getLastLogEvent(steamID, event) {
    try {
      const { rows } = await query(
        `
        SELECT * FROM player_logs
        WHERE steam_id = $1 AND log_event = $2
        ORDER BY log_time DESC
      `,
        [steamID, event]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // ------------------------------------
  // Stripe/Paypal Payment logs
  // ------------------------------------

  async getPaypalPayments() {
    try {
      const { rows } = await query(`
        SELECT steam_id, log_time,
          log_data->'capture'->'result'->'purchase_units'->0->'payments'->'captures'->0->'seller_receivable_breakdown'->'gross_amount'->>'value' AS gross_amount,
          log_data->'capture'->'result'->'purchase_units'->0->'payments'->'captures'->0->'seller_receivable_breakdown'->'paypal_fee'->>'value' AS paypal_fee,
          log_data->'capture'->'result'->'purchase_units'->0->'payments'->'captures'->0->'seller_receivable_breakdown'->'net_amount'->>'value' AS net_amount
        FROM player_logs
        WHERE log_event = 'paypal'
        ORDER BY log_time DESC
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async parsePaymentsBreakdown(rows) {
    try {
      const allCosmetics = await Cosmetics.getAllCosmetics();

      const counter = {};
      for (const row of rows) {
        const cosmeticIDs = JSON.parse(row.cosmetic_ids);
        if (!cosmeticIDs) continue;
        for (const cosmeticID of cosmeticIDs) {
          if (counter[cosmeticID]) counter[cosmeticID] += row.count;
          else counter[cosmeticID] = row.count;
        }
      }

      const breakdown = [];
      for (const cosmeticID in counter) {
        const cosmetic = allCosmetics.find(
          (cosmetic) => cosmetic.cosmetic_id == cosmeticID
        );
        breakdown.push({
          name: cosmetic?.cosmetic_name,
          id: cosmetic?.cosmetic_id,
          count: counter[cosmeticID],
          dollars: Number(
            (counter[cosmeticID] * cosmetic?.cost_usd).toFixed(2)
          ),
        });
      }

      breakdown.sort((a, b) => b.dollars - a.dollars);

      return breakdown;
    } catch (error) {
      throw error;
    }
  },

  async getPaypalPurchaseBreakdown(hours) {
    try {
      const args = hours ? [hours] : null;
      const { rows } = await query(
        `
        SELECT 
          DISTINCT (log_data->>'cosmeticIDs') as cosmetic_ids, count(*) :: INTEGER AS count
        FROM player_logs
        WHERE log_event = 'paypal'
        ${hours ? `AND log_time > NOW() - $1 * INTERVAL '1 HOUR'` : ""}
        GROUP BY log_data->>'cosmeticIDs'
        ORDER BY count DESC;
      `,
        args
      );

      return await this.parsePaymentsBreakdown(rows);
    } catch (error) {
      throw error;
    }
  },

  async getPaypalPurchaseBreakdownInRange(start, end) {
    try {
      if (!start) start = new Date(0);
      else start = new Date(start);
      if (!end) end = new Date();
      else end = new Date(end);
      const { rows } = await query(
        `
        SELECT 
          DISTINCT (log_data->>'cosmeticIDs') as cosmetic_ids, count(*) :: INTEGER AS count
        FROM player_logs
        WHERE log_event = 'paypal'
        AND log_time BETWEEN $1 AND $2
        GROUP BY log_data->>'cosmeticIDs'
        ORDER BY count DESC;
      `,
        [start, end]
      );

      return await this.parsePaymentsBreakdown(rows);
    } catch (error) {
      throw error;
    }
  },

  async getTotalPaypalPayments() {
    try {
      const { rows } = await query(`
        SELECT SUM((log_data->'capture'->'result'->'purchase_units'->0->'payments'->'captures'->0->'seller_receivable_breakdown'->'net_amount'->>'value') :: DECIMAL) AS net_amount
        FROM player_logs
        WHERE log_event = 'paypal';
      `);
      return rows[0].net_amount;
    } catch (error) {
      throw error;
    }
  },

  async getPaypalPaymentsByCountry() {
    try {
      const { rows } = await query(`
      SELECT log_data->'capture'->'result'->'payment_source'->'paypal'->'address'->>'country_code' AS country_code,
        SUM((log_data->'capture'->'result'->'purchase_units'->0->'payments'->'captures'->0->'seller_receivable_breakdown'->'net_amount'->>'value') :: DECIMAL) AS net_amount
        FROM player_logs
        WHERE log_event = 'paypal'
        GROUP BY log_data->'capture'->'result'->'payment_source'->'paypal'->'address'->>'country_code'
        ORDER BY net_amount DESC;`);
      return rows[0].amount;
    } catch (error) {
      throw error;
    }
  },

  async getStripePayments() {
    try {
      const { rows } = await query(`
        SELECT steam_id, log_time,
          log_data->'intent'->>'amount' AS amount
        FROM player_logs
        WHERE log_event = 'stripe'
        ORDER BY log_time DESC;
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getTotalStripePayments() {
    try {
      const { rows } = await query(`
        SELECT SUM((log_data->'intent'->>'amount') :: DECIMAL * 0.01) AS amount
        FROM player_logs
        WHERE log_event = 'stripe';`);
      return rows[0].amount;
    } catch (error) {
      throw error;
    }
  },

  async getStripePaymentsByCountry() {
    try {
      // the null countries result is alipay
      const { rows } = await query(`
      SELECT SUM((log_data->'intent'->>'amount') :: DECIMAL * 0.01) AS amount,
        log_data->'intent'->'charges'->'data'->0->'payment_method_details'->'card'->>'country' AS country
      FROM player_logs
      WHERE log_event = 'stripe'
      GROUP BY log_data->'intent'->'charges'->'data'->0->'payment_method_details'->'card'->>'country'
      ORDER BY amount DESC;`);
      return rows[0].amount;
    } catch (error) {
      throw error;
    }
  },

  async getPaypalByEmail(email) {
    try {
      const { rows } = await query(
        `
        SELECT steam_id FROM player_logs
        WHERE log_event = 'paypal'
          AND log_data->'capture'->'result'->'payment_source'->'paypal'->>'email_address' = $1`,
        [email]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },
};
