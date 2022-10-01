const { Pool } = require("pg");
const keys = require("../config/keys");

const poolValues = process.env.IS_PRODUCTION
  ? keys.sql.production
  : keys.sql.dev;

const pool = new Pool(poolValues);

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params);
  },
  pool,
  getClient: async () => {
    return await pool.connect();
  },
};
