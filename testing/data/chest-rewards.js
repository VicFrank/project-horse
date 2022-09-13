const dropOdds = {
  chest_basic: [
    { odds: 25, type: "xp" },
    { odds: 19, type: "border" },
    { odds: 18, type: "hat" },
    { odds: 15, type: "plus" },
    { odds: 10, type: "finisher" },
    { odds: 8, type: "arena" },
    { odds: 5, type: "god_chest" },
  ],
  chest_gold: [{ odds: 100, type: "gold" }],
  chest_god: [{ odds: 100, type: "god" }],
};

const typeOdds = {
  gold: [{ odds: 100, item_name: "gold_placeholder" }],
  xp: [
    { odds: 56, item_name: "get_xp_250" },
    { odds: 25, item_name: "get_xp_500" },
    { odds: 11.5, item_name: "get_xp_1000" },
    { odds: 5, item_name: "get_xp_2500" },
    { odds: 2.5, item_name: "get_xp_5000" },
  ],
  border: [
    { odds: 25, item_name: "avatar_red" },
    { odds: 25, item_name: "avatar_blue" },
    { odds: 25, item_name: "avatar_green" },
    { odds: 12.5, item_name: "avatar_pink" },
    { odds: 12.5, item_name: "avatar_black" },
  ],
  hat: [
    { odds: -1, item_name: "hat_birthday" },
    { odds: -1, item_name: "hat_bucket" },
    { odds: -1, item_name: "hat_cone" },
    { odds: -1, item_name: "hat_cowboy" },
    { odds: -1, item_name: "hat_detective" },
    { odds: -1, item_name: "hat_feelsrainman" },
    { odds: -1, item_name: "hat_green" },
    { odds: -1, item_name: "hat_clown_wig" },
    { odds: -1, item_name: "hat_jester" },
    { odds: -1, item_name: "hat_mushroom" },
    { odds: -1, item_name: "hat_red" },
    { odds: -1, item_name: "hat_santa" },
    { odds: -1, item_name: "hat_turkish" },
    { odds: -1, item_name: "hat_witch" },
    { odds: -1, item_name: "hat_wizard" },
    { odds: -1, item_name: "hat_barb" },
    { odds: -1, item_name: "hat_begent" },
    { odds: -1, item_name: "hat_bandito" },
    { odds: -1, item_name: "hat_rockstar" },
    { odds: -1, item_name: "hat_thisisfine" },
    { odds: -1, item_name: "hat_buckteeth" },
    { odds: -1, item_name: "hat_cigar" },
    { odds: -1, item_name: "hat_grin" },
    { odds: -1, item_name: "hat_lips" },
    { odds: -1, item_name: "hat_tongue" },
    { odds: -1, item_name: "hat_angryeyes" },
    { odds: -1, item_name: "hat_blackglasses" },
    { odds: -1, item_name: "hat_confused" },
    { odds: -1, item_name: "hat_sidestare" },
    { odds: -1, item_name: "hat_tealglasses" },
  ],
  plus: [
    { odds: 60, item_name: "plus_1day" },
    { odds: 30, item_name: "plus_2day" },
    { odds: 9, item_name: "plus_4day" },
    { odds: 0.95, item_name: "plus_month" },
    { odds: 0.05, item_name: "plus_year_package" },
  ],
  finisher: [
    { odds: 20, item_name: "finisher_fire" },
    { odds: 20, item_name: "finisher_lightning" },
    { odds: 20, item_name: "finisher_poison" },
    { odds: 20, item_name: "finisher_rocks" },
    { odds: 20, item_name: "finisher_snow" },
  ],
  arena: [
    { odds: 20, item_name: "terrain_green" },
    { odds: 20, item_name: "terrain_icelake" },
    { odds: 20, item_name: "terrain_lava" },
    { odds: 20, item_name: "terrain_snow" },
    { odds: 20, item_name: "terrain_tropical" },
  ],
  god_chest: [{ odds: 100, item_name: "chest_god" }],

  // God chest rewards
  // negative odds in this case means you have a random chance
  // of getting one god you don't have yet
  god: [
    { odds: -1, item_name: "card_alchemist" },
    { odds: -1, item_name: "card_donkeyAghanim" },
    { odds: -1, item_name: "card_jmuy" },
    { odds: -1, item_name: "card_ladyAnshu" },
    { odds: -1, item_name: "card_lifestealer" },
    { odds: -1, item_name: "card_phantomAssassin" },
    { odds: -1, item_name: "card_rix" },
    { odds: -1, item_name: "card_sorlaKhan" },
  ],
};

module.exports = {
  dropOdds,
  typeOdds,
};
