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
        name: "drop_gold_50",
        type: "Consumable",
        coins: -1,
        cost_usd: -1,
        equip_group: "",
        rarity: "Common",
      },
      {
        name: "drop_gold_100",
        type: "Consumable",
        coins: -1,
        cost_usd: -1,
        equip_group: "",
        rarity: "Uncommon",
      },
      {
        name: "drop_gold_200",
        type: "Consumable",
        coins: -1,
        cost_usd: -1,
        equip_group: "",
        rarity: "Rare",
      },
      {
        name: "drop_gold_400",
        type: "Consumable",
        coins: -1,
        cost_usd: -1,
        equip_group: "",
        rarity: "Mythical",
      },
      {
        name: "drop_gold_1000",
        type: "Consumable",
        coins: -1,
        cost_usd: -1,
        equip_group: "",
        rarity: "Legendary",
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
    "76561197960956468",
    "76561198030851434",
    "76561198100383941",
    "76561198051143960",
    "76561197960492311",
    "76561198163991316",
    "76561198032067769",
    "76561198062147437",
    "76561198073875384",
    "76561199361117280",
    "76561198046924672",
    "76561198196347482",
    "76561197965713836",
    "76561198038585619",
    "76561198015090174",
    "76561198062702863",
    "76561197972146151",
    "76561197992736421",
    "76561198060995716",
    "76561198210150589",
    "76561198050386716",
    "76561197996590553",
    "76561198055411597",
    "76561198835488804",
    "76561198107609603",
    "76561198215550188",
    "76561198170211269",
    "76561198203634725",
    "76561198862719145",
    "76561198055012951",
    "76561197984279756",
    "76561198117739005",
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
  const terrains = [
    "terrain_green",
    "terrain_icelake",
    "terrain_lava",
    "terrain_snow",
    "terrain_tropical",
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
      const playerTransaction = { ...transaction };
      const playerCosmetics = await players.getCosmetics(steamID);
      const missingTerrains = terrains.filter(
        (terrain) =>
          !playerCosmetics.some(
            (cosmetic) => cosmetic.cosmetic_name === terrain
          )
      );
      // pick a random terrain they don't already have
      if (missingTerrains.length > 0) {
        const randomTerrain =
          missingTerrains[Math.floor(Math.random() * missingTerrains.length)];
        const terrainCosmetic = await cosmetics.getCosmeticByName(
          randomTerrain
        );
        playerTransaction.items[terrainCosmetic.cosmetic_id] = 1;
      }
      try {
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

async function addCosmeticsToPlayers2() {
  const steamIDs = [
    "76561198127333961",
    "76561198016200710",
    "76561198298288881",
    "76561198136759975",
    "76561198009301821",
    "76561197984248468",
    "76561198065226187",
    "76561197967752572",
    "76561198053914956",
    "76561198064078512",
    "76561198020855296",
    "76561198062322065",
    "76561198831378830",
    "76561199098901050",
    "76561198147266881",
    "76561198116211502",
    "76561198051995905",
    "76561198147807343",
    "76561199068343820",
    "76561198056142195",
    "76561198065248886",
    "76561198277799112",
    "76561198351966589",
    "76561197972270598",
    "76561197969530199",
    "76561197998070166",
    "76561198069117836",
    "76561198321392936",
    "76561198049776766",
    "76561198061197976",
    "76561198271953749",
    "76561198202529637",
    "76561198071527919",
    "76561197963010074",
    "76561198230559200",
    "76561198063980268",
    "76561198407804067",
    "76561197980346655",
    "76561198012679361",
    "76561198062766078",
    "76561198116634592",
    "76561198003336439",
    "76561198072181245",
    "76561198223132960",
    "76561198153939374",
    "76561198156894371",
    "76561198389696579",
    "76561198267603015",
    "76561198327575850",
    "76561198105386769",
    "76561198025640316",
    "76561198057008689",
    "76561197962289467",
    "76561198116085046",
    "76561198018645863",
    "76561198836229318",
    "76561198116416703",
    "76561198036980494",
    "76561198026562132",
    "76561198130043527",
    "76561198146451273",
    "76561198022133258",
    "76561198091596850",
    "76561198034466568",
    "76561198026565302",
    "76561197997985965",
    "76561198046993407",
    "76561198007141460",
    "76561198037291452",
    "76561198923299517",
    "76561198047298781",
    "76561198046221011",
    "76561199027423289",
    "76561197989996845",
    "76561198057446175",
    "76561198094856952",
    "76561197992330921",
    "76561197991912137",
    "76561198040936458",
    "76561197961490664",
    "76561198046920629",
    "76561197964547457",
    "76561197963873337",
    "76561197995932207",
    "76561198022220190",
    "76561198096346626",
  ];
  const cosmeticsToGive = [
    {
      cosmeticName: "chest_god",
      amount: 1,
    },
    {
      cosmeticName: "chest_basic",
      amount: 3,
    },
    {
      cosmeticName: "get_xp_1000",
      amount: 1,
    },
  ];
  try {
    console.log("Adding cosmetics to players...");
    const transaction = { items: {}, coins: 5000 };
    for (const cosmetic of cosmeticsToGive) {
      const dbComsetic = await cosmetics.getCosmeticByName(
        cosmetic.cosmeticName
      );
      transaction.items[dbComsetic.cosmetic_id] = cosmetic.amount;
    }
    for (const steamID of steamIDs) {
      console.log(`Adding cosmetics to ${steamID}`);
      try {
        await players.doItemTransaction(steamID, transaction);
      } catch (error) {
        console.log(`Error adding cosmetics to ${steamID}`);
      }
    }
    console.log("cosmetics added to players");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

(async function () {
  // await addCosmetics();
  // await setChestRewards();
  // await addCosmeticsToPlayers();
  await addCosmeticsToPlayers2();
})();
