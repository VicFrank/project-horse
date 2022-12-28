<template>
  <div>
    <h1 class="page-title">{{ $t("gods.page_title") }}</h1>
    <h5 v-if="!loading" style="text-align: center;">Viewing stats for {{ totalGames }} games</h5>
    <div class="mx-auto d-flex mb-2" style="max-width: 700px">
      <div>
        <div class="mb-2">Date</div>
        <b-form-select
          v-model="selectedDate"
          :options="dateOptions"
          @change="loadGodStats()"
          :disabled="loading"
          style="width: 100px"
          class="mx-auto"
        ></b-form-select>
      </div>
      <div class="ml-2">
        <div class="mb-2">Rank</div>
        <b-dropdown text="Select Ranks" variant="primary">
          <b-dropdown-form>
            <b-form-checkbox-group 
              v-model="selectedRanks" 
              :options="allRanks" 
              @change="loadGodStats()"
              :disabled="loading" 
              class="mx-auto">
            </b-form-checkbox-group>
          </b-dropdown-form>
        </b-dropdown>
      </div>
    </div>
    <GodStats :gods="gods" :linkAbilities="true" :loading="loading"></GodStats>
  </div>
</template>

<script>
import GodStats from "./GodStats.vue";

export default {
  components: {
    GodStats,
  },

  data: () => ({
    gods: [],
    loading: true,
    totalGames: 0,

    selectedDate: null,
    dateOptions: [],

    selectedRanks: ['Immortal'],
    allRanks: [
      "Herald",
      "Guardian",
      "Crusader",
      "Archon",
      "Legend",
      "Ancient",
      "Divine",
      "Immortal"
    ],
  }),

  created() {
    this.dateOptions = [
      { value: { startDate: '2022-09-01', endDate: this.daysAgo(0) }, text: "All Time" },
      { value: null, text: "------------", disabled: true },
      { value: { startDate: this.daysAgo(7), endDate: this.daysAgo(0) }, text: "Week" },
      { value: { startDate: this.daysAgo(30), endDate: this.daysAgo(0) }, text: "Month" },
      { value: { startDate: this.daysAgo(365), endDate: this.daysAgo(0) }, text: "Year" },
      { value: null, text: "------------", disabled: true },
      { value: { startDate: "2022-07-08", endDate: "2022-11-01" }, text: "Season 1" },
      { value: { startDate: "2022-10-05", endDate: "2022-11-01" }, text: "Season 1.5" },
      { value: { startDate: "2022-11-01", endDate: "2022-12-01" }, text: "Season 2" },
      { value: { startDate: "2022-11-14", endDate: "2022-12-01" }, text: "Season 2.5" },
      { value: { startDate: "2022-12-01", endDate: "2023-01-01" }, text: "Season 3" },
      { value: { startDate: "2022-12-15", endDate: "2023-01-01" }, text: "Season 3.5" }
    ]
    this.selectedDate = this.dateOptions.find(opt => opt.text == "Month").value;
    this.loadGodStats();
  },

  methods: {
    loadGodStats() {
      this.loading = true;
      fetch(
        `/api/stats/godsRollup?startDate=${this.selectedDate.startDate}&endDate=${this.selectedDate.endDate}&ranks=${this.selectedRanks.join(',')}`
      )
        .then((res) => res.json())
        .then((gods) => {
          this.gods = gods;
          this.totalGames = Math.round(gods.reduce((sumGames, cur) => sumGames + Number(cur.picks), 0) / 8);
          this.loading = false;
        });
    },
    daysAgo(days) {
      const d = new Date(new Date() - days * 24 * 60 * 60 * 1000);
      // In the format 2022-01-30
      return `${d.toLocaleString('en-US', { year: 'numeric' })}-${d.toLocaleString('en-US', { month: 'numeric' })}-${d.toLocaleString('en-US', { day: 'numeric' })}`;
    },
  },
};
</script>

<style scoped>
</style>