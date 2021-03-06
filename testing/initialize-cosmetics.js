const cosmetics = require("../db/cosmetics");
const comseticsList = require("./data/cosmetics-list");
const { dropOdds, typeOdds } = require("./data/chest-rewards");

async function initializeCosmetics() {
  try {
    console.log("Initializing cosmetics...");
    await cosmetics.bulkCreateCosmetics(comseticsList);
    console.log("Cosmetics initialized");
  } catch (error) {
    throw error;
  }
}

async function clearCosmetics() {
  try {
    console.log("Deleting all cosmetics...");
    await cosmetics.deleteAllCosmetics();
    console.log("Cosmetics Deleted");
  } catch (error) {
    throw error;
  }
}

async function addCosmetics() {
  try {
    console.log("Adding cosmetics...");
    await cosmetics.bulkCreateCosmetics([
      {
        name: "gold_card_dazzle",
        type: "Card Frame",
        coins: -1,
        cost_usd: -1,
        equip_group: "",
        rarity: "Immortal",
      },
      {
        name: "gold_card_runeGod",
        type: "Card Frame",
        coins: -1,
        cost_usd: -1,
        equip_group: "",
        rarity: "Immortal",
      },
      {
        name: "gold_card_legionCommander",
        type: "Card Frame",
        coins: -1,
        cost_usd: -1,
        equip_group: "",
        rarity: "Immortal",
      },
      {
        name: "gold_card_brewmaster",
        type: "Card Frame",
        coins: -1,
        cost_usd: -1,
        equip_group: "",
        rarity: "Immortal",
      },
      {
        name: "gold_card_cloudGod",
        type: "Card Frame",
        coins: -1,
        cost_usd: -1,
        equip_group: "",
        rarity: "Immortal",
      },
      {
        name: "gold_card_spiritBreaker",
        type: "Card Frame",
        coins: -1,
        cost_usd: -1,
        equip_group: "",
        rarity: "Immortal",
      },
      {
        name: "gold_card_sorlaKhan",
        type: "Card Frame",
        coins: -1,
        cost_usd: -1,
        equip_group: "",
        rarity: "Immortal",
      },
      {
        name: "gold_card_pudge",
        type: "Card Frame",
        coins: -1,
        cost_usd: -1,
        equip_group: "",
        rarity: "Immortal",
      },
      {
        name: "gold_card_rix",
        type: "Card Frame",
        coins: -1,
        cost_usd: -1,
        equip_group: "",
        rarity: "Immortal",
      },
      {
        name: "gold_card_shopkeeper",
        type: "Card Frame",
        coins: -1,
        cost_usd: -1,
        equip_group: "",
        rarity: "Immortal",
      },
      {
        name: "gold_card_rubick",
        type: "Card Frame",
        coins: -1,
        cost_usd: -1,
        equip_group: "",
        rarity: "Immortal",
      },
      {
        name: "gold_card_lifestealer",
        type: "Card Frame",
        coins: -1,
        cost_usd: -1,
        equip_group: "",
        rarity: "Immortal",
      },
      {
        name: "gold_card_ogreMagi",
        type: "Card Frame",
        coins: -1,
        cost_usd: -1,
        equip_group: "",
        rarity: "Immortal",
      },
      {
        name: "gold_card_aghanim",
        type: "Card Frame",
        coins: -1,
        cost_usd: -1,
        equip_group: "",
        rarity: "Immortal",
      },
      {
        name: "gold_card_ladyAnshu",
        type: "Card Frame",
        coins: -1,
        cost_usd: -1,
        equip_group: "",
        rarity: "Immortal",
      },
      {
        name: "gold_card_donkeyAghanim",
        type: "Card Frame",
        coins: -1,
        cost_usd: -1,
        equip_group: "",
        rarity: "Immortal",
      },
      {
        name: "gold_card_gambler",
        type: "Card Frame",
        coins: -1,
        cost_usd: -1,
        equip_group: "",
        rarity: "Immortal",
      },
      {
        name: "gold_card_phantomAssassin",
        type: "Card Frame",
        coins: -1,
        cost_usd: -1,
        equip_group: "",
        rarity: "Immortal",
      },
      {
        name: "gold_card_alchemist",
        type: "Card Frame",
        coins: -1,
        cost_usd: -1,
        equip_group: "",
        rarity: "Immortal",
      },
      {
        name: "gold_card_kanna",
        type: "Card Frame",
        coins: -1,
        cost_usd: -1,
        equip_group: "",
        rarity: "Immortal",
      },
      {
        name: "gold_card_crystalMaiden",
        type: "Card Frame",
        coins: -1,
        cost_usd: -1,
        equip_group: "",
        rarity: "Immortal",
      },
      {
        name: "gold_card_tinker",
        type: "Card Frame",
        coins: -1,
        cost_usd: -1,
        equip_group: "",
        rarity: "Immortal",
      },
      {
        name: "gold_card_bloodseeker",
        type: "Card Frame",
        coins: -1,
        cost_usd: -1,
        equip_group: "",
        rarity: "Immortal",
      },
      {
        name: "gold_card_centaur",
        type: "Card Frame",
        coins: -1,
        cost_usd: -1,
        equip_group: "",
        rarity: "Immortal",
      },
      {
        name: "gold_card_icefrog",
        type: "Card Frame",
        coins: -1,
        cost_usd: -1,
        equip_group: "",
        rarity: "Immortal",
      },
      {
        name: "gold_card_tomeGod",
        type: "Card Frame",
        coins: -1,
        cost_usd: -1,
        equip_group: "",
        rarity: "Immortal",
      },
    ]);
    console.log("Cosmetics initialized");
  } catch (error) {
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
    throw error;
  }
}
(async function () {
  await addCosmetics();
  await setChestRewards();
})();
