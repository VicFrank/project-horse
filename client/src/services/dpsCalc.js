import itemData from "../data/items.json";

// ─── Constants ────────────────────────────────────────────────────────────────

// Stat key normalization (matches itemStats.js conventions)
const KEY_ALIASES = {
  bonus_str: "bonus_strength",
  strength: "bonus_strength",
  bonus_agi: "bonus_agility",
  agility: "bonus_agility",
  bonus_int: "bonus_intellect",
  bonus_intelligence: "bonus_intellect",
  all_stats: "bonus_all_stats",
  bonus_stats: "bonus_all_stats",
  armor_bonus: "bonus_armor",
  armor: "bonus_armor",
  attack_speed_bonus: "bonus_attack_speed",
  bonus_speed: "bonus_attack_speed",
  damage: "bonus_damage",
  bonus_damage_melee: "bonus_damage",
  evasion: "bonus_evasion",
  lifesteal: "bonus_lifesteal",
  attack_lifesteal: "bonus_lifesteal",
  lifesteal_percent: "bonus_lifesteal",
};

// ─── Math helpers ─────────────────────────────────────────────────────────────

/**
 * Physical damage multiplier for the given armor value.
 * Works for negative armor too: 1/(1 + 0.06*armor)
 */
export function armorToPhysMult(armor) {
  return 1 / (1 + 0.06 * armor);
}

/**
 * Expected crit DPS multiplier from multiple crit sources.
 * Sources are sorted by multiplier descending (highest priority).
 * Formula: each source contributes P(it procs) × P(no higher source proced) × (mult - 1)
 */
export function critMultiplier(crits) {
  if (!crits || !crits.length) return 1;
  const sorted = [...crits].sort((a, b) => b.mult - a.mult);
  let result = 1;
  let pNoHigher = 1;
  for (const { chance, mult } of sorted) {
    const p = chance / 100;
    result += pNoHigher * p * (mult / 100 - 1);
    pNoHigher *= 1 - p;
  }
  return result;
}

/**
 * Compound miss chance from multiple independent evasion sources.
 * Uses Dota 2 diminishing stacking: 1 - Π(1 - eᵢ/100)
 */
export function compoundEvasion(evasions) {
  if (!evasions || !evasions.length) return 0;
  let hit = 1;
  for (const e of evasions) hit *= 1 - e / 100;
  return 1 - hit;
}

// ─── Item stat resolution ─────────────────────────────────────────────────────

/**
 * Get a single attrib value from an item by key.
 */
function getAttr(item, key) {
  const a = (item.attrib || []).find((x) => x.key === key);
  return a ? parseFloat(a.value) : null;
}

/**
 * Resolves all DPS-relevant stats from a list of item keys for a hero with given primaryAttr.
 * Returns an aggregated combat stat object.
 *
 * Stacking rules:
 *  - Normal stats (bonus_damage, bonus_attack_speed, etc.) always stack.
 *  - Crit sources: collected as array, resolved via priority model.
 *  - MKB proc: unique passive — only highest proc damage applies.
 *  - Chain lightning: unique passive — only highest chain_damage applies.
 *  - Corruption armor: only the item with highest |value| applies.
 *  - Aura keys: each key type takes the max absolute value (non-stacking per key).
 *  - Evasion: compound stacking (Dota 2 diminishing returns).
 */
