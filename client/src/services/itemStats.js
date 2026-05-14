import itemData from "../data/items.json";

// Baseline Gold Values per 1 point of stat
export const BASE_VALUES = {
  bonus_strength: 50,
  bonus_agility: 50,
  bonus_intellect: 50,
  bonus_damage: 50,
  bonus_attack_speed: 25,
  bonus_armor: 100,
  bonus_health: 2,
  bonus_mana: 2,
  bonus_movement: 11,
  bonus_mana_regen: 250, // Sage's Mask: 175g / 0.7 regen
  bonus_health_regen: 100, // Ring of Regen: 175g / 1.25 regen
  bonus_evasion: 85,
  bonus_lifesteal: 50,
  bonus_spell_amp: 100,
  corruption_armor: 0, // Minus armor value (e.g. Blight Stone)
};

// Current Dota 2 stat-to-bonus conversions (patch 7.x)
// STR: +22 HP, +0.1 HP regen
// AGI: +1/6 armor, +1 attack speed
// INT: +12 mana, +0.05 mana regen, +1% magic resistance (not valued here)
export const ATTR_CONVERSIONS = {
  strength: { bonus_health: 22, bonus_health_regen: 0.1 },
  agility: { bonus_armor: 1 / 6, bonus_attack_speed: 1 },
  intellect: { bonus_mana: 12, bonus_mana_regen: 0.05 },
};

/**
 * Given an item's raw statsProvided and a hero's primary attribute, returns
 * an expanded stat map with STR/AGI/INT replaced by their real bonus values,
 * plus damage from the primary attribute.
 *
 * @param {Object} statsProvided  - Raw stats map from calculateItemStats
 * @param {string} primary        - 'strength' | 'agility' | 'intellect' | 'universal'
 * @returns {Object} expanded stat totals (e.g. { bonus_health: 44, bonus_damage: 1, ... })
 */
export function expandItemStats(statsProvided, primary) {
  const expanded = {};

  const dmgPerPoint = primary === "universal" ? 0.7 : 1.0;

  for (const [stat, rawVal] of Object.entries(statsProvided)) {
    const val = Math.abs(rawVal);

    // Attributes that expand into real bonuses
    if (
      stat === "bonus_strength" ||
      stat === "bonus_agility" ||
      stat === "bonus_intellect"
    ) {
      const attrKey =
        stat === "bonus_strength"
          ? "strength"
          : stat === "bonus_agility"
          ? "agility"
          : "intellect";
      const conv = ATTR_CONVERSIONS[attrKey];

      // Add each derived bonus
      for (const [bonusStat, ratePerPoint] of Object.entries(conv)) {
        expanded[bonusStat] = (expanded[bonusStat] || 0) + val * ratePerPoint;
      }

      // Primary attribute (or universal) also grants damage
      if (primary === "universal" || primary === attrKey) {
        expanded["bonus_damage"] =
          (expanded["bonus_damage"] || 0) + val * dmgPerPoint;
      }
    } else if (stat === "bonus_all_stats") {
      // All-stats: expand each attribute
      for (const conv of Object.values(ATTR_CONVERSIONS)) {
        for (const [bonusStat, ratePerPoint] of Object.entries(conv)) {
          expanded[bonusStat] = (expanded[bonusStat] || 0) + val * ratePerPoint;
        }
      }
      // Primary gets +damage once (or universal gets 0.7 * 3 stats)
      const allStatsDmg = primary === "universal" ? val * 0.7 * 3 : val * 1.0;
      expanded["bonus_damage"] = (expanded["bonus_damage"] || 0) + allStatsDmg;
    } else {
      // Non-attribute stats (armor, damage, etc.) pass through unchanged
      expanded[stat] = (expanded[stat] || 0) + val;
    }
  }

  return expanded;
}

