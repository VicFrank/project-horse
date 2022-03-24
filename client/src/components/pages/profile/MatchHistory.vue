<template>
  <PlayerGamesList v-bind:games="games" :loading="loading"></PlayerGamesList>
</template>

<script>
import PlayerGamesList from "../player/PlayerGamesList.vue";

export default {
  components: {
    PlayerGamesList,
  },

  data: () => ({
    error: "",
    games: [],
    loading: true,
  }),

  created() {
    fetch(`/api/players/${this.$store.state.auth.userSteamID}/games`)
      .then((res) => res.json())
      .then((games) => {
        this.loading = false;
        this.games = games;
      });
  },
};
</script>

<style>
</style>