export function resolveItemStats(itemKeys, primaryAttr, activeItemKeys = []) {
  const validKeys = (itemKeys || []).filter((k) => k && itemData[k]);
  const activeSet = new Set(activeItemKeys || []);

  let bonusDamage = 0;
  let bonusIAS = 0;
  let bonusBaseASPct = 0;
  let bonusStr = 0,
    bonusAgi = 0,
    bonusInt = 0;
  let bonusArmor = 0;
  let bonusHealth = 0;
  let bonusMagicalArmor = []; // for multiplicative stacking
  const crits = []; // [{chance, mult}]
  let mkb = null; // {chance, damage} — unique, highest damage (true strike on proc hits only)
  let bash = null; // {chanceM, chanceR, damage} — unique, highest damage (no true strike)
  let chain = null; // {chance, damage} — unique, highest damage
  let manaBurn = null; // {dmgPerHit} — unique (does not stack), highest dmgPerHit
  let bestCorruptionArmor = 0; // most negative
  const auraMaxByKey = {}; // key → max |value| (with original sign)
  const evasions = []; // for compound stacking
  let lifesteal = 0;
  let healthRegen = 0;
  let bestBlock = null; // {chance, melee, ranged}
  let networth = 0;
  // Radiance-style burn aura (AoE DPS to nearby enemies, not attack damage)
  let burnAuraDPS = 0;

  for (const key of validKeys) {
    const item = itemData[key];
    networth += item.cost || 0;

    for (const attr of item.attrib || []) {
      const rawKey = KEY_ALIASES[attr.key] || attr.key;
      const val = parseFloat(attr.value);
      if (isNaN(val)) continue;

      switch (rawKey) {
        case "bonus_damage":
          bonusDamage += val;
          break;
        case "bonus_attack_speed":
          bonusIAS += val;
          break;
        case "bonus_attack_speed_pct":
          // Only a passive BASP if the item doesn't also have bonus_movement_speed_pct
          // (which flags it as an active "Endurance" aura, e.g. Drum / Boots of Bearing).
          if (!getAttr(item, "bonus_movement_speed_pct")) {
            bonusBaseASPct += val;
          }
          break;
        case "bonus_strength":
          bonusStr += val;
          break;
        case "bonus_agility":
          bonusAgi += val;
          break;
        case "bonus_intellect":
          bonusInt += val;
          break;
        case "bonus_all_stats":
          bonusStr += val;
          bonusAgi += val;
          bonusInt += val;
          break;
        case "bonus_armor":
          bonusArmor += val;
          break;

        case "bonus_health":
        case "bonus_hp":
          bonusHealth += val;
          break;

        case "bonus_magical_armor":
        case "bonus_spell_resist":
        case "magic_resistance":
          bonusMagicalArmor.push(val);
          break;

        case "bonus_stat":
          // Power Treads — grants selected attribute. Default to primary attr (STR for universal).
          if (primaryAttr === "agility") bonusAgi += val;
          else if (primaryAttr === "intellect") bonusInt += val;
          else bonusStr += val; // strength or universal → STR
          break;

        case "crit_chance": {
          // Find crit_multiplier in same item (may appear separately)
          const mult = getAttr(item, "crit_multiplier") || 200;
          crits.push({ chance: val, mult });
          break;
        }

        case "bonus_chance": {
          // MKB/Javelin — unique passive, keep highest proc damage; true strike on proc hits only
          const procDmg = getAttr(item, "bonus_chance_damage") || 0;
          if (!mkb || procDmg > mkb.damage) {
            mkb = { chance: val, damage: procDmg };
          }
          break;
        }

        case "bash_chance_melee": {
          // Skull Basher / Abyssal Blade — unique passive, no true strike
          const dmg = getAttr(item, "bonus_chance_damage") || 0;
          if (!bash || dmg > bash.damage) {
            bash = {
              chanceM: val,
              chanceR: getAttr(item, "bash_chance_ranged") || val,
              damage: dmg,
            };
          }
          break;
        }

        case "chain_chance": {
          // Maelstrom/Mjollnir — unique passive, keep highest chain_damage
          const dmg = getAttr(item, "chain_damage") || 0;
          if (!chain || dmg > chain.damage) {
            chain = { chance: val, damage: dmg };
          }
          break;
        }

        case "feedback_mana_burn": {
          // Diffusal Blade — unique (doesn't stack), physical dmg per hit = burn * damage_per_burn
          const dmgPerBurn = getAttr(item, "damage_per_burn") || 1;
          const dmgPerHit = val * dmgPerBurn;
          if (!manaBurn || dmgPerHit > manaBurn.dmgPerHit) {
            manaBurn = { dmgPerHit };
          }
          break;
        }

        case "corruption_armor":
          // Desolator/Orb of Corrosion — unique, most negative wins
          if (val < bestCorruptionArmor) bestCorruptionArmor = val;
          break;

        case "bonus_evasion":
          evasions.push(Math.abs(val));
          break;

        case "bonus_lifesteal":
          lifesteal = Math.max(lifesteal, val);
          break;

        // Health regeneration (flat)
        case "bonus_health_regen":
        case "bonus_regen":
        case "health_regen":
          healthRegen += val;
          break;

        // Damage block — unique passive, highest block values win
        case "block_damage_melee":
        case "damage_block_melee":
          if (!bestBlock || val > bestBlock.melee) {
            if (!bestBlock) bestBlock = {};
            bestBlock.melee = val;
          }
          break;
        case "block_damage_ranged":
        case "damage_block_ranged":
          if (!bestBlock || val > bestBlock.ranged) {
            if (!bestBlock) bestBlock = {};
            bestBlock.ranged = val;
          }
          break;
        case "block_chance":
          if (!bestBlock) bestBlock = {};
          bestBlock.chance = val;
          break;

        // Aura keys — each type takes only the highest |value| seen
        case "damage_aura":
        case "attack_damage_aura":
          // Attack damage auras — stack with each other (different types), not within same type
          if (
            !auraMaxByKey[rawKey] ||
            Math.abs(val) > Math.abs(auraMaxByKey[rawKey])
          ) {
            auraMaxByKey[rawKey] = val;
          }
          break;

        case "aura_damage":
          // Radiance burn aura — AoE, NOT added to attack damage; shown as burn DPS
          if (val > burnAuraDPS) burnAuraDPS = val;
          break;

        case "aura_attack_speed":
        case "aura_negative_armor":
        case "aura_positive_armor":
        case "armor_aura":
          if (
            !auraMaxByKey[rawKey] ||
            Math.abs(val) > Math.abs(auraMaxByKey[rawKey])
          ) {
            auraMaxByKey[rawKey] = val;
          }
          break;
      }
    }

    // ── Active item bonuses ──
    if (activeSet.has(key)) {
      // Armlet of Mordiggian (Unholy Strength)
      const unholyDmg = getAttr(item, "unholy_bonus_damage");
      const unholyStr = getAttr(item, "unholy_bonus_strength");
      const unholyArmor = getAttr(item, "unholy_bonus_armor");
      if (unholyDmg) bonusDamage += unholyDmg;
      if (unholyStr) bonusStr += unholyStr;
      if (unholyArmor) bonusArmor += unholyArmor;

      // Mask of Madness (Berserk)
      const berserkIAS = getAttr(item, "berserk_bonus_attack_speed");
      const berserkArmorReduction = getAttr(item, "berserk_armor_reduction");
      if (berserkIAS) bonusIAS += berserkIAS;
      if (berserkArmorReduction) bonusArmor -= berserkArmorReduction;
    }
  }

  // ── Expand attribute stats into real bonuses ──
  const dmgPerPoint = primaryAttr === "universal" ? 0.7 : 1.0;
  if (primaryAttr === "strength" || primaryAttr === "universal")
    bonusDamage += bonusStr * dmgPerPoint;
  if (primaryAttr === "agility" || primaryAttr === "universal")
    bonusDamage += bonusAgi * dmgPerPoint;
  if (primaryAttr === "intellect" || primaryAttr === "universal")
    bonusDamage += bonusInt * dmgPerPoint;

  // Every AGI point gives 1 IAS and 1/6 armor
  bonusIAS += bonusAgi;
  bonusArmor += bonusAgi / 6;

  // ── Apply self-benefiting auras ──
  bonusDamage += auraMaxByKey["damage_aura"] || 0;
  bonusDamage += auraMaxByKey["attack_damage_aura"] || 0;
  // aura_attack_speed: positive values benefit allies (self-apply); negative values debuff enemies (not self)
  const atkSpeedAura = auraMaxByKey["aura_attack_speed"] || 0;
  if (atkSpeedAura > 0) bonusIAS += atkSpeedAura;
  const auraEnemyIAS = atkSpeedAura < 0 ? atkSpeedAura : 0; // e.g. Shiva's -45
  bonusArmor += auraMaxByKey["armor_aura"] || 0;
  // aura_positive_armor (Assault Cuirass) does NOT apply to the carrier — item's bonus_armor already covers it

  return {
    bonusDamage,
    bonusIAS,
    bonusBaseASPct,
    bonusArmor,
    bonusHealth,
    bonusMagicalArmor,
    crits,
    mkb,
    bash,
    chain,
    manaBurn,
    corruptionArmor: bestCorruptionArmor,
    auraNegArmor: auraMaxByKey["aura_negative_armor"] || 0,
    auraEnemyIAS,
    evasions,
    trueStrike: mkb !== null, // proc-level true strike (only on MKB proc hits)
    lifesteal,
    healthRegen,
    damageBlock: bestBlock,
    burnAuraDPS,
    networth,
    rawStr: bonusStr,
    rawAgi: bonusAgi,
    rawInt: bonusInt,
  };
}

