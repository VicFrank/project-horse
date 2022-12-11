<template>
  <div>
    <Bar
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
      :style="myStyles"
    />
  </div>
</template>

<script>
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);
export default {
  components: { Bar },
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
      myStyles: {
        height: "700px",
        position: "relative",
      },
    };
  },
  created() {
    this.$emit("created");
  },
  computed: {
    chartData() {
      return {
        labels: this.data.map((item) => item.bp_level),
        datasets: [
          {
            label: "Level",
            data: this.data.map((item) => item.count),
            backgroundColor: "#00b5ad",
          },
        ],
      };
    },
  },
};
</script>

<style>
</style>