export function calculateItemStats(itemKey, depth = 0) {
  const item = itemData[itemKey];
  if (!item) return null;

  let baseStatValue = 0;
  const statsProvided = {};

  if (item.attrib) {
    let msRanged = null;
    let msMelee = null;

    item.attrib.forEach((attr) => {
      let val = parseFloat(attr.value);
      if (
        isNaN(val) &&
        typeof attr.value === "string" &&
        attr.value.includes(" ")
      ) {
        val = parseFloat(attr.value.split(" ")[0]);
      }
      if (isNaN(val)) return;

      // Collect move speed variants for averaging after the loop
      if (attr.key === "bonus_movement_speed_ranged") {
        msRanged = Math.abs(val);
        return;
      }
      if (attr.key === "bonus_movement_speed_melee") {
        msMelee = Math.abs(val);
        return;
      }

      // Normalize all known stat key aliases to canonical keys
      const KEY_ALIASES = {
        // Strength
        bonus_str: "bonus_strength",
        strength: "bonus_strength",
        // Agility
        bonus_agi: "bonus_agility",
        agility: "bonus_agility",
        // Intelligence
        bonus_int: "bonus_intellect",
        bonus_intelligence: "bonus_intellect",
        // All-stats
        all_stats: "bonus_all_stats",
        // Health
        bonus_hp: "bonus_health",
        health_bonus: "bonus_health",
        hp_bonus: "bonus_health",
        // Health regen
        bonus_hp_regen: "bonus_health_regen",
        bonus_regen: "bonus_health_regen",
        // Mana regen
        bonus_mp_regen: "bonus_mana_regen",
        // Armor
        armor_bonus: "bonus_armor",
        // Attack speed
        attack_speed_bonus: "bonus_attack_speed",
        bonus_speed: "bonus_attack_speed",
        // Move speed (passive, non-conditional)
        bonus_move_speed: "bonus_movement",
        bonus_movement_speed: "bonus_movement",
        bonus_movespeed: "bonus_movement",
        passive_movement_bonus: "bonus_movement",
        // Attack damage
        damage: "bonus_damage",
        bonus_damage_melee: "bonus_damage",
        // Lifesteal
        attack_lifesteal: "bonus_lifesteal",
        lifesteal: "bonus_lifesteal",
        lifesteal_percent: "bonus_lifesteal",
        // Spell amp
        spell_amp: "bonus_spell_amp",
        // Evasion
        evasion: "bonus_evasion",
        // Power Treads switchable stat
        bonus_stat: "bonus_strength",
        bonus_stat_uni: "bonus_strength",
      };

      const key = KEY_ALIASES[attr.key] || attr.key;

      // Decompose all-stats into individual attributes
      if (key === "bonus_all_stats" || key === "bonus_stats") {
        const abv = Math.abs(val);
        baseStatValue +=
          abv *
          (BASE_VALUES.bonus_strength +
            BASE_VALUES.bonus_agility +
            BASE_VALUES.bonus_intellect);
        statsProvided["bonus_strength"] =
          (statsProvided["bonus_strength"] || 0) + abv;
        statsProvided["bonus_agility"] =
          (statsProvided["bonus_agility"] || 0) + abv;
        statsProvided["bonus_intellect"] =
          (statsProvided["bonus_intellect"] || 0) + abv;
      } else if (BASE_VALUES[key] !== undefined) {
        baseStatValue += Math.abs(val) * BASE_VALUES[key];
        statsProvided[key] = (statsProvided[key] || 0) + Math.abs(val);
      }
    });

    // Average ranged/melee move speed into a single bonus_movement value
    if (msRanged !== null || msMelee !== null) {
      const speeds = [msRanged, msMelee].filter((v) => v !== null);
      const avgMS = speeds.reduce((a, b) => a + b, 0) / speeds.length;
      baseStatValue += avgMS * BASE_VALUES.bonus_movement;
      statsProvided["bonus_movement"] =
        (statsProvided["bonus_movement"] || 0) + avgMS;
    }
  }

  let componentsStatsValue = 0;
  if (item.components && depth < 3) {
    item.components.forEach((compKey) => {
      const compData = calculateItemStats(compKey, depth + 1);
      if (compData) {
        componentsStatsValue += compData.statValue;
      }
    });
  }

  const recipeValue =
    componentsStatsValue > 0 ? baseStatValue - componentsStatsValue : 0;

  // Resolve display name — append level for tiered items (dagon → "Dagon 1", dagon_2 → "Dagon 2")
  let displayName = item.dname;
  const levelMatch = itemKey.match(/^(.+)_(\d+)$/);
  if (levelMatch) {
    const baseKey = levelMatch[1];
    const baseItem = itemData[baseKey];
    if (baseItem && baseItem.dname === item.dname) {
      displayName = `${item.dname} ${levelMatch[2]}`;
    }
  } else if (itemData[`${itemKey}_2`]?.dname === item.dname) {
    displayName = `${item.dname} 1`;
  }

  return {
    key: itemKey,
    name: displayName,
    cost: item.cost,
    img: `https://cdn.cloudflare.steamstatic.com${item.img}`,
    statValue: baseStatValue,
    recipeValue: recipeValue,
    goldEfficiency: item.cost > 0 ? baseStatValue / item.cost : 0,
    statsProvided,
    components: item.components || null,
  };
}

// ─── Stat Optimization Math ───────────────────────────────────────────────────

/**
 * Calculate DPS given hero context and bonus stats.
 * APS = (100 + bonusIAS) / (100 * BAT)
 * DPS = (baseDamage + bonusDamage) * APS
 *
 * @param {number} bonusIAS       - Bonus attack speed points (0..n)
 * @param {number} bonusDamage    - Bonus damage points (0..n)
 * @param {number} bat            - Base Attack Time (e.g. 1.7)
 * @param {number} baseDamage     - Hero base damage
 * @returns {number} DPS
 */
export function calcDPS(bonusIAS, bonusDamage, bat, baseDamage) {
  const aps = (100 + bonusIAS) / (100 * bat);
  return (baseDamage + bonusDamage) * aps;
}

