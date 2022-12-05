<template>
  <div style="min-height: 800px">
    <h1 class="page-title">Cosmetic Stats</h1>
    <div style="width: 700px" class="mx-auto mb-3 d-flex">
      <div>
        <div class="mb-2">Date Range</div>
        <b-form-select
          v-model="selected"
          :options="options"
          @change="fetchCosmetics()"
          :disabled="loading"
          style="width: 100px"
          class="mx-auto"
        ></b-form-select>
      </div>
      <div v-if="selected == -1" class="ml-2">
        <div class="mb-2">Start Date</div>
        <b-form-datepicker
          v-model="start"
          @input="fetchCustomRange()"
          :disabled="loading"
        ></b-form-datepicker>
      </div>
      <div v-if="selected == -1" class="ml-2">
        <div class="mb-2">End Date</div>
        <b-form-datepicker
          v-model="end"
          @input="fetchCustomRange()"
          :disabled="loading"
        ></b-form-datepicker>
      </div>
    </div>
    <CosmeticStats :cosmetics="cosmetics"></CosmeticStats>
  </div>
</template>

<script>
import CosmeticStats from "./CosmeticStats.vue";

export default {
  components: {
    CosmeticStats,
  },

  data: () => ({
    cosmetics: [],
    loading: true,
    selected: null,
    start: null,
    end: null,
    options: [
      { value: null, text: "All Time" },
      { value: 24, text: "Day" },
      { value: 720, text: "Month" },
      { value: -1, text: "Custom" },
    ],
  }),

  methods: {
    fetchCosmetics() {
      if (this.selected == -1) {
        return this.fetchCustomRange();
      }
      this.loading = true;
      fetch(
        `/api/logs/purchase_breakdown${
          this.selected ? `?hours=${this.selected}` : ""
        }`
      )
        .then((res) => res.json())
        .then((cosmetics) => {
          this.cosmetics = cosmetics;
          this.loading = false;
        });
    },
    fetchCustomRange() {
      if (!this.start && !this.end) return;

      this.loading = true;
      fetch(
        `/api/logs/purchase_breakdown?start=${
          this.start ? this.start : ""
        }&end=${this.end ? this.end : ""}`
      )
        .then((res) => res.json())
        .then((cosmetics) => {
          this.cosmetics = cosmetics;
          this.loading = false;
        });
    },
  },

  created() {
    this.fetchCosmetics();
  },
};
</script>

<style scoped>
</style>