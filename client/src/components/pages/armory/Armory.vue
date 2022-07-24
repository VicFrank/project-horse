<template>
  <div>
    <h1 v-t="'armory.page_title'" class="page-title"></h1>

    <div class="container">
      <div class="row">
        <div class="col-xl-12">
          <div class="search-bar mb-3">
            <div class="search-input">
              <input
                type="text"
                name="search"
                placeholder="Search..."
                v-model="searchText"
              />
            </div>
          </div>

          <div class="cosmetic-bar">
            <div class="btns-bar">
              <cosmeticsFilter
                v-for="filter in filters"
                :key="filter.name"
                v-on:toggle-filter="toggleFilter"
                :filterName="filter.name"
                :isLeft="filter.isLeft"
                :isRight="filter.isRight"
                :active="filter.active"
              />
            </div>
          </div>

          <b-alert v-model="showError" show variant="danger" dismissible>{{
            error
          }}</b-alert>

          <div v-if="loading" class="d-flex justify-content-center mb-3">
            <b-spinner label="Loading..."></b-spinner>
          </div>
          <div v-if="filteredCosmetics.length > 0" class="cosmetics mb-3">
            <div
              v-for="[i, cosmetic] of filteredCosmetics.entries()"
              :key="
                cosmetic.cosmetic_id + cosmetic.created + cosmetic.equipped + i
              "
              class="cosmetics__item"
            >
              <div class="cosmetic" @click="$bvModal.show(`modal-${i}`)">
                <div class="cosmetic__picture">
                  <img
                    v-bind:src="cosmeticImageSrc(cosmetic)"
                    :alt="cosmetic.cosmetic_name"
                  />
                  <img
                    v-if="cosmetic.equipped"
                    src="../../../assets/images/cosmetics/equipped.png"
                    class="equipped-overlay"
                    alt
                  />
                </div>
                <div class="cosmetic__descr">
                  <div class="cosmetic__name">
                    {{ $t(`cosmetics.${cosmetic.cosmetic_name}`) }}
                  </div>
                  <div class="text-muted">
                    {{ cosmetic.cosmetic_type }}
                  </div>
                </div>
              </div>
              <b-modal
                :id="`modal-${i}`"
                :ref="`modal-${i}`"
                :title="$t(`cosmetics.${cosmetic.cosmetic_name}`)"
                centered
                hide-footer
                @hide="onHide"
              >
                <template v-if="cosmetic.cosmetic_type !== 'Chest'">
                  <div class="text-center mb-2">
                    <img
                      v-bind:src="cosmeticImageSrc(cosmetic)"
                      :alt="cosmetic.cosmetic_id"
                    />
                  </div>
                  <CosmeticDescription :cosmetic="cosmetic" />
                  <div class="mt-4 d-flex justify-content-end">
                    <template v-if="equippable(cosmetic)">
                      <b-button
                        class="mr-2"
                        variant="secondary"
                        @click="hideModal(i)"
                        >{{ $t("armory.close") }}</b-button
                      >
                      <b-button
                        v-if="!cosmetic.equipped"
                        class="mr-2"
                        variant="primary"
                        @click="equipCosmetic(cosmetic, true, i)"
                        >{{ $t("armory.equip") }}</b-button
                      >
                      <b-button
                        v-if="cosmetic.equipped"
                        class="mr-2"
                        variant="primary"
                        @click="equipCosmetic(cosmetic, false, i)"
                        >{{ $t("armory.unequip") }}</b-button
                      >
                    </template>

                    <b-button
                      v-if="isUsable(cosmetic)"
                      class="mr-2"
                      variant="primary"
                      @click="consumeItem(cosmetic, i)"
                      >{{ $t("armory.use") }}</b-button
                    >
                  </div>
                </template>
                <template v-else>
                  <ChestOpener
                    :cosmetic="cosmetic"
                    v-on:cancel="hideModal(i)"
                    v-on:open="open()"
                    v-on:claim="claim()"
                  />
                </template>
              </b-modal>
            </div>
          </div>
          <!-- <div v-else-if="!loading" class="h3 blue row mt-3">No cosmetics found</div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import filterCosmetics from "../cosmetics/cosmeticFilters";
import CosmeticsFilter from "../cosmetics/CosmeticsFilter.vue";
import ChestOpener from "../cosmetics/ChestOpener.vue";
import CosmeticDescription from "../cosmetics/CosmeticDescription";

