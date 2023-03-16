// player scripts

async function fixChestRewards() {
  console.log("Fixing chest rewards...");
  try {
    const uniqueChest2 = await Cosmetics.getCosmeticByName(
      "chest_god_unique_2"
    );
    const uniqueChestID = await Cosmetics.getUniqueChestID(
      uniqueChest2.cosmetic_id
    );
    const { rows } = await query(
      `
      SELECT steam_id, count(*) FROM player_logs
      WHERE log_event = 'open_unique_chest' AND log_data->>'chestCosmeticID' = $1
      GROUP BY steam_id
      ORDER BY count(*) DESC;`,
      [uniqueChest2.cosmetic_id]
    );

    const brew = await Cosmetics.getCosmeticByName("card_brewmaster");
    const ct = await Cosmetics.getCosmeticByName("card_counterTerrorist");
    const icefrog = await Cosmetics.getCosmeticByName("card_icefrog");
    for (const row of rows) {
      const { steam_id: steamID, count } = row;
      console.log(`Player ${steamID} has opened ${count} chests`);
      const playerCosmetics = await Players.getCosmetics(steamID);
      const hasBrew = playerCosmetics.some(
        (cosmetic) => cosmetic.cosmetic_name === "card_brewmaster"
      );
      const hasCT = playerCosmetics.some(
        (cosmetic) => cosmetic.cosmetic_name === "card_counterTerrorist"
      );
      const hasIcefrog = playerCosmetics.some(
        (cosmetic) => cosmetic.cosmetic_name === "card_icefrog"
      );

      // if the player has opened > 10, just give them new gods they're missing
      if (count > 10) {
        if (!hasBrew) {
          await Players.giveCosmeticByName(steamID, brew.cosmetic_name);
          console.log(`Gave player Brewmaster card`);
        }
        if (!hasCT) {
          await Players.giveCosmeticByName(steamID, ct.cosmetic_name);
          console.log(`Gave player counterTerrorist card`);
        }
        if (!hasIcefrog) {
          await Players.giveCosmeticByName(steamID, icefrog.cosmetic_name);
          console.log(`Gave player Icefrog card`);
        }
      } else {
        // for the rest, just work to set their odds properly
        if (!hasBrew) {
          await Players.setMissedDropCount(
            uniqueChestID,
            brew.cosmetic_id,
            steamID,
            count
          );
          console.log(`Set missed drop count for Brewmaster card to ${count}`);
        }
        if (!hasCT) {
          await Players.setMissedDropCount(
            uniqueChestID,
            ct.cosmetic_id,
            steamID,
            count
          );
          console.log(
            `Set missed drop count for counterTerrorist card to ${count}`
          );
        }
        if (!hasIcefrog) {
          await Players.setMissedDropCount(
            uniqueChestID,
            icefrog.cosmetic_id,
            steamID,
            count
          );
          console.log(`Set missed drop count for Icefrog card to ${count}`);
        }
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function refundChests() {
  try {
    console.log("Refunding chests...");
    const arenaChest = await Cosmetics.getCosmeticByName(
      "chest_arena_unique_1"
    );
    const finisherChest = await Cosmetics.getCosmeticByName(
      "chest_finisher_unique_1"
    );

    const refundChest = async (chest) => {
      const { rows } = await query(
        `
        SELECT steam_id, count(*) FROM player_logs
        WHERE log_event = 'consume_item' AND log_data->>'cosmeticName' = $1
        GROUP BY steam_id
        ORDER BY count(*) DESC;`,
        [chest.cosmetic_name]
      );

      for (const row of rows) {
        const { steam_id: steamID, count } = row;
        console.log(
          `Player ${steamID} has opened ${count} ${chest.cosmetic_name} chests`
        );

        const promises = [];
        for (let i = 0; i < count; i++) {
          promises.push(
            Players.giveCosmeticByName(steamID, chest.cosmetic_name)
          );
        }
        await Promise.all(promises);
      }
    };

    await refundChest(arenaChest);
    await refundChest(finisherChest);
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
