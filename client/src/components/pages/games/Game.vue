<template>
  <h1 v-if="error">{{ error }}</h1>
</template>

<script>
export default {
  data: () => ({
    error: "",
    game: {},
  }),

  mounted() {
    fetch(`/api/games/${this.$route.params.game_id}`)
      .then((res) => res.json())
      .then((gameData) => {
        if (!gameData) {
          this.error = "Game not found";
          return;
        }
        this.game = gameData;
      })
      .catch((err) => {
        this.error = "Error fetching game data";
      });
  },
};
</script>

<style>
</style>