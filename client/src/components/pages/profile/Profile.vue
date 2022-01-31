<template>
  <div>
    <h1 class="page-title">Profile</h1>
    <DailyQuests></DailyQuests>
  </div>
</template>

<script>
import DailyQuests from "../quests/DailyQuests.vue";

export default {
  components: {
    DailyQuests,
  },

  data: () => ({
    error: "",
    games: [],
    playerStats: {},
    gamesLoading: true,
    secondsUntilReset: 0,
  }),

  computed: {
    steamID() {
      console.log(this.$store.state.auth.username);
      console.log(this.$store.state.auth.username);
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
      })
      .catch((err) => {
        console.error("Error fetching player stats", err);
      });
  },
};
</script>

<style>
</style>