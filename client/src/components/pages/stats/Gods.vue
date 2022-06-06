<template>
  <div>
    <h1 class="page-title">{{ $t("gods.page_title") }}</h1>
    <GodStats :gods="gods"></GodStats>
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
  }),

  created() {
    fetch(`/api/stats/gods`)
      .then((res) => res.json())
      .then((gods) => {
        this.gods = gods;
      });
  },
};
</script>

<style scoped>
</style>