/**
 * Calculate physical effective HP.
 * EHP = (baseHP + bonusHP) * (1 + 0.06 * (baseArmor + bonusArmor))
 *
 * @param {number} bonusHP     - Bonus health points
 * @param {number} bonusArmor  - Bonus armor points
 * @param {number} baseHP      - Hero base health
 * @param {number} baseArmor   - Hero base armor
 * @returns {number} Physical EHP
 */
export function calcEHPPhys(bonusHP, bonusArmor, baseHP, baseArmor) {
  const totalHP = baseHP + bonusHP;
  const totalArmor = baseArmor + bonusArmor;
  return totalHP * (1 + 0.06 * totalArmor);
}

/**
 * Calculate magic effective HP.
 * Heroes have 25% base magic resistance.
 * EHP = (baseHP + bonusHP) / (1 - effectiveMagicResist)
 * effectiveMagicResist = 1 - 0.75 * (1 - bonusMagicResist/100)
 *
 * @param {number} bonusHP          - Bonus health points
 * @param {number} bonusMagicResist - Bonus magic resistance % (0..100)
 * @param {number} baseHP           - Hero base health
 * @returns {number} Magic EHP
 */
export function calcEHPMagic(bonusHP, bonusMagicResist, baseHP) {
  const totalHP = baseHP + bonusHP;
  // Stack with 25% base hero magic resistance
  const effectiveResist = 1 - 0.75 * (1 - bonusMagicResist / 100);
  return totalHP / (1 - effectiveResist);
}

/**
 * Derive recommended gold values for damage, IAS, HP, armor, and magic resist
 * based on the geometry of the DPS / EHP surfaces at the given hero context.
 *
 * Strategy:
 *  - For DPS: compute marginal DPS per point of bonus damage vs bonus IAS,
 *    then scale so the higher marginal == its current BASE_VALUE.
 *  - For EHP physical: compute marginal EHP per point of HP vs armor,
 *    then express armor value relative to HP value.
 *  - For EHP magic: compute marginal EHP per point of HP vs magic resist %,
 *    then express magic resist value relative to HP value.
 *
 * @param {object} context  - { bat, baseDamage, baseHP, baseArmor, goldPerDmg, goldPerHP }
 * @returns {object} Suggested gold values keyed by stat name
 */
export function deriveSuggestedValues(context) {
  const { bat, baseDamage, baseHP, baseArmor, goldPerDmg, goldPerHP } = context;

  // Marginal DPS at baseline (no bonus stats)
  const dDPS_dDmg = (100 + 0) / (100 * bat); // ∂DPS/∂damage = APS (at 0 IAS)
  const dDPS_dIAS = (baseDamage + 0) / (100 * bat); // ∂DPS/∂IAS = totalDmg / (100*BAT)

  // Ratio: how many IAS points equal 1 damage point (at baseline)
  const iasPerDmg = dDPS_dDmg / dDPS_dIAS; // == 100/baseDmg
  const goldPerIAS = goldPerDmg / iasPerDmg;

  // Marginal physical EHP at baseline (no bonus stats)
  const dEHP_dHP_phys = 1 + 0.06 * (baseArmor + 0); // ∂EHP/∂HP
  const dEHP_dArmor = (baseHP + 0) * 0.06; // ∂EHP/∂armor

  // Armor value relative to HP value
  const armorPerHP = dEHP_dArmor / dEHP_dHP_phys;
  const goldPerArmor = goldPerHP * armorPerHP;

  // Marginal magic EHP at baseline
  // ∂EHP_magic/∂HP = 1 / (1 - effectiveResist_at_0)
  const effectiveResistAt0 = 1 - 0.75; // 25% base resist
  const dEHP_dHP_magic = 1 / (1 - effectiveResistAt0); // = 4

  // ∂EHP_magic/∂magicResist% = totalHP * 0.75 * 0.01 / (1 - effectiveResist)^2
  const dEHP_dMR = (baseHP * 0.75 * 0.01) / Math.pow(1 - effectiveResistAt0, 2);

  const mrPerHP = dEHP_dMR / dEHP_dHP_magic;
  const goldPerMR = goldPerHP * mrPerHP;

  return {
    bonus_damage: Math.round(goldPerDmg),
    bonus_attack_speed: Math.round(goldPerIAS * 10) / 10,
    bonus_health: Math.round(goldPerHP * 10) / 10,
    bonus_armor: Math.round(goldPerArmor),
    bonus_magic_resist: Math.round(goldPerMR),
  };
}

export function getAllItemsAnalysis() {
  const results = [];
  Object.keys(itemData).forEach((key) => {
    const item = itemData[key];
    // Filter out pure recipes, zero cost, and consumables like clarity
    if (key.startsWith("recipe_") || !item.cost || item.cost === 0) return;

    const stats = calculateItemStats(key);
    // Only include items that actually give stats we track
    if (stats && stats.statValue > 0) {
      results.push(stats);
    }
  });
  return results;
}
