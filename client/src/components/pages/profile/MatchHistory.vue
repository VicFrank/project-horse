<template>
  <div>
    <h1 class="page-title">{{ $t("profile.my_games") }}</h1>
    <PlayerGamesList
      v-bind:games="games"
      :loading="loading"
      class="m-auto"
      style="max-width: 710px"
    ></PlayerGamesList>
  </div>
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