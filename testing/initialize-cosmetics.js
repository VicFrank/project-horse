const cosmetics = require("../db/cosmetics");
const comseticsList = require("./data/cosmetics-list");
const { dropOdds, typeOdds } = require("./data/chest-rewards");
const {
  rareOdds,
  veryRareOdds,
  ultraRareOdds,
} = require("./data/escalating-odds");
const {
  chest_god_unique_1,
  chest_god_unique_2,
  chest_god_unique_3,
  chest_arena_unique_1,
  chest_finisher_unique_1,
} = require("./data/unique-chest-drops");
const players = require("../db/players");

async function initializeCosmetics() {
  try {
    console.log("Initializing cosmetics...");
    await cosmetics.bulkCreateCosmetics(comseticsList);
    console.log("Cosmetics initialized");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function initializeEscalatingOdds() {
  try {
    console.log("Initializing escalating odds...");
    await cosmetics.createEscalatingOddsTable("rare", rareOdds);
    await cosmetics.createEscalatingOddsTable("very_rare", veryRareOdds);
    await cosmetics.createEscalatingOddsTable("ultra_rare", ultraRareOdds);
    console.log("Escalating odds initialized");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function updateEscalatingOddsTable() {
  try {
    console.log("Updating escalating odds...");
    await cosmetics.updateEscalatingOddsTable("rare", rareOdds);
    await cosmetics.updateEscalatingOddsTable("very_rare", veryRareOdds);
    await cosmetics.updateEscalatingOddsTable("ultra_rare", ultraRareOdds);
    console.log("Escalating odds updated");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function initializeUniqueChestDrops(cosmeticName, drops) {
  try {
    console.log("Initializing unique chest drops...");
    const chest = await cosmetics.getCosmeticByName(cosmeticName);
    const chestID = chest.cosmetic_id;
    await cosmetics.createUniqueChestDrops(chestID, drops);
    console.log("Unique chest drops initialized");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function deleteHats() {
  try {
    console.log("Deleting hats...");
    const allCosmetics = await cosmetics.getAllCosmetics();
    for (const cosmetic of allCosmetics) {
      const equipGroups = [
        "avatar_hat",
        "avatar_accessory",
        "avatar_mouth",
        "avatar_eyewear",
        "avatar_emote",
        "avatar_facial_hair",
        "avatar_mouth",
      ];
      if (equipGroups.includes(cosmetic.equip_group)) {
        console.log(`Deleting cosmetic ${cosmetic.cosmetic_name}`);
        await cosmetics.deleteCosmetic(cosmetic.cosmetic_id);
      } else if (cosmetic.cosmetic_type === "Avatar Hat") {
        console.log(`Deleting cosmetic ${cosmetic.cosmetic_name}`);
        await cosmetics.deleteCosmetic(cosmetic.cosmetic_id);
      }
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function addCosmetics() {
  try {
    console.log("Adding cosmetics...");
    await cosmetics.bulkCreateCosmetics([
      {
        name: "card_undying",
        type: "Card Frame",
        coins: -1,
        cost_usd: -1,
        equip_group: "",
        rarity: "Immortal",
      },
      {
        name: "gold_card_undying",
        type: "Card Frame",
        coins: -1,
        cost_usd: -1,
        equip_group: "",
        rarity: "Immortal",
      },
    ]);
    console.log("Cosmetics initialized");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function updateCosmetics() {
  try {
    console.log("Updating cosmetics...");
    const cosmeticsToUpdate = [
      {
        name: "terrain_green",
        type: "Terrain",
        coins: 20000,
        cost_usd: -1,
        equip_group: "terrain",
        rarity: "Common",
      },
      {
        name: "terrain_icelake",
        type: "Terrain",
        coins: 20000,
        cost_usd: -1,
        equip_group: "terrain",
        rarity: "Common",
      },
      {
        name: "terrain_lava",
        type: "Terrain",
        coins: 20000,
        cost_usd: -1,
        equip_group: "terrain",
        rarity: "Common",
      },
      {
        name: "terrain_snow",
        type: "Terrain",
        coins: 20000,
        cost_usd: -1,
        equip_group: "terrain",
        rarity: "Common",
      },
      {
        name: "terrain_tropical",
        type: "Terrain",
        coins: 20000,
        cost_usd: -1,
        equip_group: "terrain",
        rarity: "Common",
      },
      {
        name: "terrain_god_gambler",
        type: "Terrain",
        coins: 20000,
        cost_usd: -1,
        equip_group: "terrain",
        rarity: "Immortal",
      },
      {
        name: "terrain_god_pa",
        type: "Terrain",
        coins: 20000,
        cost_usd: -1,
        equip_group: "terrain",
        rarity: "Immortal",
      },
      {
        name: "terrain_god_rune",
        type: "Terrain",
        coins: 20000,
        cost_usd: -1,
        equip_group: "terrain",
        rarity: "Immortal",
      },
      {
        name: "terrain_xmas",
        type: "Terrain",
        coins: 20000,
        cost_usd: -1,
        equip_group: "terrain",
        rarity: "Immortal",
      },
      {
        name: "terrain_cs",
        type: "Terrain",
        coins: 20000,
        cost_usd: -1,
        equip_group: "terrain",
        rarity: "Immortal",
      },
      {
        name: "terrain_chinese",
        type: "Terrain",
        coins: 20000,
        cost_usd: -1,
        equip_group: "terrain",
        rarity: "Immortal",
      },
      {
        name: "terrain_tf2",
        type: "Terrain",
        coins: 20000,
        cost_usd: -1,
        equip_group: "terrain",
        rarity: "Immortal",
      },
      {
        name: "terrain_brewmaster",
        type: "Terrain",
        coins: 20000,
        cost_usd: -1,
        equip_group: "terrain",
        rarity: "Immortal",
      },
      {
        name: "terrain_boxing",
        type: "Terrain",
        coins: 20000,
        cost_usd: -1,
        equip_group: "terrain",
        rarity: "Immortal",
      },
      {
        name: "terrain_portal",
        type: "Terrain",
        coins: 20000,
        cost_usd: -1,
        equip_group: "terrain",
        rarity: "Immortal",
      },
      {
        name: "terrain_gaben",
        type: "Terrain",
        coins: -1,
        cost_usd: -1,
        equip_group: "terrain",
        rarity: "Immortal",
      },
      {
        name: "terrain_gambit",
        type: "Terrain",
        coins: 20000,
        cost_usd: -1,
        equip_group: "terrain",
        rarity: "Immortal",
      },
      {
        name: "streak_fire",
        type: "Win Streak",
        coins: 10000,
        cost_usd: -1,
        equip_group: "streak",
        rarity: "Immortal",
      },
      {
        name: "streak_santa_greevil",
        type: "Win Streak",
        coins: 10000,
        cost_usd: -1,
        equip_group: "streak",
        rarity: "Immortal",
      },
      {
        name: "streak_cs",
        type: "Win Streak",
        coins: 10000,
        cost_usd: -1,
        equip_group: "streak",
        rarity: "Immortal",
      },
      {
        name: "streak_tf2",
        type: "Win Streak",
        coins: 10000,
        cost_usd: -1,
        equip_group: "streak",
        rarity: "Immortal",
      },
      {
        name: "finisher_lightning",
        type: "Finisher",
        coins: 10000,
        cost_usd: -1,
        equip_group: "finisher",
        rarity: "Common",
      },
      {
        name: "finisher_poison",
        type: "Finisher",
        coins: 10000,
        cost_usd: -1,
        equip_group: "finisher",
        rarity: "Common",
      },
      {
        name: "finisher_rocks",
        type: "Finisher",
        coins: 10000,
        cost_usd: -1,
        equip_group: "finisher",
        rarity: "Common",
      },
      {
        name: "finisher_snow",
        type: "Finisher",
        coins: 10000,
        cost_usd: -1,
        equip_group: "finisher",
        rarity: "Common",
      },
      {
        name: "finisher_god_gambler",
        type: "Finisher",
        coins: 10000,
        cost_usd: -1,
        equip_group: "finisher",
        rarity: "Immortal",
      },
      {
        name: "finisher_god_pa",
        type: "Finisher",
        coins: 10000,
        cost_usd: -1,
        equip_group: "finisher",
        rarity: "Immortal",
      },
      {
        name: "finisher_god_rune",
        type: "Finisher",
        coins: 10000,
        cost_usd: -1,
        equip_group: "finisher",
        rarity: "Immortal",
      },
      {
        name: "finisher_santa_greevil",
        type: "Finisher",
        coins: 10000,
        cost_usd: -1,
        equip_group: "finisher",
        rarity: "Immortal",
      },
      {
        name: "finisher_ak47",
        type: "Finisher",
        coins: 10000,
        cost_usd: -1,
        equip_group: "finisher",
        rarity: "Immortal",
      },
      {
        name: "finisher_tf2",
        type: "Finisher",
        coins: 10000,
        cost_usd: -1,
        equip_group: "finisher",
        rarity: "Immortal",
      },
      {
        name: "spawn_nature",
        type: "SpawnFX",
        coins: 20000,
        cost_usd: -1,
        equip_group: "spawn_fx",
        rarity: "Common",
      },
      {
        name: "spawn_arcane",
        type: "SpawnFX",
        coins: 20000,
        cost_usd: -1,
        equip_group: "spawn_fx",
        rarity: "Common",
      },
      {
        name: "click_boxing",
        type: "ClickFX",
        coins: 20000,
        cost_usd: -1,
        equip_group: "click_fx",
        rarity: "Immortal",
      },
      {
        name: "click_cat",
        type: "ClickFX",
        coins: 20000,
        cost_usd: -1,
        equip_group: "click_fx",
        rarity: "Immortal",
      },
      {
        name: "sfx_gaben_posh",
        type: "SFX",
        equip_group: "sfx_gaben",
        coins: 15000,
        cost_usd: -1,
        rarity: "Common",
      },
      {
        name: "sfx_epic",
        type: "SFX",
        equip_group: "sfx_gaben",
        coins: 15000,
        cost_usd: -1,
        rarity: "Common",
      },
      {
        name: "sfx_sexy",
        type: "SFX",
        equip_group: "sfx_gaben",
        coins: -1,
        cost_usd: -1,
        rarity: "Common",
      },
      {
        name: "sfx_chinese",
        type: "SFX",
        equip_group: "sfx_gaben",
        coins: 15000,
        cost_usd: -1,
        rarity: "Common",
      },
      {
        name: "sfx_heavy_metal",
        type: "SFX",
        equip_group: "sfx_gaben",
        coins: 15000,
        cost_usd: -1,
        rarity: "Common",
      },
      {
        name: "sfx_opera",
        type: "SFX",
        equip_group: "sfx_gaben",
        coins: 15000,
        cost_usd: -1,
        rarity: "Common",
      },
      {
        name: "sfx_old_wizard",
        type: "SFX",
        equip_group: "sfx_gaben",
        coins: 15000,
        cost_usd: -1,
        rarity: "Common",
      },
    ];
    for (const c of cosmeticsToUpdate) {
      const cosmetic = await cosmetics.getCosmeticByName(c.name);
      if (!cosmetic) throw new Error(`Cosmetic ${c.name} does not exist`);
      await cosmetics.updateCosmetic(
        cosmetic.cosmetic_id,
        c.name,
        c.type,
        c.equip_group,
        c.coins,
        c.cost_usd,
        c.rarity
      );
      console.log(`Updated cosmetic ${c.name}`);
    }
    console.log("Cosmetics updated");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function setChestRewards() {
  try {
    console.log("Setting chest rewards...");
    await cosmetics.clearChestDrops();

    for (const [chestName, chestDrops] of Object.entries(dropOdds)) {
      const chest = await cosmetics.getCosmeticByName(chestName);
      if (!chest) throw new Error(`Chest/Cosmetic ${chestName} does not exist`);
      const chestID = chest.cosmetic_id;
      let cumSumOdds = 0;
      for (const drop of chestDrops) {
        let { type, odds } = drop;
        if (odds < 0) odds = 100 / chestDrops.length;
        cumSumOdds += odds;
        await cosmetics.addChestDropType(chestID, type, cumSumOdds);
      }
    }

    for (const [type, rewards] of Object.entries(typeOdds)) {
      let cumSumOdds = 0;
      for (const reward of rewards) {
        let { odds, item_name } = reward;
        if (odds < 0) odds = 100 / rewards.length;
        const cosmetic = await cosmetics.getCosmeticByName(item_name);
        if (!cosmetic) throw new Error(`Cosmetic ${item_name} does not exist`);
        const cosmeticID = cosmetic.cosmetic_id;
        cumSumOdds += odds;
        await cosmetics.addDropTypeRewards(type, cosmeticID, cumSumOdds);
      }
    }
    console.log("Chest rewards set");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function addDefaultCosmeticsToAllPlayers() {
  try {
    console.log("Adding default cosmetics to all players...");
    const defaultCosmetics = await cosmetics.getDefaultCosmetics();
    const allSteamIDs = await players.getAllSteamIDs();
    for (const steamID of allSteamIDs) {
      for (const cosmetic of defaultCosmetics) {
        const hasCosmetic = await players.hasCosmetic(
          steamID,
          cosmetic.cosmetic_id
        );
        if (!hasCosmetic) {
          await players.giveCosmeticByName(steamID, cosmetic.cosmetic_name);
        }
      }
    }
    console.log("Default cosmetics added to all players");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function addCosmeticsToPlayers() {
  const steamIDs = [
    "76561197960956468",
    "76561198030851434",
    "76561198100383941",
    "76561198051143960",
    "76561197960492311",
    "76561198163991316",
    "76561198032067769",
  ];
  const cosmeticsToGive = [
    {
      cosmeticName: "chest_god",
      amount: 1,
    },
    {
      cosmeticName: "chest_basic",
      amount: 5,
    },
    {
      cosmeticName: "get_xp_1000",
      amount: 2,
    },
    {
      cosmeticName: "gold_10000",
      amount: 1,
    },
  ];
  // const terrains = [
  //   "terrain_green",
  //   "terrain_icelake",
  //   "terrain_lava",
  //   "terrain_snow",
  //   "terrain_tropical",
  // ];
  try {
    console.log("Adding cosmetics to players...");
    const transaction = { items: {} };
    for (const cosmetic of cosmeticsToGive) {
      const dbComsetic = await cosmetics.getCosmeticByName(
        cosmetic.cosmeticName
      );
      transaction.items[dbComsetic.cosmetic_id] = cosmetic.amount;
    }
    for (const steamID of steamIDs) {
      const playerTransaction = { ...transaction };
      // const playerCosmetics = await players.getCosmetics(steamID);
      // const missingTerrains = terrains.filter(
      //   (terrain) =>
      //     !playerCosmetics.some(
      //       (cosmetic) => cosmetic.cosmetic_name === terrain
      //     )
      // );
      // // pick a random terrain they don't already have
      // if (missingTerrains.length > 0) {
      //   const randomTerrain =
      //     missingTerrains[Math.floor(Math.random() * missingTerrains.length)];
      //   const terrainCosmetic = await cosmetics.getCosmeticByName(
      //     randomTerrain
      //   );
      //   playerTransaction.items[terrainCosmetic.cosmetic_id] = 1;
      // }
      try {
        console.log(`Adding cosmetics to ${steamID}`);
        await players.doItemTransaction(steamID, playerTransaction);
      } catch (error) {
        console.log(`Error adding cosmetics to ${steamID}`);
        console.log(`Transaction: ${playerTransaction.items}`);
      }
    }
    console.log("cosmetics added to players");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

(async function () {
  // await initializeCosmetics();
  // await addCosmeticsToPlayers();
  // await setChestRewards();
  await updateCosmetics();
  // await initializeEscalatingOdds();
  // await addCosmetics();
  // await initializeUniqueChestDrops("chest_god_unique_1", chest_god_unique_1);
  // await initializeUniqueChestDrops("chest_god_unique_2", chest_god_unique_2);
  // await initializeUniqueChestDrops("chest_god_unique_3", chest_god_unique_3);
  // await initializeUniqueChestDrops(
  //   "chest_arena_unique_1",
  //   chest_arena_unique_1
  // );
  // await initializeUniqueChestDrops(
  //   "chest_finisher_unique_1",
  //   chest_finisher_unique_1
  // );
  // updateEscalatingOddsTable();
})();
