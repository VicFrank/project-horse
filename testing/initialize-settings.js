const { query } = require("../db/index");

const settings = {
  default_god_bans: 0,
  plus_god_bans: 3,
  min_gods_to_ban: 3,
};

async function InitializeSettings() {
  try {
    for (const god of gods) {
      const { god: godName } = god;
      await query(
        `INSERT INTO gods (god_name, free, god_enabled) VALUES ($1, $2, $3)`,
        [godName, false, true]
      );
    }
    console.log(`Initialize gods`);
  } catch (error) {
    throw error;
  }
}

(async function () {
  await InitializeGods();
})();
