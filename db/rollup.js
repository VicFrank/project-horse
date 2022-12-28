const { query } = require("./index");

module.exports = {
  async runGodRollup() {
    try {
      await query("select * from rollup_gods_all();");
    } catch (error) {
      throw error;
    }
  }
};