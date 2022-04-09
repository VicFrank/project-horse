<template>
  <div>
    <h1 class="page-title">{{ $t("games.page_title") }}</h1>
    <GamesList
      :games="games"
      :loading="loading"
      :placeholderRows="100"
      class="m-auto"
    ></GamesList>
  </div>
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