// ─── Main DPS calculation ─────────────────────────────────────────────────────

/**
 * Calculate effective DPS of attacker against defender.
 *
 * @param {Object} attackerHero  - From getHeroStats(id, level)
 * @param {Object} attackerItems - From resolveItemStats(itemKeys, primaryAttr)
 * @param {Object} defenderHero  - From getHeroStats(id, level)
 * @param {Object} defenderItems - From resolveItemStats(itemKeys, primaryAttr)
 * @returns {{ effectiveDPS, procDPS, burnDPS, aps, totalDamage, effectiveArmor, critMult, missChance }}
 */
export function calcDps(
  attackerHero,
  attackerItems,
  defenderHero,
  defenderItems,
) {
  // ── Attacker base damage per hit (flat bonuses, no proc expected values) ──
  const baseDamagePerHit =
    attackerHero.avgBaseDamage + attackerItems.bonusDamage;

  // ── Attacker APS — also reduced by enemy aura debuffs (e.g. Shiva's Freezing Aura) ──
  // BASP (e.g. Butterfly) scales off base attack speed + all AGI sources (hero + items), not flat IAS.
  const baseASBonus =
    (attackerHero.baseIAS + attackerItems.rawAgi) *
    (attackerItems.bonusBaseASPct / 100);
  const rawIAS =
    attackerHero.baseIAS +
    attackerItems.bonusIAS +
    baseASBonus +
    (defenderItems.auraEnemyIAS || 0);
  const aps = Math.max(
    0.2 / attackerHero.bat,
    rawIAS / (100 * attackerHero.bat),
  );

  // ── Crit multiplier ──
  const critMult = critMultiplier(attackerItems.crits);

  // ── Defender effective armor ──
  const defenderArmor =
    defenderHero.effectiveArmor +
    defenderItems.bonusArmor +
    attackerItems.corruptionArmor +
    attackerItems.auraNegArmor;

  const physMult = armorToPhysMult(defenderArmor);
  const magicMult = 1 - (defenderHero.magicResist || 25) / 100;

  // ── Towers: on-hit procs (MKB magic damage, bash, mana burn) don't work ──
  const defIsStructure = !!defenderHero.damageReduction;

  // ── Evasion — raw miss chance before accounting for MKB ──
  const rawMissChance = compoundEvasion(defenderItems.evasions);
  const hitChance = 1 - rawMissChance;

  // ── Effective DPS ──
  // MKB/Javelin: proc hits ALWAYS land (true strike on proc hits only);
  // normal hits are subject to evasion normally.
  // Towers: MKB magic damage doesn't apply.
  let effectiveDPS;
  if (attackerItems.mkb && !defIsStructure) {
    const p = attackerItems.mkb.chance / 100;
    // Proc hits: base damage is physical (physMult), proc bonus is magic (magicMult), bypasses evasion
    const procHitDPS =
      p *
      aps *
      (baseDamagePerHit * critMult * physMult +
        attackerItems.mkb.damage * magicMult);
    // Normal hits: subject to evasion
    const normalHitDPS =
      (1 - p) * aps * baseDamagePerHit * critMult * physMult * hitChance;
    effectiveDPS = procHitDPS + normalHitDPS;
  } else {
    effectiveDPS = baseDamagePerHit * aps * critMult * physMult * hitChance;
  }

  // ── Bash bonus DPS (Skull Basher / Abyssal Blade) ──
  // Bash is NOT true strike — proc hits still subject to evasion.
  // Bash does not work against structures.
  if (attackerItems.bash && !defIsStructure) {
    const bashChance =
      (attackerHero.isMelee
        ? attackerItems.bash.chanceM
        : attackerItems.bash.chanceR) / 100;
    effectiveDPS +=
      bashChance * aps * attackerItems.bash.damage * physMult * hitChance;
  }

  // ── Proc DPS (chain lightning — AoE secondary target) — does not work vs structures ──
  const procDPS =
    attackerItems.chain && !defIsStructure
      ? (attackerItems.chain.chance / 100) * attackerItems.chain.damage * aps
      : 0;

  // ── MKB/Javelin proc expected DPS — does not work vs structures ──
  const mkbProcDPS =
    attackerItems.mkb && !defIsStructure
      ? (attackerItems.mkb.chance / 100) *
        attackerItems.mkb.damage *
        magicMult *
        aps
      : 0;

  // ── Bash proc expected DPS — does not work vs structures ──
  const bashProcDPS =
    attackerItems.bash && !defIsStructure
      ? ((attackerHero.isMelee
          ? attackerItems.bash.chanceM
          : attackerItems.bash.chanceR) /
          100) *
        attackerItems.bash.damage *
        aps *
        physMult *
        hitChance
      : 0;

  // ── Burn DPS (Radiance — AoE to nearby enemies) ──
  const burnDPS = attackerItems.burnAuraDPS;

  // ── Mana Burn DPS (Diffusal Blade — does not work vs structures) ──
  const manaBurnDPS =
    attackerItems.manaBurn && !defIsStructure
      ? attackerItems.manaBurn.dmgPerHit * physMult * hitChance * aps
      : 0;
  effectiveDPS += manaBurnDPS;

  // ── Display miss chance: weighted average across all attacks ──
  const missChance = attackerItems.mkb
    ? (1 - attackerItems.mkb.chance / 100) * rawMissChance
    : rawMissChance;

  // ── Average total damage per hit (for display) ──
  const totalDamage = attackerItems.mkb
    ? baseDamagePerHit +
      (attackerItems.mkb.chance / 100) * attackerItems.mkb.damage
    : baseDamagePerHit;

  return {
    effectiveDPS,
    procDPS,
    mkbProcDPS,
    bashProcDPS,
    burnDPS,
    manaBurnDPS,
    aps,
    rawIAS,
    totalDamage,
    critMult,
    effectiveArmor: defenderArmor,
    missChance,
  };
}

// ─── EHP calculation ─────────────────────────────────────────────────────────

