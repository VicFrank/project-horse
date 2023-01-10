<template>
  <div>
    <h1 class="page-title">Games</h1>
    <b-row class="mx-auto d-flex mb-2" style="max-width: 700px">
      <b-col>
        <div class="mb-2">Date</div>
        <b-form-select
          v-model="selectedDate"
          :options="dateOptions"
          @change="loadGameStats()"
          :disabled="loading"
          style="width: 200px"
          class="mx-auto mb-2"
        ></b-form-select>
        <div v-if="isCustomDateSelected()" class="b-flex pl-2" style="max-width: 200px;">
          <label for="customStartDate" class="my-auto mr-2">Start Date</label>
          <b-input-group class="mb-3">
            <b-form-input readonly v-model="customDateStart" />
            <b-input-group-append>
              <b-form-datepicker 
                id="customStartDate" 
                button-only 
                right 
                v-model="customDateStart" 
                size="sm" 
                locale="en"
                @context="loadGameStats()" />
            </b-input-group-append>
          </b-input-group>
          <label for="customEndDate" class="my-auto mr-2">End Date</label>
          <b-input-group class="mb-3">
            <b-form-input readonly v-model="customDateEnd" />
            <b-input-group-append>
              <b-form-datepicker 
                id="customEndDate" 
                button-only 
                right 
                v-model="customDateEnd" 
                size="sm" 
                locale="en"
                @context="loadGameStats()" />
            </b-input-group-append>
          </b-input-group>
        </div>
      </b-col>
      </b-row>
      <div style="display:flex; flex-wrap:wrap; justify-content: center;">
      <b-card 
        bg-variant="dark" 
        class="m-4 p-2"
        v-if="!loading"
        :title="numGames" 
        sub-title="Games Played">
      </b-card>
      <b-card 
        bg-variant="dark" 
        class="m-4 p-2"
        v-if="!loading"
        :title="averageDuration" 
        sub-title="Average Game Duration">
      </b-card>
      <b-card 
        bg-variant="dark" 
        class="m-4 p-2"
        v-if="!loading"
        :title="averageRounds" 
        sub-title="Average Number of Rounds">
      </b-card>
    </div>
    <GameLineGraph :chart-data="gamesPlayedData" :loading="loadingCharts" :title="gamesPlayedTitle" />
    <GameLineGraph :chart-data="roundsData" :loading="loadingCharts" :title="roundsTitle" />
    <GameLineGraph :chart-data="durationData" :loading="loadingCharts" :title="durationTitle" />
  </div>
</template>

<script>
import GameLineGraph from './GameLineGraph.vue';

