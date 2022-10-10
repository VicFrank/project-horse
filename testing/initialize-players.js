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

async function giveDropRewards() {
  try {
    const { rows: players2 } = await query(`
      select steam_id from player_logs
      where log_event = 'consume_item'
      AND log_data->>'cosmeticName' = 'drop_gold_4000';`);
    console.log(`Found ${players2.length} players with drop rewards`);

    for (const player of players2) {
      const { steam_id } = player;
      await Players.modifyCoins(steam_id, 4000);
      await Logs.addTransactionLog(steam_id, "fix_bad_drops", {
        steamID: steam_id,
        coins: 4000,
      });
    }

    console.log("Done giving drop rewards");
  } catch (error) {
    console.log(error);
    throw error;
  }
}

(async () => {
  await giveDropRewards();
})();
