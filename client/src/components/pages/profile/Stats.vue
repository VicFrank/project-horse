<template>
  <div>
    <h1 class="page-title" v-t="'navigation.my_stats'"></h1>
    <div v-if="loading" class="d-flex justify-content-center mb-3">
      <b-spinner label="Loading..."></b-spinner>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    error: "",
    playerStats: {},
    loading: true,
  }),

  computed: {
    steamID() {
      return this.$store.state.auth.userSteamID;
    },
  },

  created() {
    fetch(`/api/players/${this.steamID}/stats`)
      .then((res) => res.json())
      .then((playerStats) => {
        this.loading = false;
        this.playerStats = playerStats;
      });
  },
};
</script>

<style>
</style>