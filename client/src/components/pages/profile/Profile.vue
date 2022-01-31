<template>
  <div>
    <h1 class="page-title">Profile</h1>
  </div>
</template>

<script>
// import ProgressBar from "../../utility/ProgressBar";

export default {
  // components: {
  //   ProgressBar,
  // },

  data: () => ({
    error: "",
    games: [],
    playerStats: {},
    gamesLoading: true,
    secondsUntilReset: 0,
  }),

  computed: {
    steamID() {
      return this.$store.state.auth.userSteamID;
    },
  },

  created() {
    // fetch(`/api/players/${this.steamID}/games?limit=3`)
    //   .then((res) => res.json())
    //   .then((games) => {
    //     this.gamesLoading = false;
    //     this.games = games;
    //   });

    fetch(`/api/players/${this.steamID}/stats`)
      .then((res) => res.json())
      .then((player) => {
        this.player = player;
      });
  },
};
</script>

<style>
</style>