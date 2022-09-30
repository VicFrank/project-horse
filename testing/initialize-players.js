const Players = require("../db/players");
const Logs = require("../db/logs");
const { query } = require("../db/index");

async function initializePlayerGods() {
  try {
    console.log("Initializing player gods...");
    const { rows: players } = await query(`
      SELECT DISTINCT(steam_id) FROM player_logs
      WHERE log_event = 'god_opened'`);
    console.log(`Found ${players.length} players with gods opened`);

    for (const player of players) {
      // Initializing player gods
      const { steam_id } = player;
      const loggedGods = await Logs.getLogsOfTypeForPlayer(
        steam_id,
        "god_opened"
      );
      const distinctGods = new Set();
      for (const god of loggedGods) {
        distinctGods.add(god.log_data.cosmeticName);
      }
      for (const cosmeticName of distinctGods) {
        const godName = cosmeticName.split("_")[1];
        const numOpened = loggedGods.filter(
          (log) => log.log_data.cosmeticName === cosmeticName
        ).length;
        if (numOpened > 1) {
          const numTops = await Players.getNumTopsWithGod(steam_id, godName);
          console.log(
            `Initializing ${steam_id} with ${numOpened} ${godName} and ${numTops} tops`
          );
          await Players.addPlayerGod(
            steam_id,
            godName,
            numTops + (numOpened - 1) * 10
          );
        }
      }
    }

    console.log("Done initializing player gods");
  } catch (error) {
    console.log(error);
    throw error;
  }
}

(async () => {
  await initializePlayerGods();
})();
