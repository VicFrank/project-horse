<script>
import { Line as LineChart } from "vue-chartjs";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement
);

export default {
  components: {
    LineChart,
  },
  props: {
    godName: {
      type: String,
      required: true,
    },
    selectedMMR: {
      type: String,
      required: true,
    },
    selectedTimeOption: {
      type: String,
      default: "daily"
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
  },
  methods: {
    loadStats() {
      this.loaded = false;
      this.noData = false;

      let endpoint;
      if (this.selectedTimeOption === "daily")
        endpoint = 'godDaily'
      else if (this.selectedTimeOption === "weekly")
        endpoint = 'godWeekly'
      else if (this.selectedTimeOption === "monthly")
        endpoint = 'godMonthly'
      else if (this.selectedTimeOption === "per_patch")
        endpoint = 'godPerPatch'
      else {
        // Invalid selection
        this.loaded = true;
        this.noData = true;
        return;
      }

      fetch(
        `/api/stats/${endpoint}?god=${this.godName}&mmrOption=${this.selectedMMR}`
      )
        .then((res) => res.json())
        .then((stats) => {
          stats = stats.reverse();
          this.chartData.labels = stats.map((ds) => ds.label);
          this.chartData.datasets = [
            {
              label: "Win Rate",
              borderColor: "#a9cf54",
              backgroundColor: "#a9cf54",
              data: stats.map((ds) => ds.win_rate),
            },
            {
              label: "Top 4 Rate",
              borderColor: "#fbb829",
              backgroundColor: "#fbb829",
              data: stats.map((ds) => ds.top_four_rate),
            },
          ];
          if (this.chartData.labels.length == 0)
            this.noData = true;
          this.loaded = true;
        }).catch(() => {
          this.noData = true;
        });
    },
  },
  data: () => ({
    loaded: false,
    noData: false,
    chartData: {
      labels: [],
      datasets: [],
    },
    chartOptions: {
      responsive: true,
      maintainAspectRatio: false,
      color: "#cecece",

      scales: {
        y: {
          ticks: {
            color: "#cecece",
            format: {
              style: "percent",
            },
          },
        },
        x: {
          ticks: {
            color: "#cecece",
          },
        },
      },
    },
  }),
  created() {
    this.loadStats();
  },
  watch: {
    selectedMMR: function () { this.loadStats() },
    selectedTimeOption: function () { this.loadStats() },
  },
};
</script>

<template>
  <div>
    <h3 v-if="noData">No data found, check filters</h3>
    <div class="stats-container">
      <LineChart v-if="loaded" :data="chartData" :options="chartOptions" :width="width" :height="height" />
    </div>
  </div>
</template>

<style scoped>
.stats-container {
  display: flex;
  background: var(--primary-color);
}
</style>