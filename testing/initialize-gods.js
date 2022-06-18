const { query } = require("../db/index");

async function InitializeGods() {
  const getAllGods = async () => {
    try {
      const { rows } = await query(`SELECT DISTINCT(god) FROM game_players`);
      return rows;
    } catch (error) {
      throw error;
    }
  };

  try {
    const gods = await getAllGods();
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
