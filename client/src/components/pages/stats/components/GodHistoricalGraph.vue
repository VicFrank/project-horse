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
    god: {
      type: Object,
      required: true,
    },
    selectedMMR: {
      type: String,
      required: true,
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
    loadDailyStats() {
      this.loaded = false;
      fetch(
        `/api/stats/godDaily?god=${this.god.god}&mmrOption=${this.selectedMMR}`
      )
        .then((res) => res.json())
        .then((stats) => {
          stats = stats.reverse();
          this.chartData.labels = stats.map((ds) => ds.day.substring(0, 10));
          this.chartData.datasets = [
            {
              label: "Win Rate",
              borderColor: "#00FF00",
              backgroundColor: "#00FF00",
              data: stats.map((ds) => ds.win_rate),
            },
            {
              label: "Top 4 Rate",
              borderColor: "#0000FF",
              backgroundColor: "#0000FF",
              data: stats.map((ds) => ds.top_four_rate),
            },
          ];
          this.loaded = true;
        });
    },
  },
  data: () => ({
    loaded: false,
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
    this.loadDailyStats();
  },
};
</script>

<template>
  <div class="stats-container">
    <LineChart
      v-if="loaded"
      :data="chartData"
      :options="chartOptions"
      :width="width"
      :height="height"
    />
  </div>
</template>

<style scoped>
.stats-container {
  display: flex;
  background: var(--primary-color);
}
</style>