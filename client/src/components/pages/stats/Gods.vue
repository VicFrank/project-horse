<template>
  <div>
    <h1 class="page-title">{{ $t("gods.page_title") }}</h1>
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
        <div class="mb-2">MMR</div>
        <b-form-select
          v-model="selectedMMR"
          :options="mmrOptions"
          @change="loadGodStats()"
          :disabled="loading"
          style="width: 100px"
          class="mx-auto"
        ></b-form-select>
      </div>
    </div>
    <GodStats :gods="gods" :linkAbilities="true"></GodStats>
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
    selectedDate: 24,
    selectedMMR: null,
    loading: true,
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

  created() {
    this.loadGodStats();
  },

  methods: {
    loadGodStats() {
      this.loading = true;
      fetch(
        `/api/stats/gods?hours=${this.selectedDate}&minMMR=${this.selectedMMR}`
      )
        .then((res) => res.json())
        .then((gods) => {
          this.gods = gods;
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped>
</style>