const dropOdds = {
  chest_basic: [
    { odds: 25, type: "xp" },
    { odds: 19, type: "border" },
    { odds: 3.6, type: "hat_hat" },
    { odds: 3.6, type: "hat_facial_hair" },
    { odds: 3.6, type: "hat_eye_wear" },
    { odds: 3.6, type: "hat_emote" },
    { odds: 3.6, type: "hat_mouth" },
    { odds: 15, type: "plus" },
    { odds: 10, type: "finisher" },
    { odds: 8, type: "arena" },
    { odds: 5, type: "god_chest" },
  ],
  chest_gold: [{ odds: 100, type: "gold" }],
  chest_god: [
    { odds: 99, type: "god" },
    { odds: 1, type: "gold_god" },
  ],
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
  hat_hat: [
    { odds: -1, item_name: "hat_tophat" },
    { odds: -1, item_name: "hat_santa" },
    { odds: -1, item_name: "hat_cowboy" },
    { odds: -1, item_name: "hat_beret" },
    { odds: -1, item_name: "hat_cap" },
    { odds: -1, item_name: "hat_wizardhat" },
  ],
  hat_facial_hair: [
    { odds: -1, item_name: "hat_angry" },
    { odds: -1, item_name: "hat_handlebar" },
    { odds: -1, item_name: "hat_fullbeard" },
    { odds: -1, item_name: "hat_french" },
    { odds: -1, item_name: "hat_goatee" },
  ],
  hat_eye_wear: [
    { odds: -1, item_name: "hat_sunglasses" },
    { odds: -1, item_name: "hat_monacle" },
    { odds: -1, item_name: "hat_elton" },
    { odds: -1, item_name: "hat_patch" },
    { odds: -1, item_name: "hat_googly" },
    { odds: -1, item_name: "hat_angry" },
  ],
  hat_emote: [
    { odds: -1, item_name: "hat_poo" },
    { odds: -1, item_name: "hat_horse" },
    { odds: -1, item_name: "hat_tea" },
    { odds: -1, item_name: "hat_beer" },
    { odds: -1, item_name: "hat_smiley" },
  ],
  hat_mouth: [
    { odds: -1, item_name: "hat_lips" },
    { odds: -1, item_name: "hat_pipe" },
    { odds: -1, item_name: "hat_cigar" },
    { odds: -1, item_name: "hat_gas" },
    { odds: -1, item_name: "hat_covid" },
    { odds: -1, item_name: "hat_tongue" },
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
    { odds: -1, item_name: "card_sorlaKhan" },
    { odds: -1, item_name: "card_alchemist" },
    { odds: -1, item_name: "card_rix" },
    { odds: -1, item_name: "card_tinker" },
    { odds: -1, item_name: "card_ladyAnshu" },
    { odds: -1, item_name: "card_lifestealer" },
  ],

  // Golden gods aren't in yet
  gold_god: [
    { odds: -1, item_name: "gold_card_sorlaKhan" },
    { odds: -1, item_name: "gold_card_alchemist" },
    { odds: -1, item_name: "gold_card_rix" },
    { odds: -1, item_name: "gold_card_tinker" },
    { odds: -1, item_name: "gold_card_ladyAnshu" },
    { odds: -1, item_name: "gold_card_lifestealer" },
  ],
};

module.exports = {
  dropOdds,
  typeOdds,
};
