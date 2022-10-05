const { Pool } = require("pg");
const keys = require("../config/keys");
const pgp = require("pg-promise")();

const poolValues = process.env.IS_PRODUCTION
  ? keys.sql.production
  : keys.sql.dev;

const pool = new Pool(poolValues);
const db = pgp(pool);

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params);
  },
  pool,
  getClient: async () => {
    return await pool.connect();
  },
  db,
};
