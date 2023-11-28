const { query } = require("./index");

module.exports = {
  async generateCode() {
    try {
      const randomString = Math.random().toString(36);
      await query(`INSERT INTO gaimin_codes (code) VALUES ($1)`, [
        randomString,
      ]);
      return randomString;
    } catch (error) {
      throw error;
    }
  },

  async checkCode(code) {
    try {
      const { rows } = await query(
        `SELECT * FROM gaimin_codes WHERE code = $1`,
        [code]
      );
      return rows.length > 0;
    } catch (error) {
      throw error;
    }
  },

  async deleteCode(code) {
    try {
      await query(`DELETE FROM gaimin_codes WHERE code = $1`, [code]);
    } catch (error) {
      throw error;
    }
  },
};
