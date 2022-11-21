const { query } = require("../db/index");

// INSERT INTO gods (god_name, free) VALUES ('caveJohnson', false);
// INSERT INTO cosmetics (cosmetic_name, cosmetic_type, equip_group, cost_coins, cost_usd, rarity) VALUES ('card_caveJohnson', 'Card Frame', '', -1, -1, 'Immortal');
// INSERT INTO cosmetics (cosmetic_name, cosmetic_type, equip_group, cost_coins, cost_usd, rarity) VALUES ('gold_card_caveJohnson', 'Card Frame', '', -1, -1, 'Immortal');
// INSERT INTO gods (god_name, free) VALUES ('chaosGodS3', false);
// INSERT INTO cosmetics (cosmetic_name, cosmetic_type, equip_group, cost_coins, cost_usd, rarity) VALUES ('card_chaosGodS3', 'Card Frame', '', -1, -1, 'Immortal');
// INSERT INTO cosmetics (cosmetic_name, cosmetic_type, equip_group, cost_coins, cost_usd, rarity) VALUES ('gold_card_chaosGodS3', 'Card Frame', '', -1, -1, 'Immortal');
async function InitializeGods() {
  const gods = [
    "dazzle",
    "runeGod",
    "legionCommander",
    "brewmaster",
    "cloudGod",
    "spiritBreaker",
    "sorlaKhan",
    "pudge",
    "rix",
    "shopkeeper",
    "rubick",
    "lifestealer",
    "ogreMagi",
    "aghanim",
    "ladyAnshu",
    "donkeyAghanim",
    "gambler",
    "phantomAssassin",
    "alchemist",
    "kanna",
    "crystalMaiden",
    "tinker",
    "bloodseeker",
    "centaur",
    "icefrog",
    "jmuy",
    "tomeGod",
    "selemene",
    "counterStrike",
  ];

  try {
    for (const god of gods) {
      await query(`INSERT INTO gods (god_name, free) VALUES ($1, true);`, [
        god,
      ]);
    }
    console.log(`Initialized gods`);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

(async function () {})();
