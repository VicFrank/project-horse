const filterCosmetics = (
  cosmetics,
  currentFilter,
  activeRarityFilters,
  searchText
) => {
  return cosmetics
    .filter((cosmetic) => {
      // Type Filter
      if (currentFilter === "All") {
        return true;
      }

      const { cosmetic_type, equip_group, equipped } = cosmetic;
      if (currentFilter === "Companions") {
        if (equip_group === "companion") {
          return true;
        }
      }
      if (currentFilter === "Companions FX") {
        if (equip_group === "companion_fx") {
          return true;
        }
      }
      if (currentFilter === "Chests") {
        if (cosmetic_type === "Chest") {
          return true;
        }
      }
      if (currentFilter === "Battle Pass") {
        if (
          cosmetic_type === "Battlepass FX" ||
          cosmetic_type === "Avatar" ||
          cosmetic_type === "Border"
        ) {
          return true;
        }
      }
      if (currentFilter === "Announcer") {
        if (equip_group === "announcer") {
          return true;
        }
      }
      if (currentFilter === "XP") {
        if (
          cosmetic_type === "XP" ||
          cosmetic_type === "Chest XP" ||
          cosmetic_type == "BP Accelerator"
        ) {
          return true;
        }
      }
      if (currentFilter === "Equipped") {
        return equipped;
      }
      return false;
    })
    .filter((cosmetic) => {
      // Rarity Filter
      if (activeRarityFilters.size > 0) {
        return activeRarityFilters.has(cosmetic.rarity);
      }
      return true;
    })
    .filter((cosmetic) => {
      // Text Search Filter
      if (!searchText) {
        return true;
      }
      const { cosmetic_id } = cosmetic;
      const name = cosmetic_id;
      const search = searchText.toLowerCase();
      if (
        search === "" ||
        name.includes(search) ||
        cosmetic_id.includes(search)
      ) {
        return true;
      }
      return false;
    });
};

export default filterCosmetics;
