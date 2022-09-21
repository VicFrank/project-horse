const cosmetics = require("../db/cosmetics");
const comseticsList = require("./data/cosmetics-list");
const { dropOdds, typeOdds } = require("./data/chest-rewards");
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

async function clearCosmetics() {
  try {
    console.log("Deleting all cosmetics...");
    await cosmetics.deleteAllCosmetics();
    console.log("Cosmetics Deleted");
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
        name: "name_rainbow",
        type: "Name Color",
        coins: -1,
        cost_usd: -1,
        equip_group: "name_color",
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
        name: "gold_card_tinker",
        type: "Card Frame",
        coins: -1,
        cost_usd: -1,
        equip_group: "",
        rarity: "Immortal",
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
    "76561197964547457", // Synderen
    "76561197980022982", // SingSing
    "76561198047076771", // funky-deserver
    "76561198065444496", // Beep beep
    "76561198053098358", // Gothmog
    "76561198026562132", // Purge
    "76561198030654385", // Grass
    "76561197979938082", // NoTail
  ];
  const cosmeticsToGive = [
    {
      cosmeticName: "chest_god",
      amount: 4,
    },
    {
      cosmeticName: "chest_basic",
      amount: 6,
    },
    {
      cosmeticName: "gold_10000",
      amount: 2,
    },
    {
      cosmeticName: "plus_year_package",
      amount: 1,
    },
    {
      cosmeticName: "buy_bp",
      amount: 1,
    },
    {
      cosmeticName: "finisher_fire",
      amount: 1,
    },
    {
      cosmeticName: "terrain_lava",
      amount: 1,
    },
  ];
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
      console.log(`Adding cosmetics to ${steamID}`);
      await players.doItemTransaction(steamID, transaction);
    }
    console.log("cosmetics added to players");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

(async function () {
  await addCosmeticsToPlayers();
})();
