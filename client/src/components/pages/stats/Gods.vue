<template>
  <div>
    <h1 class="page-title">{{ $t("gods.page_title") }}</h1>
    <h5 v-if="!loading" style="text-align: center;">Viewing stats for {{ totalGames.toLocaleString() }} games</h5>
    <b-row class="mx-auto d-flex mb-2" style="max-width: 700px">
      <b-col>
        <div class="mb-2">Date</div>
        <b-form-select v-model="selectedDate" :options="dateOptions" @change="loadGodStats()" :disabled="loading"
          style="width: 200px" class="mx-auto mb-2"></b-form-select>
        <div v-if="isCustomDateSelected()" class="b-flex pl-2" style="max-width: 200px;">
          <label for="customStartDate" class="my-auto mr-2">Start Date</label>
          <b-input-group class="mb-3">
            <b-form-input readonly v-model="customDateStart" />
            <b-input-group-append>
              <b-form-datepicker id="customStartDate" button-only right v-model="customDateStart" size="sm" locale="en"
                @context="loadGodStats()" />
            </b-input-group-append>
          </b-input-group>
          <label for="customEndDate" class="my-auto mr-2">End Date</label>
          <b-input-group class="mb-3">
            <b-form-input readonly v-model="customDateEnd" />
            <b-input-group-append>
              <b-form-datepicker id="customEndDate" button-only right v-model="customDateEnd" size="sm" locale="en"
                @context="loadGodStats()" />
            </b-input-group-append>
          </b-input-group>
        </div>
      </b-col>
      <b-col class="ml-2">
        <div class="mb-2">MMR</div>
        <b-form-select v-model="selectedMMR" :options="mmrOptions" @change="loadGodStats()" :disabled="loading"
          style="width: 200px" class="mx-auto"></b-form-select>
      </b-col>
      <b-col>
        <div class="mb-2">Unlock Method</div>
        <b-form-select v-model="selectedUnlock" :options="godUnlockOptions" @change="filterGods()" :disabled="loading"
          style="width: 200px" class="mx-auto"></b-form-select>
      </b-col>
    </b-row>
    <GodStats :gods="filteredGods" :linkAbilities="true" :loading="loading" :selectedMMR="selectedMMR"></GodStats>
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
    filteredGods: [],
    loading: true,
    totalGames: 0,

    selectedDate: null,
    dateOptions: [],
    customDateStart: '2022-12-25',
    customDateEnd: '2022-12-25',

    selectedMMR: 'all_mmr',
    mmrOptions: [
      { value: 'all_mmr', text: 'All MMR' },
      { value: '1000_plus', text: '1000+' },
      { value: '1100_plus', text: '1100+' },
      { value: '1200_plus', text: '1200+' },
      { value: '1300_plus', text: '1300+' },
      { value: '1400_plus', text: '1400+' },
      { value: '1500_plus', text: '1500+' },
    ],

    selectedUnlock: "All",
    godUnlockOptions: [],
    godData: [],
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
      { value: { startDate: "2022-12-15", endDate: "2023-01-01" }, text: "Season 3.5" },
      { value: { startDate: "2023-01-01", endDate: "2023-03-01" }, text: "Season 4" },
      { value: null, text: "------------", disabled: true },
      { value: "custom", text: "Custom Range" },
    ]
    this.selectedDate = this.dateOptions.find(opt => opt.text == "Month").value;
    fetch(`/data/gods.json`).then((res) => res.json()).then(d => {
      this.godData = d
      this.godUnlockOptions = ["All", ...new Set(d.map(gd => gd.unlock?.charAt(0)?.toUpperCase() + gd.unlock?.slice(1).toLocaleLowerCase()))]
    });
    this.loadGodStats();
  },

  methods: {
    loadGodStats() {
      let startDate = this.selectedDate.startDate;
      let endDate = this.selectedDate.endDate;
      if (this.isCustomDateSelected()) {
        startDate = this.customDateStart;
        endDate = this.customDateEnd;
      }
      this.loading = true;
      fetch(
        `/api/stats/godsRollup?startDate=${startDate}&endDate=${endDate}&mmrOption=${this.selectedMMR}`
      )
        .then((res) => res.json())
        .then((gods) => {
          this.gods = gods;
          this.filteredGods = gods;
          this.totalGames = Math.round(this.filteredGods.reduce((sumGames, cur) => sumGames + Number(cur.picks), 0) / 8);
          this.loading = false;
        });
    },
    filterGods() {
      this.loading = true;
      if (this.selectedUnlock == "All") {
        this.filteredGods = this.gods;
      } else {
        this.filteredGods = this.gods.filter(g => this.godData.find(gd => gd.id == g.god_name).unlock.toLocaleLowerCase() == this.selectedUnlock.toLocaleLowerCase());
      }
      this.totalGames = Math.round(this.filteredGods.reduce((sumGames, cur) => sumGames + Number(cur.picks), 0) / 8);
      this.loading = false;
    },
    daysAgo(days) {
      const d = new Date(new Date() - days * 24 * 60 * 60 * 1000);
      // In the format 2022-01-30
      return `${d.toLocaleString('en-US', { year: 'numeric' })}-${d.toLocaleString('en-US', { month: 'numeric' })}-${d.toLocaleString('en-US', { day: 'numeric' })}`;
    },
    isCustomDateSelected() {
      return this.selectedDate === "custom";
    },
  },
};
</script>

<style scoped>

</style>