/**
 * Calculate Effective HP (Physical and Magical) for a hero with given items.
 *
 * Physical EHP = totalHP × (1 + 0.06 × totalArmor)
 * Magical EHP  = totalHP / (1 - totalMR)
 *
 * Magic resistance from items stacks multiplicatively with hero base MR.
 *
 * @param {Object} hero  - From getHeroStats(id, level)
 * @param {Object} items - From resolveItemStats(itemKeys, primaryAttr)
 * @returns {{ ehpPhys, ehpMag, totalArmor, totalMR, totalHP }}
 */
export function calcEhp(hero, items) {
  // Item STR gives 22 HP per point; flat bonusHealth adds directly
  const strHP = (items.rawStr || 0) * 22;
  const totalHP = hero.maxHP + strHP + (items.bonusHealth || 0);
  // Item AGI gives 1/6 armor per point — already included in items.bonusArmor
  const totalArmor = hero.effectiveArmor + (items.bonusArmor || 0);

  // Magic resistance: compound multiplicative with hero base
  const baseMR = (hero.magicResist || 25) / 100;
  let mrProduct = 1 - baseMR;
  const mrSources = items.bonusMagicalArmor || [];
  for (const mr of mrSources) {
    mrProduct *= 1 - mr / 100;
  }
  const totalMR = 1 - mrProduct;

  // Evasion: reduces incoming physical hits, effectively multiplying EHP
  const evadeChance = compoundEvasion(items.evasions || []);
  const evadeMult = evadeChance > 0 ? 1 / (1 - evadeChance) : 1;

  const ehpPhys = totalHP * (1 + 0.06 * totalArmor) * evadeMult;
  const ehpMag = totalMR < 1 ? totalHP / (1 - totalMR) : Infinity;

  return { ehpPhys, ehpMag, totalArmor, totalMR, totalHP, evadeChance };
}

/**
 * Merge hero ability bonuses on top of resolved item stats.
 * This lets abilities like Jinada, Coup de Grace, etc. contribute.
 */
export function mergeBonuses(items, bonuses) {
  if (!bonuses) return items;
  const b = { ...items };

  // Flat additive stats
  if (bonuses.bonus_damage) b.bonusDamage += bonuses.bonus_damage;
  if (bonuses.bonus_attack_speed) b.bonusIAS += bonuses.bonus_attack_speed;
  if (bonuses.bonus_strength)
    b.rawStr = (b.rawStr || 0) + bonuses.bonus_strength;
  if (bonuses.bonus_agility) b.rawAgi = (b.rawAgi || 0) + bonuses.bonus_agility;
  if (bonuses.bonus_intellect)
    b.rawInt = (b.rawInt || 0) + bonuses.bonus_intellect;
  if (bonuses.bonus_all_stats) {
    b.rawStr = (b.rawStr || 0) + bonuses.bonus_all_stats;
    b.rawAgi = (b.rawAgi || 0) + bonuses.bonus_all_stats;
    b.rawInt = (b.rawInt || 0) + bonuses.bonus_all_stats;
  }
  if (bonuses.bonus_armor) b.bonusArmor += bonuses.bonus_armor;
  if (bonuses.bonus_health)
    b.bonusHealth = (b.bonusHealth || 0) + bonuses.bonus_health;
  if (bonuses.bonus_evasion) {
    b.evasions = [...(b.evasions || []), Math.abs(bonuses.bonus_evasion)];
  }
  if (bonuses.bonus_health_regen || bonuses.health_regen) {
    b.healthRegen =
      (b.healthRegen || 0) +
      (bonuses.bonus_health_regen || 0) +
      (bonuses.health_regen || 0);
  }

  // Re-derive AGI benefits (IAS, armor, damage for AGI primary)
  if (bonuses.bonus_agility || bonuses.bonus_all_stats) {
    const extraAgi =
      (bonuses.bonus_agility || 0) + (bonuses.bonus_all_stats || 0);
    b.bonusIAS += extraAgi;
    b.bonusArmor += extraAgi / 6;
  }

  // Crit — pushed as a bonus crit source so priority stacking works
  if (bonuses.crit_chance && bonuses.crit_multiplier) {
    b.crits = [
      ...(b.crits || []),
      { chance: bonuses.crit_chance, mult: bonuses.crit_multiplier },
    ];
  }

  // Proc (MKB-style — used for things like Pierce, etc.)
  if (bonuses.bonus_chance && bonuses.bonus_chance_damage) {
    const procDmg = bonuses.bonus_chance_damage;
    if (!b.mkb || procDmg > b.mkb.damage) {
      b.mkb = { chance: bonuses.bonus_chance, damage: procDmg };
    }
  }

  // Mana burn
  if (bonuses.feedback_mana_burn && bonuses.damage_per_burn) {
    const dmgPerHit = bonuses.feedback_mana_burn * bonuses.damage_per_burn;
    if (!b.manaBurn || dmgPerHit > b.manaBurn.dmgPerHit) {
      b.manaBurn = { dmgPerHit };
    }
  }

  return b;
}

// ─── Item table calculation ───────────────────────────────────────────────────

// Precompute component sets for upgrade detection
const ITEM_COMPONENT_SETS = {};
for (const [key, item] of Object.entries(itemData)) {
  if (item.components && item.components.length) {
    ITEM_COMPONENT_SETS[key] = new Set(
      item.components.filter(
        (c) => itemData[c]?.cost > 0 && !c.startsWith("recipe_"),
      ),
    );
  }
}

/**
 * Compute DPS gain for every buyable item added to the attacker.
 * Returns array sorted by dpsPerGold desc.
 *
 * @param {Object} attackerHero   - getHeroStats result
 * @param {string[]} attackerItemKeys - currently equipped item keys
 * @param {Object} defenderHero   - getHeroStats result
 * @param {string[]} defenderItemKeys - defender's items
 * @returns {Array} sorted rows
 */