export default {
  components: {
    GameLineGraph,
  },

  data: () => ({
    loading: true,
    numGames: "loading",
    averageDuration: "loading",
    averageRounds: "loading",


    selectedDate: null,
    dateOptions: [],
    customDateStart: '2022-12-25',
    customDateEnd: '2022-12-25',

    loadingCharts: true,

    gamesPlayedData: {labels: [], datasets: []},
    gamesPlayedTitle: "Loading...",
    roundsData: {labels: [], datasets: []},
    roundsTitle: "Loading...",
    durationData: {labels: [], datasets: []},
    durationTitle: "Loading...",
  }),

  created() {
    const dailyGraph = {title: "Daily ", endpoint: "/games/daily"};
    const weeklyGraph = {title: "Weekly ", endpoint: "/games/weekly"};
    const monthlyGraph = {title: "Monthly ", endpoint: "/games/monthly"};
    const perPatchGraph = {title: "Per Patch ", endpoint: "/games/perPatch"};

    this.dateOptions = [
      { text: "All Time", value: { startDate: '2022-09-01', endDate: this.daysAgo(0), graph: perPatchGraph } },
      { value: null, text: "------------", disabled: true },
      { text: "Week", value: { startDate: this.daysAgo(7), endDate: this.daysAgo(0), graph: dailyGraph } },
      { text: "Month", value: { startDate: this.daysAgo(30), endDate: this.daysAgo(0), graph: weeklyGraph } },
      { text: "Year", value: { startDate: this.daysAgo(365), endDate: this.daysAgo(0), graph: monthlyGraph } },
      { value: null, text: "------------", disabled: true },
      { text: "Season 1", value: { startDate: "2022-07-08", endDate: "2022-11-01", graph: perPatchGraph } },
      { text: "Season 1.5", value: { startDate: "2022-10-05", endDate: "2022-11-01", graph: perPatchGraph } },
      { text: "Season 2", value: { startDate: "2022-11-01", endDate: "2022-12-01", graph: perPatchGraph } },
      { text: "Season 2.5", value: { startDate: "2022-11-14", endDate: "2022-12-01", graph: perPatchGraph } },
      { text: "Season 3", value: { startDate: "2022-12-01", endDate: "2023-01-01", graph: perPatchGraph } },
      { text: "Season 3.5", value: { startDate: "2022-12-15", endDate: "2023-01-01", graph: perPatchGraph } },
      { text: "Season 4", value: { startDate: "2023-01-01", endDate: "2023-03-01", graph: perPatchGraph } },
      { value: null, text: "------------", disabled: true },
      { value: "custom", text: "Custom Range"},
    ]
    this.selectedDate = this.dateOptions.find(opt => opt.text == "Month").value;

    this.loadGameStats();
  },

  methods: {
    loadGameStats() {
      let startDate = this.selectedDate.startDate;
      let endDate = this.selectedDate.endDate;
      if (this.isCustomDateSelected()) {
        startDate = this.customDateStart;
        endDate = this.customDateEnd;
      }
      this.loading = true;
      this.loadingCharts = true;

      fetch(
        `/api/stats/games?startDate=${startDate}&endDate=${endDate}`
      )
        .then((res) => res.json())
        .then((gameRows) => {
          this.numGames = Number(gameRows.games_count).toLocaleString();
          const durationMinutes = Math.floor(gameRows.avg_duration / 60);
          const durationSeconds = (gameRows.avg_duration - durationMinutes * 60);
          this.averageDuration = `${durationMinutes}m ${durationSeconds.toFixed(0)}sec`
          this.averageRounds = gameRows.avg_rounds.toFixed(2);

          this.loading = false;
        });

      if (!this.isCustomDateSelected()) {
        fetch(`/api/stats${this.selectedDate.graph.endpoint}`)
          .then((r) => r.json())
          .then(historicalData => {
            // Data from the queries is [neweset,...,oldest], but we want the charts to be oldest on the left
            historicalData.reverse();
            const baseTitle = this.selectedDate.graph.title;
            const labels = historicalData.map(datum => datum.label);

            this.gamesPlayedData.labels = labels;
            this.gamesPlayedTitle = baseTitle + "Games Played";
            this.gamesPlayedData.datasets = [
              {
                label: "Games Played" ,
                borderColor: "#A9CF54",
                backgroundColor: "#A9CF54",
                data: historicalData.map(datum => datum.games_count)
              },
            ]

            this.roundsTitle = baseTitle + "Average Number of Rounds";
            this.roundsData.labels = labels;
            this.roundsData.datasets = [
              {
                label: "Average Rounds" ,
                borderColor: "#A9CF54",
                backgroundColor: "#A9CF54",
                data: historicalData.map(datum => datum.avg_rounds)
              },
            ]

            this.durationTitle = baseTitle + "Average Game Duration";
            this.durationData.labels = labels;
            this.durationData.datasets = [
              {
                label: "Average Duration (minutes)" ,
                borderColor: "#A9CF54",
                backgroundColor: "#A9CF54",
                data: historicalData.map(datum => datum.avg_duration/60)
              },
            ]

            this.loadingCharts = false;
          })
        }
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