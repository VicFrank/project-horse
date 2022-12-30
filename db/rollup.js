const { query } = require("./index");

module.exports = {
  async runGodRollup() {
    try {
      await query("select * from rollup_gods_all();");
    } catch (error) {
      throw error;
    }
  }, 
  async getMmrOptions() {
    try {
      await query("select * from rollup_types where category = 'mmr';");
    } catch (error) {
      throw error;
    }
  }
};