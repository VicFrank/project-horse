import heroesData from "../data/heroes.json";

/**
 * Returns all heroes as a sorted array of { id, dname, ... }
 * Sorted alphabetically by display name.
 */
export function getAllHeroes() {
  return Object.values(heroesData).sort((a, b) =>
    a.dname.localeCompare(b.dname),
  );
}

/**
 * Returns the raw hero entry by id key (e.g. "npc_dota_hero_antimage")
 */
export function getHeroById(id) {
  return heroesData[id] || null;
}

/**
 * Compute derived hero stats at a given level (1-30).
 *
 * Returns:
 *   totalStr, totalAgi, totalInt   — total attribute values at level
 *   avgBaseDamage                   — (min+max)/2 + primary attr bonus
 *   baseIAS                         — BaseAttackSpeed + totalAgi
 *   effectiveArmor                  — baseArmor + totalAgi/6
 *   maxHP                           — baseHealth + totalStr * 22
 *   bat, magicResist, moveSpeed, isMelee, attackRange — unchanged base values
 */
export function getHeroStats(heroId, level = 1) {
  const h = heroesData[heroId];
  if (!h) return null;

  const lvl = Math.max(1, Math.min(30, level));

  const totalStr = h.baseStr + h.strGain * (lvl - 1);
  const totalAgi = h.baseAgi + h.agiGain * (lvl - 1);
  const totalInt = h.baseInt + h.intGain * (lvl - 1);

  // Damage from primary attribute (or 0.7 per attr for universal)
  let attrDamage;
  if (h.primaryAttr === "universal") {
    attrDamage = (totalStr + totalAgi + totalInt) * 0.7;
  } else if (h.primaryAttr === "strength") {
    attrDamage = totalStr;
  } else if (h.primaryAttr === "agility") {
    attrDamage = totalAgi;
  } else {
    attrDamage = totalInt;
  }

  const avgBaseDamage = (h.baseDamageMin + h.baseDamageMax) / 2 + attrDamage;
  const minBaseDamage = h.baseDamageMin + attrDamage;
  const maxBaseDamage = h.baseDamageMax + attrDamage;
  const baseIAS = h.baseAttackSpeed + totalAgi; // every hero gets 1 IAS per AGI
  const effectiveArmor = h.baseArmor + totalAgi / 6;
  const maxHP = h.baseHealth + totalStr * 22;

  return {
    id: h.id,
    dname: h.dname,
    primaryAttr: h.primaryAttr,
    totalStr,
    totalAgi,
    totalInt,
    avgBaseDamage,
    minBaseDamage,
    maxBaseDamage,
    baseAttackSpeed: h.baseAttackSpeed,
    baseIAS,
    effectiveArmor,
    maxHP,
    bat: h.bat,
    magicResist: h.magicResist,
    moveSpeed: h.moveSpeed,
    isMelee: h.isMelee,
    attackRange: h.attackRange,
  };
}
