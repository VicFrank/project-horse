<template>
  <div class="text-center">
    <GodImage :god="god"></GodImage>
    <h1 class="page-title">{{ $t(`gods.${god}`) }}</h1>

    <b-tabs content-class="mt-3" style="max-width: 700px; margin: auto" lazy>
      <b-tab title="Abilities" active>
        <div class="text-left d-flex mb-2">
          <div>
            <div class="mb-2">Date</div>
            <b-form-select
              v-model="selectedDate"
              :options="dateOptions"
              @change="loadGodStats(true)"
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
              @change="loadGodStats(true)"
              :disabled="loading"
              style="width: 100px"
              class="mx-auto"
            ></b-form-select>
          </div>
        </div>
        <GodAbilityStats
          :loading="loading"
          :showPercentages="selectedMMR == null"
          :linkAbilities="true"
          :abilities="godStats"
          @created="loadGodStats"
        ></GodAbilityStats>
      </b-tab>
      <b-tab title="Trends">
        <GodHistoricalStats :godName="god" />
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import GodAbilityStats from "../abilities/GodAbilityStats.vue";
import GodImage from "../../games/components/GodImage.vue";
import GodHistoricalStats from "../components/GodHistoricalStats.vue";

export default {
  components: {
    GodAbilityStats,
    GodImage,
    GodHistoricalStats,
  },

  data: () => ({
    icon: null,
    godStats: [],
    loading: true,
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

  computed: {
    god() {
      return this.$route.params.god;
    },
  },

  methods: {
    loadGodStats(force) {
      if (!force && this.godStats.length > 0) return;
      this.loading = true;
      fetch(
        `/api/stats/gods/${this.god}?hours=${this.selectedDate}&minMMR=${this.selectedMMR}`
      )
        .then((res) => res.json())
        .then((stats) => {
          this.godStats = stats;
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped>
</style>