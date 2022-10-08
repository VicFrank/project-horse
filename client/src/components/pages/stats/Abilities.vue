<template>
  <div class="text-center">
    <h1 class="page-title" v-t="'stats.abilities'"></h1>
    <AbilityStats
      :abilities="abilities"
      @created="loadAbilityStats"
    ></AbilityStats>
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

  methods: {
    loadGodStats() {
      if (this.godStats.length > 0) return;
      fetch(`/api/players/${this.steamID}/god_stats`)
        .then((res) => res.json())
        .then((godStats) => {
          this.godsLoading = false;
          this.godStats = godStats;
        });
    },

    loadAbilityStats() {
      if (this.abilityStats.length > 0) return;
      fetch(`/api/stats/abilities`)
        .then((res) => res.json())
        .then((abilities) => {
          this.abilities = abilities;
        });
    },
  },
};
</script>

<style scoped>
</style>