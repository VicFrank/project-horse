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
    title: {
      type: String,
      required: true,
    },
    chartData: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: true
    },
    height: {
      type: Number,
      default: 400
    },
  },
  data: () => ({
    noData: false,
    chartOptions: {
      responsive: true,
      maintainAspectRatio: false,
      color: "#CECECE",

      scales: {
        y: { ticks: { color: "#CECECE", }, },
        x: { ticks: { color: "#CECECE", }, },
      },
    },
  }),
};
</script>

<template>
  <div class="mt-2">
    <h3 v-if="!loading" style="text-align: center;">{{ title }}</h3>
    <h3 v-if="!chartData.labels.length">No data found, check filters</h3>
    <div class="stats-container">
      <LineChart v-if="!loading" :data="chartData" :options="chartOptions" :height="height"/>
    </div>
  </div>
</template>

<style scoped>
.stats-container {
  display: flex;
  background: var(--primary-color);
}
</style>