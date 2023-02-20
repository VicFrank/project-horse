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
            ticks: {
              callback: function (value) {
                return "$" + value.toLocaleString();
              },
            },
          },
        },
      },
      myStyles: {
        height: "700px",
        position: "relative",
      },
    };
  },
  computed: {
    chartData() {
      return {
        labels: this.data.map((d) => d.date.toLocaleDateString()),
        datasets: [
          {
            label: "Earnings",
            data: this.data.map((d) => d.total),
            backgroundColor: "#6248a5",
          },
        ],
      };
    },
  },
};
</script>

<style>
</style>