<template>
  <div>
    <h1 class="page-title">Cosmetic Stats</h1>
    <div style="width: 700px" class="mx-auto mb-3">
      <b-form-select
        v-model="selected"
        :options="options"
        @change="fetchCosmetics()"
        v-disabled="loading"
        style="width: 100px"
        class="mx-auto"
      ></b-form-select>
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
    options: [
      { value: null, text: "All Time" },
      { value: 24, text: "Day" },
      { value: 720, text: "Month" },
    ],
  }),

  methods: {
    fetchCosmetics() {
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
  },

  created() {
    this.fetchCosmetics();
  },
};
</script>

<style scoped>
</style>