export default {
  name: "Armory",
  components: {
    CosmeticsFilter,
    ChestOpener,
    CosmeticDescription,
  },
  data() {
    return {
      searchText: "",
      currentFilter: "All",
      cosmetics: [],
      filteredCosmetics: [],
      activeRarityFilters: [],
      loading: true,
      showError: false,
      error: "",
      needReload: false,

      filters: [
        {
          name: "Chests",
          active: false,
        },
        {
          name: "Battle Pass",
          active: false,
        },
        {
          name: "Arenas",
          active: false,
        },
        {
          name: "Gods",
          active: false,
        },
        {
          name: "All",
          isRight: true,
          active: true,
        },
      ],
    };
  },

  computed: {
    steamID() {
      return this.$store.state.auth.userSteamID;
    },
    bpTier() {
      return this.$store.state.auth.bpTier;
    },
    bpUpgraded() {
      return this.$store.getters.bpUpgraded;
    },
  },

  created() {
    this.getPlayerCosmetics();
  },

  watch: {
    searchText: function () {
      this.updateFilteredCosmetics();
    },
  },

  methods: {
    getPlayerCosmetics() {
      fetch(`/api/players/${this.$store.state.auth.userSteamID}/cosmetics`)
        .then((res) => res.json())
        .then((cosmetics) => {
          const sortedCosmetics = cosmetics.sort((c1, c2) => {
            if (this.isConsumableOrChest(c1) && !this.isConsumableOrChest(c2)) {
              return -1;
            } else if (
              this.isConsumableOrChest(c2) &&
              !this.isConsumableOrChest(c1)
            ) {
              return 1;
            } else if (
              this.isConsumableOrChest(c1) &&
              this.isConsumableOrChest(c2)
            ) {
              return c1.cosmetic_name.localeCompare(c2.cosmetic_name);
            }
            const c1type = c1.cosmetic_type;
            const c2type = c2.cosmetic_type;
            if (c1type == c2type) {
              return c1.cosmetic_name.localeCompare(c2.cosmetic_name);
            }
            return c1type.localeCompare(c2type);
          });
          this.cosmetics = sortedCosmetics;
          this.filteredCosmetics = sortedCosmetics;
          this.updateFilteredCosmetics();
          this.loading = false;
        })
        .catch((err) => {
          this.showError = true;
          this.error = err;
          this.loading = false;
        });
    },
    isConsumableOrChest(cosmetic) {
      return (
        cosmetic.cosmetic_type === "Chest" ||
        cosmetic.cosmetic_type === "Consumable"
      );
    },
    isUsable(cosmetic) {
      if (cosmetic.cosmetic_name === "buy_bp" && this.bpUpgraded) {
        return false;
      }
      return cosmetic.cosmetic_type === "Consumable";
    },
    hideModal(i) {
      this.$refs[`modal-${i}`][0].hide();
    },
    hideAllModals() {
      for (const modal of Object.values(this.$refs)) {
        if (modal[0] && modal[0].hide) modal[0].hide();
      }
    },
    open() {
      this.needReload = true;
    },
    onHide() {
      if (this.needReload) {
        this.needReload = false;
        this.hideAllModals();
        this.getPlayerCosmetics();
      }
    },
    claim() {
      this.needReload = false;
      this.hideAllModals();
      this.getPlayerCosmetics();
    },
    equippable(cosmetic) {
      return cosmetic.equip_group != "";
    },
    cosmeticImageSrc(cosmetic) {
      const { cosmetic_name, cosmetic_type } = cosmetic;
      const includedTypes = [
        "Card Frame",
        "Chest",
        "Finisher",
        "Consumable",
        "Game Consumable",
        "Terrain",
      ];
      if (includedTypes.includes(cosmetic_type))
        return require(`../../../assets/images/cosmetics/${cosmetic_name}.png`);
      else return require(`../../../assets/images/cosmetics/placeholder.png`);
    },
    toggleFilter(name) {
      this.filters = this.filters.map((filter) => ({
        ...filter,
        active: filter.name === name,
      }));

      this.currentFilter = name;
      this.updateFilteredCosmetics();
    },
    updateFilteredCosmetics() {
      this.filteredCosmetics = filterCosmetics(
        this.cosmetics,
        this.currentFilter,
        this.activeRarityFilters,
        this.searchText
      );
    },
    equipCosmetic(cosmetic, equip, i) {
      fetch(
        `/api/players/${this.steamID}/cosmetics/${cosmetic.cosmetic_id}/equip?equip=${equip}`,
        { method: "post" }
      )
        .then((res) => {
          if (!res.ok) throw Error(res.statusText);
          return res;
        })
        .then((res) => res.json())
        .then(() => {
          this.getPlayerCosmetics();
          this.hideModal(i);
        })
        .catch((err) => {
          this.error = err;
          this.showError = true;
        });
    },
    consumeItem(cosmetic, i) {
      fetch(`/api/players/${this.steamID}/use_item/${cosmetic.cosmetic_id}`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.error) {
            this.error = res.error;
            this.showError = true;
          } else {
            this.success = true;
            this.hideModal(i);
            this.$store.dispatch("REFRESH_BATTLE_PASS");
            this.$store.dispatch("REFRESH_PLAYER");
            this.getPlayerCosmetics();
          }
        })
        .catch((err) => {
          this.error = err;
          this.showError = true;
        });
    },
  },
};
</script>

<style>
</style>