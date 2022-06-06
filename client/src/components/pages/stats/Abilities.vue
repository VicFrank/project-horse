<template>
  <div class="text-center">
    <h1 class="page-title" v-t="'stats.abilities'"></h1>
    <AbilityStats :abilities="abilities"></AbilityStats>
  </div>
</template>

<script>
import AbilityStats from "./AbilityStats.vue";
export default {
  components: {
    AbilityStats,
  },

  data: () => ({
    abilities: [],
  }),

  created() {
    fetch(`/api/stats/abilities`)
      .then((res) => res.json())
      .then((abilities) => {
        this.abilities = abilities;
      });
  },
};
</script>

<style scoped>
</style>