export function calcItemTable(
  attackerHero,
  attackerItemKeys,
  defenderHero,
  defenderItemKeys,
  activeItemKeys = [],
  upgradeMode = false,
  attackerBonuses = null,
) {
  const primaryAttr = attackerHero.primaryAttr;
  const defItemStats = resolveItemStats(
    defenderItemKeys,
    defenderHero.primaryAttr,
  );

  let baseAttackerItems = resolveItemStats(
    attackerItemKeys,
    primaryAttr,
    activeItemKeys,
  );
  baseAttackerItems = mergeBonuses(baseAttackerItems, attackerBonuses);
  const {
    effectiveDPS: baseDPS,
    procDPS: baseProcDPS,
    mkbProcDPS: baseMkbProcDPS,
    bashProcDPS: baseBashProcDPS,
    burnDPS: baseBurnDPS,
    manaBurnDPS: baseManaBurnDPS,
  } = calcDps(attackerHero, baseAttackerItems, defenderHero, defItemStats);

  const baseEhp = calcEhp(attackerHero, baseAttackerItems);

  const baseNetworth = baseAttackerItems.networth;

  const rows = [];

  const seenUpgradeItems = new Set();

  for (const [key, item] of Object.entries(itemData)) {
    // Skip recipes, items without a display name, or cost=0
    if (!item.dname || !item.cost || item.cost === 0) continue;
    if (key.startsWith("recipe_") || key.includes("recipe")) continue;

    // Calculate DPS with this item added (equipped items can still appear — replace slot logic handled in UI)
    let newItemStats = resolveItemStats(
      [...attackerItemKeys, key],
      primaryAttr,
      activeItemKeys,
    );
    newItemStats = mergeBonuses(newItemStats, attackerBonuses);
    const {
      effectiveDPS,
      procDPS,
      mkbProcDPS,
      bashProcDPS,
      burnDPS,
      manaBurnDPS,
      aps,
      rawIAS,
      critMult,
      effectiveArmor,
      missChance,
    } = calcDps(attackerHero, newItemStats, defenderHero, defItemStats);

    const newEhp = calcEhp(attackerHero, newItemStats);
    const ehpPhysGain = newEhp.ehpPhys - baseEhp.ehpPhys;
    const ehpMagGain = newEhp.ehpMag - baseEhp.ehpMag;

    const dpsGain = effectiveDPS - baseDPS;
    const procGain = procDPS - baseProcDPS;
    const mkbProcGain = mkbProcDPS - baseMkbProcDPS;
    const bashProcGain = bashProcDPS - baseBashProcDPS;
    const burnGain = burnDPS - baseBurnDPS;
    const manaBurnGain = manaBurnDPS - baseManaBurnDPS;
    const dpsPerGold = item.cost > 0 ? dpsGain / item.cost : 0;
    const networth = baseNetworth + item.cost;

    rows.push({
      key,
      dname: item.dname,
      img: item.img
        ? `https://cdn.cloudflare.steamstatic.com${item.img}`
        : null,
      cost: item.cost,
      dpsGain,
      procGain,
      mkbProcGain,
      bashProcGain,
      burnGain,
      manaBurnGain,
      dpsPerGold,
      networth,
      statEffDPS: effectiveDPS,
      statAps: aps,
      statIAS: rawIAS - (attackerHero.baseIAS + baseAttackerItems.bonusIAS),
      statFlatDmg: newItemStats.bonusDamage - baseAttackerItems.bonusDamage,
      statCrit: critMult,
      statMiss: missChance,
      statArmor: effectiveArmor,
      // Only show proc if this candidate item improves upon the base (not already equipped)
      statChain:
        (newItemStats.chain?.damage ?? -1) >
        (baseAttackerItems.chain?.damage ?? -1)
          ? newItemStats.chain
          : null,
      statMkb:
        (newItemStats.mkb?.damage ?? -1) > (baseAttackerItems.mkb?.damage ?? -1)
          ? newItemStats.mkb
          : null,
      statBash:
        (newItemStats.bash?.damage ?? -1) >
        (baseAttackerItems.bash?.damage ?? -1)
          ? newItemStats.bash
          : null,
      statManaBurn:
        (newItemStats.manaBurn?.dmgPerHit ?? -1) >
        (baseAttackerItems.manaBurn?.dmgPerHit ?? -1)
          ? newItemStats.manaBurn
          : null,
      ehpPhysGain,
      ehpMagGain,
      statEhpPhys: newEhp.ehpPhys,
      statEhpMag: newEhp.ehpMag,
      statTotalHP: newEhp.totalHP,
    });

    // ── Upgrade variant: if attacker has a component, show as upgrade ──
    if (upgradeMode && ITEM_COMPONENT_SETS[key]) {
      if (seenUpgradeItems.has(key)) continue;
      const equippedSet = new Set((attackerItemKeys || []).filter(Boolean));
      for (const equippedKey of equippedSet) {
        if (!ITEM_COMPONENT_SETS[key].has(equippedKey)) continue;

        const compItem = itemData[equippedKey];
        if (!compItem) continue;

        // Replace only ONE instance of the component
        let replaced = false;
        const upgradeKeys = (attackerItemKeys || []).map((k) => {
          if (!replaced && k === equippedKey) {
            replaced = true;
            return key;
          }
          return k;
        });
        if (!replaced) continue;
        let upgradeStats = resolveItemStats(
          upgradeKeys,
          primaryAttr,
          activeItemKeys,
        );
        upgradeStats = mergeBonuses(upgradeStats, attackerBonuses);
        const {
          effectiveDPS: upDPS,
          procDPS: upProcDPS,
          mkbProcDPS: upMkbProcDPS,
          bashProcDPS: upBashProcDPS,
          burnDPS: upBurnDPS,
          manaBurnDPS: upManaBurnDPS,
          aps: upAps,
          rawIAS: upRawIAS,
          critMult: upCritMult,
          effectiveArmor: upEffectiveArmor,
          missChance: upMissChance,
        } = calcDps(attackerHero, upgradeStats, defenderHero, defItemStats);

        const upEhp = calcEhp(attackerHero, upgradeStats);
        const upEhpPhysGain = upEhp.ehpPhys - baseEhp.ehpPhys;
        const upEhpMagGain = upEhp.ehpMag - baseEhp.ehpMag;

        const upgradeCost = item.cost - (compItem.cost || 0);
        const upDpsGain = upDPS - baseDPS;
        const upProcGain = upProcDPS - baseProcDPS;
        const upMkbProcGain = upMkbProcDPS - baseMkbProcDPS;
        const upBashProcGain = upBashProcDPS - baseBashProcDPS;
        const upBurnGain = upBurnDPS - baseBurnDPS;
        const upManaBurnGain = upManaBurnDPS - baseManaBurnDPS;
        const upDpsPerGold = upgradeCost > 0 ? upDpsGain / upgradeCost : 0;
        const upNetworth = baseNetworth + upgradeCost;

        seenUpgradeItems.add(key);

        rows.push({
          key,
          dname: item.dname,
          img: item.img
            ? `https://cdn.cloudflare.steamstatic.com${item.img}`
            : null,
          cost: upgradeCost,
          dpsGain: upDpsGain,
          procGain: upProcGain,
          mkbProcGain: upMkbProcGain,
          bashProcGain: upBashProcGain,
          burnGain: upBurnGain,
          manaBurnGain: upManaBurnGain,
          dpsPerGold: upDpsPerGold,
          networth: upNetworth,
          isUpgrade: true,
          upgradeFrom: equippedKey,
          statEffDPS: upDPS,
          statAps: upAps,
          statIAS:
            upRawIAS - (attackerHero.baseIAS + baseAttackerItems.bonusIAS),
          statFlatDmg: upgradeStats.bonusDamage - baseAttackerItems.bonusDamage,
          statCrit: upCritMult,
          statMiss: upMissChance,
          statArmor: upEffectiveArmor,
          statChain:
            (upgradeStats.chain?.damage ?? -1) >
            (baseAttackerItems.chain?.damage ?? -1)
              ? upgradeStats.chain
              : null,
          statMkb:
            (upgradeStats.mkb?.damage ?? -1) >
            (baseAttackerItems.mkb?.damage ?? -1)
              ? upgradeStats.mkb
              : null,
          statBash:
            (upgradeStats.bash?.damage ?? -1) >
            (baseAttackerItems.bash?.damage ?? -1)
              ? upgradeStats.bash
              : null,
          statManaBurn:
            (upgradeStats.manaBurn?.dmgPerHit ?? -1) >
            (baseAttackerItems.manaBurn?.dmgPerHit ?? -1)
              ? upgradeStats.manaBurn
              : null,
          ehpPhysGain: upEhpPhysGain,
          ehpMagGain: upEhpMagGain,
          statEhpPhys: upEhp.ehpPhys,
          statEhpMag: upEhp.ehpMag,
          statTotalHP: upEhp.totalHP,
        });
      }
    }
  }

  // ── Synthetic rows: active-state variants for Armlet and Mask of Madness ────
  const ACTIVE_ITEM_VARIANTS = [
    { key: "armlet", dname: "Armlet of Mordiggian (Active)" },
    { key: "mask_of_madness", dname: "Mask of Madness (Active)" },
  ];

  for (const { key: activeKey, dname: activeDname } of ACTIVE_ITEM_VARIANTS) {
    if ((activeItemKeys || []).includes(activeKey)) continue; // already active, skip

    const alreadyEquipped = (attackerItemKeys || []).includes(activeKey);
    const itemKeysWithActive = alreadyEquipped
      ? attackerItemKeys
      : [...attackerItemKeys, activeKey];
    let activeItemStats = resolveItemStats(itemKeysWithActive, primaryAttr, [
      ...activeItemKeys,
      activeKey,
    ]);
    activeItemStats = mergeBonuses(activeItemStats, attackerBonuses);
    const {
      effectiveDPS,
      procDPS,
      mkbProcDPS,
      bashProcDPS,
      burnDPS,
      manaBurnDPS,
      aps,
      critMult,
      effectiveArmor,
      missChance,
    } = calcDps(attackerHero, activeItemStats, defenderHero, defItemStats);

    const activeEhp = calcEhp(attackerHero, activeItemStats);
    const activeEhpPhysGain = activeEhp.ehpPhys - baseEhp.ehpPhys;
    const activeEhpMagGain = activeEhp.ehpMag - baseEhp.ehpMag;

    const baseItem = itemData[activeKey];
    const cost = alreadyEquipped ? 0 : baseItem?.cost || 0;
    const dpsGain = effectiveDPS - baseDPS;
    rows.push({
      key: `${activeKey}_active`,
      dname: activeDname,
      img: baseItem?.img
        ? `https://cdn.cloudflare.steamstatic.com${baseItem.img}`
        : null,
      cost,
      dpsGain,
      procGain: procDPS - baseProcDPS,
      mkbProcGain: mkbProcDPS - baseMkbProcDPS,
      bashProcGain: bashProcDPS - baseBashProcDPS,
      burnGain: burnDPS - baseBurnDPS,
      manaBurnGain: manaBurnDPS - baseManaBurnDPS,
      dpsPerGold: cost === 0 ? Infinity : dpsGain / cost,
      networth: baseNetworth + cost,
      statEffDPS: effectiveDPS,
      statAps: aps,
      statIAS: activeItemStats.bonusIAS - baseAttackerItems.bonusIAS,
      statFlatDmg: activeItemStats.bonusDamage - baseAttackerItems.bonusDamage,
      statCrit: critMult,
      statMiss: missChance,
      statArmor: effectiveArmor,
      statChain: activeItemStats.chain || null,
      statMkb: activeItemStats.mkb || null,
      statBash: activeItemStats.bash || null,
      statManaBurn: activeItemStats.manaBurn || null,
      ehpPhysGain: activeEhpPhysGain,
      ehpMagGain: activeEhpMagGain,
      statEhpPhys: activeEhp.ehpPhys,
      statEhpMag: activeEhp.ehpMag,
      statTotalHP: activeEhp.totalHP,
    });
  }

  rows.sort((a, b) => b.dpsPerGold - a.dpsPerGold);
  return rows;
}

