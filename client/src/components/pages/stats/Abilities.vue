<template>
  <div class="text-center">
    <h1 class="page-title" v-t="'stats.abilities'"></h1>

    <b-tabs content-class="mt-3" style="max-width: 700px; margin: auto" lazy>
      <b-tab title="Abilities" active>
        <template v-if="abilitiesLoading">
          <div class="d-flex justify-content-center my-3">
            <b-spinner label="Loading..."></b-spinner>
          </div>
        </template>
        <AbilityStats
          :abilities="abilityStats"
          @created="loadAbilityStats"
        ></AbilityStats>
      </b-tab>
      <b-tab title="Gabens">
        <template v-if="gabensLoading">
          <div class="d-flex justify-content-center my-3">
            <b-spinner label="Loading..."></b-spinner>
          </div>
        </template>
        <GabenStats
          :abilities="gabenStats"
          @created="loadGabenStats"
        ></GabenStats>
      </b-tab>
      <b-tab title="Supers">
        <template v-if="supersLoading">
          <div class="d-flex justify-content-center my-3">
            <b-spinner label="Loading..."></b-spinner>
          </div>
        </template>
        <GabenStats
          :abilities="superStats"
          @created="loadSuperStats"
        ></GabenStats>
      </b-tab>
      <b-tab title="(Winner) Levels">
        <template v-if="winnerStatsLoading">
          <div class="d-flex justify-content-center my-3">
            <b-spinner label="Loading..."></b-spinner>
          </div>
        </template>
        <WinnerLevelStats
          :abilities="winnerStats"
          @created="loadWinnerLevelStats"
        ></WinnerLevelStats>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import AbilityStats from "./AbilityStats.vue";
import GabenStats from "./GabenStats.vue";
import WinnerLevelStats from "./WinnerLevelStats.vue";

export default {
  components: {
    AbilityStats,
    GabenStats,
    WinnerLevelStats,
  },

  data: () => ({
    abilityStats: [],
    superStats: [],
    gabenStats: [],
    winnerStats: [],
    abilitiesLoading: true,
    gabensLoading: true,
    supersLoading: true,
    winnerStatsLoading: true,
  }),

  methods: {
    loadAbilityStats() {
      if (this.abilityStats.length > 0) return;
      this.abilitiesLoading = true;
      fetch(`/api/stats/abilities`)
        .then((res) => res.json())
        .then((abilities) => {
          this.abilityStats = abilities;
          this.abilitiesLoading = false;
        });
    },

    loadSuperStats() {
      if (this.superStats.length > 0) return;
      this.supersLoading = true;
      fetch(`/api/stats/abilities/supers`)
        .then((res) => res.json())
        .then((superStats) => {
          this.superStats = superStats;
          this.supersLoading = false;
        });
    },

    loadGabenStats() {
      if (this.gabenStats.length > 0) return;
      this.gabensLoading = true;
      fetch(`/api/stats/abilities/gabens`)
        .then((res) => res.json())
        .then((gabenStats) => {
          this.gabenStats = gabenStats;
          this.gabensLoading = false;
        });
    },

    loadWinnerLevelStats() {
      if (this.winnerStats.length > 0) return;
      this.winnerStatsLoading = true;
      fetch(`/api/stats/abilities/winner_levels`)
        .then((res) => res.json())
        .then((winnerStats) => {
          this.winnerStats = winnerStats;
          this.winnerStatsLoading = false;
        });
    },
  },
};
</script>

<style scoped>
</style>