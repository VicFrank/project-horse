<template>
  <GamesList
    :games="games"
    :loading="loading"
    :placeholderRows="100"
  ></GamesList>
</template>

<script>
import GamesList from "./components/GamesList.vue";

export default {
  components: {
    GamesList,
  },

  data: () => ({
    loading: true,
    games: [],
  }),

  created() {
    fetch(`/api/games`)
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