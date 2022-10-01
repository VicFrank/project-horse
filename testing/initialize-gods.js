const { query } = require("../db/index");

// INSERT INTO gods (god_name, free) VALUES ('selemene', true);
// INSERT INTO cosmetics (cosmetic_name, cosmetic_type, equip_group, cost_coins, cost_usd, rarity) VALUES ('card_selemene', 'Card Frame', '', -1, -1, 'Immortal');
// INSERT INTO cosmetics (cosmetic_name, cosmetic_type, equip_group, cost_coins, cost_usd, rarity) VALUES ('gold_card_selemene', 'Card Frame', '', -1, -1, 'Immortal');
async function InitializeGods() {
  const gods = [
    "default",
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
      await query(`INSERT INTO gods (god_name, free) VALUES ($1, true);`[god]);
      await query(
        `INSERT INTO cosmetics (cosmetic_name, cosmetic_type, equip_group, cost_coins, cost_usd, rarity)
         VALUES ('card_${god}', 'Card Frame', '', -1, -1, 'Immortal');`
      );
      await query(
        `INSERT INTO cosmetics (cosmetic_name, cosmetic_type, equip_group, cost_coins, cost_usd, rarity)
        VALUES ('gold_card_${god}', 'Card Frame', '', -1, -1, 'Immortal')`
      );
    }
    console.log(`Initialized gods`);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

(async function () {
  await InitializeGods();
})();