// ─── Fight Simulation ─────────────────────────────────────────────────────────

/**
 * Simulate a single fight attack-by-attack with full dice rolls.
 * Both units attack on independent timers, both starting at t=0.
 *
 * @param {Object} attackerHero   - From getUnitStats / getHeroStats
 * @param {Object} attackerItems  - From resolveItemStats (already merged with bonuses)
 * @param {Object} defenderHero
 * @param {Object} defenderItems
 * @param {Object} [opts]         { maxTime: 120, logEvents: true }
 * @returns {{ winner, ttkAtk, ttkDef, atkMaxHP, defMaxHP, atkFinalHP, defFinalHP, log }}
 */
export function simulateFight(
  attackerHero,
  attackerItems,
  defenderHero,
  defenderItems,
  opts = {},
) {
  const { maxTime = 120, logEvents = true } = opts;

  // ── APS ──
  const apsOf = (hero, items, enemyItems) => {
    const baseASBonus =
      (hero.baseIAS + (items.rawAgi || 0)) *
      ((items.bonusBaseASPct || 0) / 100);
    const rawIAS =
      hero.baseIAS +
      (items.bonusIAS || 0) +
      baseASBonus +
      ((enemyItems && enemyItems.auraEnemyIAS) || 0);
    return hero.bat ? Math.max(0.2 / hero.bat, rawIAS / (100 * hero.bat)) : 0;
  };
  const atkAps = apsOf(attackerHero, attackerItems, defenderItems);
  const defAps = apsOf(defenderHero, defenderItems, attackerItems);
  const atkInterval = atkAps > 0 ? 1 / atkAps : Infinity;
  const defInterval = defAps > 0 ? 1 / defAps : Infinity;

  // ── Armor / resist ──
  const defEffArmor =
    (defenderHero.effectiveArmor || 0) +
    (defenderItems.bonusArmor || 0) +
    (attackerItems.corruptionArmor || 0) +
    (attackerItems.auraNegArmor || 0);
  const defPhysMult = armorToPhysMult(defEffArmor);
  const defMagicMult = 1 - (defenderHero.magicResist || 0) / 100;
  const defDmgReduction = defenderHero.damageReduction || 0;

  const atkEffArmor =
    (attackerHero.effectiveArmor || 0) +
    (attackerItems.bonusArmor || 0) +
    (defenderItems.corruptionArmor || 0) +
    (defenderItems.auraNegArmor || 0);
  const atkPhysMult = armorToPhysMult(atkEffArmor);
  const atkMagicMult = 1 - (attackerHero.magicResist || 0) / 100;
  const atkDmgReduction = attackerHero.damageReduction || 0;

  // ── Evasion ──
  const defEvasion = compoundEvasion(defenderItems.evasions || []);
  const atkEvasion = compoundEvasion(attackerItems.evasions || []);

  // ── Block (with innate melee hero block) ──
  const INNATE_MELEE_BLOCK = { chance: 50, melee: 16, ranged: 16 };
  const resolveBlock = (itemBlock, hero) => {
    if (!hero.isMelee || hero.noInnateBlock) return itemBlock || null;
    if (!itemBlock || !itemBlock.chance) return INNATE_MELEE_BLOCK;
    return INNATE_MELEE_BLOCK.melee >= (itemBlock.melee || 0)
      ? INNATE_MELEE_BLOCK
      : itemBlock;
  };
  const atkBlock = resolveBlock(attackerItems.damageBlock, attackerHero);
  const defBlock = resolveBlock(defenderItems.damageBlock, defenderHero);

  // ── HP ──
  const atkMaxHP =
    (attackerHero.maxHP || 0) +
    (attackerItems.rawStr || 0) * 22 +
    (attackerItems.bonusHealth || 0);
  const defMaxHP =
    (defenderHero.maxHP || 0) +
    (defenderItems.rawStr || 0) * 22 +
    (defenderItems.bonusHealth || 0);
  let atkHP = atkMaxHP;
  let defHP = defMaxHP;

  // ── Regen (HP/sec) ──
  const atkRegen =
    (attackerHero.totalStr || 0) * 0.1 + (attackerItems.healthRegen || 0);
  const defRegen =
    (defenderHero.totalStr || 0) * 0.1 + (defenderItems.healthRegen || 0);

  // ── Damage ranges ──
  const dmgRange = (hero, items) => {
    const bonus = items.bonusDamage || 0;
    const min =
      hero.minBaseDamage !== undefined
        ? hero.minBaseDamage
        : hero.avgBaseDamage || 0;
    const max =
      hero.maxBaseDamage !== undefined
        ? hero.maxBaseDamage
        : hero.avgBaseDamage || 0;
    return { min: min + bonus, max: max + bonus };
  };
  const atkDmg = dmgRange(attackerHero, attackerItems);
  const defDmg = dmgRange(defenderHero, defenderItems);

  // ── Helpers ──
  const rand = (min, max) => min + Math.random() * (max - min);
  const rollCrit = (crits) => {
    if (!crits || !crits.length) return 1;
    const sorted = [...crits].sort((a, b) => b.mult - a.mult);
    for (const { chance, mult } of sorted) {
      if (Math.random() * 100 < chance) return mult / 100;
    }
    return 1;
  };
  const rollBlock = (block, isAttackerMelee) => {
    if (!block || !block.chance) return 0;
    if (Math.random() * 100 >= block.chance) return 0;
    return isAttackerMelee ? block.melee : block.ranged || block.melee;
  };

  // ── Towers: procs don't work ──
  const atkTargetIsStructure = !!defenderHero.damageReduction;
  const defTargetIsStructure = !!attackerHero.damageReduction;

  // ── Single attack by one unit ──
  const doAttack = (isAtk) => {
    const ai = isAtk ? attackerItems : defenderItems;
    const ah = isAtk ? attackerHero : defenderHero;
    const dmg = isAtk ? atkDmg : defDmg;
    const physMult = isAtk ? defPhysMult : atkPhysMult;
    const magicMult = isAtk ? defMagicMult : atkMagicMult;
    const dmgReduction = isAtk ? defDmgReduction : atkDmgReduction;
    const targetEvasion = isAtk ? defEvasion : atkEvasion;
    const targetBlock = isAtk ? defBlock : atkBlock;
    const lifestealFrac = (ai.lifesteal || 0) / 100;
    const targetIsStructure = isAtk
      ? atkTargetIsStructure
      : defTargetIsStructure;

    // MKB: if proc, this attack has true strike (bypasses evasion); doesn't work vs structures
    const isMkbProc =
      !targetIsStructure && !!(ai.mkb && Math.random() * 100 < ai.mkb.chance);

    if (!isMkbProc && targetEvasion > 0 && Math.random() < targetEvasion) {
      if (logEvents) log.push({ t, isAtk, missed: true, atkHP, defHP });
      return;
    }

    let rawDmg = rand(dmg.min, dmg.max);
    const critMult = rollCrit(ai.crits);
    const isCrit = critMult > 1;
    rawDmg *= critMult;

    const blockAmt = rollBlock(targetBlock, ah.isMelee);
    const blocked = Math.min(blockAmt, Math.max(0, rawDmg));
    rawDmg = Math.max(0, rawDmg - blocked);

    const physDmg = rawDmg * physMult * (1 - dmgReduction);
    const mkbBonusDmg = isMkbProc
      ? ai.mkb.damage * magicMult * (1 - dmgReduction)
      : 0;

    let bashDmg = 0;
    if (!isMkbProc && !targetIsStructure && ai.bash) {
      const bChance = ah.isMelee ? ai.bash.chanceM : ai.bash.chanceR;
      if (Math.random() * 100 < bChance) {
        bashDmg = ai.bash.damage * physMult * (1 - dmgReduction);
      }
    }

    const burnDmg =
      !targetIsStructure && ai.manaBurn
        ? ai.manaBurn.dmgPerHit * physMult * (1 - dmgReduction)
        : 0;

    const totalDmg = physDmg + mkbBonusDmg + bashDmg + burnDmg;

    if (isAtk) {
      defHP -= totalDmg;
      if (lifestealFrac > 0)
        atkHP = Math.min(atkMaxHP, atkHP + physDmg * lifestealFrac);
    } else {
      atkHP -= totalDmg;
      if (lifestealFrac > 0)
        defHP = Math.min(defMaxHP, defHP + physDmg * lifestealFrac);
    }

    if (logEvents) {
      log.push({
        t,
        isAtk,
        missed: false,
        rawDmg: rawDmg + blocked,
        totalDmg,
        isCrit,
        isMkbProc,
        hasBash: bashDmg > 0,
        blocked: blocked > 0,
        atkHP: Math.max(0, atkHP),
        defHP: Math.max(0, defHP),
      });
    }
  };

  // ── Main loop ──
  // Randomise who attacks first: each unit's first attack is offset by a
  // random fraction [0, interval) so neither always goes first.
  let atkNextAtk =
    atkInterval > 0 && atkInterval < Infinity ? Math.random() * atkInterval : 0;
  let defNextAtk =
    defInterval > 0 && defInterval < Infinity ? Math.random() * defInterval : 0;
  let lastRegenT = 0;
  const log = [];
  let t = 0;

  while (t <= maxTime) {
    const nextAtkT = atkAps > 0 ? atkNextAtk : Infinity;
    const nextDefT = defAps > 0 ? defNextAtk : Infinity;
    const nextT = Math.min(nextAtkT, nextDefT);
    if (nextT > maxTime || nextT === Infinity) break;

    // Apply regen for elapsed time
    const dt = nextT - lastRegenT;
    if (dt > 0) {
      atkHP = Math.min(atkMaxHP, atkHP + atkRegen * dt);
      defHP = Math.min(defMaxHP, defHP + defRegen * dt);
      lastRegenT = nextT;
    }

    t = nextT;

    const atkAtksNow = atkAps > 0 && Math.abs(atkNextAtk - t) < 1e-9;
    const defAtksNow = defAps > 0 && Math.abs(defNextAtk - t) < 1e-9;

    if (atkAtksNow) {
      atkNextAtk += atkInterval;
      doAttack(true);
    }
    // Defender attacks; skip if already killed this tick
    if (defAtksNow && defHP > 0 && atkHP > 0) {
      defNextAtk += defInterval;
      doAttack(false);
    }

    if (atkHP <= 0 || defHP <= 0) break;
  }

  const atkDied = atkHP <= 0;
  const defDied = defHP <= 0;
  const winner =
    atkDied && defDied
      ? "draw"
      : defDied
      ? "attacker"
      : atkDied
      ? "defender"
      : "timeout";

  return {
    winner,
    ttkAtk: defDied ? t : null,
    ttkDef: atkDied ? t : null,
    atkMaxHP,
    defMaxHP,
    atkFinalHP: Math.max(0, atkHP),
    defFinalHP: Math.max(0, defHP),
    atkFinalHPPct: atkMaxHP > 0 ? Math.max(0, atkHP) / atkMaxHP : 0,
    log,
  };
}

