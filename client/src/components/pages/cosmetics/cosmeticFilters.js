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

      const { cosmetic_type, equipped } = cosmetic;
      if (currentFilter === "Chests") {
        if (cosmetic_type === "Chest") return true;
      }
      if (currentFilter === "Arenas") {
        if (cosmetic_type === "Terrain") return true;
      }
      if (currentFilter === "Gods") {
        if (cosmetic_type === "Card Frame") return true;
      }
      if (currentFilter === "Consumable") {
        if (cosmetic_type === "Consumable" || cosmetic_type === "Chest")
          return true;
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
      if (!searchText) return true;
      const { cosmetic_name } = cosmetic;
      const search = searchText.toLowerCase();
      if (cosmetic_name.includes(search)) return true;
      return false;
    });
};

export default filterCosmetics;
