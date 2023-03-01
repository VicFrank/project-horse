const Players = require("../db/players");
const Cosmetics = require("../db/cosmetics");
const Logs = require("../db/logs");
const rollup = require("../db/rollup");

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
      AND log_data->>'cosmeticName' = 'drop_gold_4000'`);
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

async function logSeasonResults(season) {
  try {
    console.log("Logging season results...");
    const leaderboard = await Players.getFullLeaderboard();
    console.log(`Found ${leaderboard.length} players in leaderboard`);
    for (const player of leaderboard) {
      const { steam_id, mmr, rank } = player;
      await query(
        `INSERT INTO player_season_results (season, steam_id, mmr, leaderboard_rank) VALUES ($1, $2, $3, $4)`,
        [season, steam_id, mmr, rank]
      );
    }
    console.log("Done logging season results");
  } catch (error) {
    throw error;
  }
}

async function giveEndOfSeasonRewards() {
  const firstRewards = [
    {
      cosmeticName: "terrain_champion",
      amount: 1,
    },
    {
      cosmeticName: "hat_rainbow_trophy",
      amount: 1,
    },
    {
      cosmeticName: "streak_space",
      amount: 1,
    },
  ];
  const topTenRewards = [
    {
      cosmeticName: "terrain_leaderboard",
      amount: 1,
    },
    {
      cosmeticName: "hat_diamond_trophy",
      amount: 1,
    },
    {
      cosmeticName: "streak_space",
      amount: 1,
    },
  ];
  const top100Rewards = [
    {
      cosmeticName: "hat_gold_trophy",
      amount: 1,
    },
  ];

  const giveRewardsToPlayers = async (steamIDs, rewards) => {
    const transaction = { items: {} };
    for (const cosmetic of rewards) {
      const dbComsetic = await Cosmetics.getCosmeticByName(
        cosmetic.cosmeticName
      );
      transaction.items[dbComsetic.cosmetic_id] = cosmetic.amount;
    }

    try {
      for (const steamID of steamIDs) {
        const playerTransaction = { ...transaction };
        try {
          console.log(
            `Giving rewards to ${steamID} {${JSON.stringify(rewards)}}`
          );
          await Players.doItemTransaction(steamID, playerTransaction);
        } catch (error) {
          console.log(`Error adding cosmetics to ${steamID}`);
          console.log(`Transaction: ${playerTransaction.items}`);
        }
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  try {
    console.log("Giving rewards to players...");

    const leaderboard = await Players.getLeaderboard();

    const firstPlace = leaderboard[0];
    const topTen = leaderboard.slice(1, 10);
    const top100 = leaderboard.slice(10, 100);

    await giveRewardsToPlayers([firstPlace.steam_id], firstRewards);
    await giveRewardsToPlayers(
      topTen.map((player) => player.steam_id),
      topTenRewards
    );
    await giveRewardsToPlayers(
      top100.map((player) => player.steam_id),
      top100Rewards
    );

    console.log("Rewards added to players");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * This is the script to reset the ladder at the end of the season
 * Ladder MMR is set to two ranks down
 * Normal MMR is the mean of current MMR and 1000
 */
async function ladderReset(season) {
  console.log("Resetting ladder...");
  await logSeasonResults(season);
  try {
    await query(`UPDATE Players SET mmr = (mmr + 1000) / 2`);
    await query(`UPDATE Players SET ladder_mmr = 0 WHERE ladder_mmr < 1500`);
    await query(
      `UPDATE Players SET ladder_mmr = 500 WHERE ladder_mmr < 2000 AND ladder_mmr >= 1500`
    );
    await query(
      `UPDATE Players SET ladder_mmr = 1000 WHERE ladder_mmr < 2500 AND ladder_mmr >= 2000`
    );
    await query(
      `UPDATE Players SET ladder_mmr = 1500 WHERE ladder_mmr < 3500 AND ladder_mmr >= 2500`
    );
    await query(
      `UPDATE Players SET ladder_mmr = 2000 WHERE ladder_mmr < 4500 AND ladder_mmr >= 3500`
    );
    await query(
      `UPDATE Players SET ladder_mmr = 2500 WHERE ladder_mmr >= 4500`
    );

    console.log("Done resetting ladder");
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function updateGodChests() {
  console.log("Updating god chests...");
  try {
    const godChest = await Cosmetics.getCosmeticByName("chest_god");
    const newGodChest = await Cosmetics.getCosmeticByName("chest_god_unique_1");
    const godChestID = godChest.cosmetic_id;
    const newGodChestID = newGodChest.cosmetic_id;
    await query(
      "UPDATE player_cosmetics SET cosmetic_id = $2 WHERE cosmetic_id = $1",
      [godChestID, newGodChestID]
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function addOldBattlepassIcons() {
  console.log("Updating Lifestealer cards...");
  try {
    const { rows } = await query(`
      SELECT * FROM player_logs
      WHERE log_event = 'consume_item' AND log_data->>'cosmeticName' = 'buy_bp';`);

    const s1 = await Cosmetics.getCosmeticByName("bp_s1");
    const s2 = await Cosmetics.getCosmeticByName("bp_s2");
    const s3 = await Cosmetics.getCosmeticByName("bp_s3");
    const s4 = await Cosmetics.getCosmeticByName("bp_s4");
    for (const row of rows) {
      const { steamID } = row.log_data;
      const { log_time } = row;
      const purchaseMonth = new Date(log_time).getMonth();
      if (purchaseMonth === 12) {
        await Players.giveCosmeticByName(steamID, s4.cosmetic_name);
        console.log(`Gave player Battle Pass Season 4`);
      }
      if (purchaseMonth === 11) {
        await Players.giveCosmeticByName(steamID, s3.cosmetic_name);
        console.log(`Gave player Battle Pass Season 3`);
      }
      if (purchaseMonth === 10) {
        await Players.giveCosmeticByName(steamID, s2.cosmetic_name);
        console.log(`Gave player Battle Pass Season 2`);
      }
      if (purchaseMonth < 10) {
        await Players.giveCosmeticByName(steamID, s1.cosmetic_name);
        console.log(`Gave player Battle Pass Season 1`);
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

(async () => {
  await giveEndOfSeasonRewards();
  await ladderReset(2);
  // await rollup.runGodRollup();
})();