/**
 * Run N independent fight simulations and return aggregate statistics
 * plus one logged example fight.
 */
export function runFightSimulation(
  attackerHero,
  attackerItems,
  defenderHero,
  defenderItems,
  n = 100,
) {
  const results = [];
  for (let i = 0; i < n; i++) {
    results.push(
      simulateFight(attackerHero, attackerItems, defenderHero, defenderItems, {
        logEvents: false,
      }),
    );
  }

  const atkWins = results.filter((r) => r.winner === "attacker").length;
  const defWins = results.filter((r) => r.winner === "defender").length;
  const draws = results.filter(
    (r) => r.winner === "draw" || r.winner === "timeout",
  ).length;

  const atkTimes = results
    .filter((r) => r.winner === "attacker")
    .map((r) => r.ttkAtk);
  const defTimes = results
    .filter((r) => r.winner === "defender")
    .map((r) => r.ttkDef);
  // Attacker remaining HP % in fights the attacker wins
  const atkWinHPPcts = results
    .filter((r) => r.winner === "attacker")
    .map((r) => r.atkFinalHPPct);

  const mean = (arr) =>
    arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;
  const median = (arr) => {
    if (!arr.length) return null;
    const s = [...arr].sort((a, b) => a - b);
    const m = Math.floor(s.length / 2);
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
  };
  const stdDev = (arr) => {
    if (arr.length < 2) return 0;
    const m = mean(arr);
    return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length);
  };

  // Run one more fight with logging for the example
  const exampleFight = simulateFight(
    attackerHero,
    attackerItems,
    defenderHero,
    defenderItems,
    { logEvents: true },
  );

  return {
    n,
    atkWins,
    defWins,
    draws,
    atkWinPct: (atkWins / n) * 100,
    defWinPct: (defWins / n) * 100,
    drawPct: (draws / n) * 100,
    atkMeanTTK: mean(atkTimes),
    atkMedianTTK: median(atkTimes),
    atkStdTTK: stdDev(atkTimes),
    atkMinTTK: atkTimes.length ? Math.min(...atkTimes) : null,
    atkMaxTTK: atkTimes.length ? Math.max(...atkTimes) : null,
    defMeanTTK: mean(defTimes),
    defMedianTTK: median(defTimes),
    defStdTTK: stdDev(defTimes),
    defMinTTK: defTimes.length ? Math.min(...defTimes) : null,
    defMaxTTK: defTimes.length ? Math.max(...defTimes) : null,
    atkWinMeanHPPct: mean(atkWinHPPcts),
    atkWinMinHPPct: atkWinHPPcts.length ? Math.min(...atkWinHPPcts) : null,
    atkWinMaxHPPct: atkWinHPPcts.length ? Math.max(...atkWinHPPcts) : null,
    exampleFight,
  };
}
