<template>
  <div>
    <h1 class="page-title">Profile</h1>
    <DailyQuests class="mb-5"></DailyQuests>
    <h2 v-if="games.length > 0">Recent Games</h2>
    <PlayerGamesList
      :games="games"
      :loading="gamesLoading"
      :placeholderRows="3"
    ></PlayerGamesList>
  </div>
</template>

<script>
import DailyQuests from "../quests/DailyQuests.vue";
import PlayerGamesList from "../player/PlayerGamesList.vue";

export default {
  components: {
    DailyQuests,
    PlayerGamesList,
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
      return this.$store.state.auth.userSteamID;
    },
  },

  created() {
    fetch(`/api/players/${this.steamID}/games?limit=3`)
      .then((res) => res.json())
      .then((games) => {
        this.gamesLoading = false;
        this.games = games;
      });

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