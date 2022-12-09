<template>
  <div class="text-center">
    <h1 class="page-title" v-t="'stats.abilities'"></h1>

    <b-tabs content-class="mt-3" style="max-width: 700px; margin: auto" lazy>
      <b-tab title="Abilities" active>
        <div class="text-left d-flex mb-2">
          <div>
            <div class="mb-2">Date</div>
            <b-form-select
              v-model="selectedDate"
              :options="dateOptions"
              @change="loadAbilityStats(true)"
              :disabled="loading"
              style="width: 100px"
              class="mx-auto"
            ></b-form-select>
          </div>
          <div class="ml-2">
            <div class="mb-2">MMR</div>
            <b-form-select
              v-model="selectedMMR"
              :options="mmrOptions"
              @change="loadAbilityStats(true)"
              :disabled="loading"
              style="width: 100px"
              class="mx-auto"
            ></b-form-select>
          </div>
        </div>
        <template v-if="abilitiesLoading">
          <div class="d-flex justify-content-center my-3">
            <b-spinner label="Loading..."></b-spinner>
          </div>
        </template>
        <AbilityStats
          :showPercentages="selectedMMR == null"
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
    selectedDate: 24,
    selectedMMR: null,
    dateOptions: [
      { value: 24, text: "Day" },
      { value: 24 * 7, text: "Week" },
      { value: 24 * 30, text: "Month" },
    ],
    mmrOptions: [
      { value: null, text: "All MMR" },
      { value: 1000, text: "1000+" },
      { value: 1100, text: "1100+" },
      { value: 1200, text: "1200+" },
      { value: 1300, text: "1300+" },
      { value: 1400, text: "1400+" },
      { value: 1500, text: "1500+" },
      { value: 1600, text: "1600+" },
    ],
  }),

  methods: {
    loadAbilityStats(force) {
      if (!force && this.abilityStats.length > 0) return;
      this.abilitiesLoading = true;
      fetch(
        `/api/stats/abilities?hours=${this.selectedDate}&minMMR=${this.selectedMMR}`
      )
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