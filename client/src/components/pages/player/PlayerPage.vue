<template>
  <div>
    <div v-if="playerFound">
      <h1 class="page-title">{{ player.username }}</h1>
      <PlayerGamesList
        :games="games"
        :loading="gamesLoading"
        :placeholderRows="20"
        class="m-auto"
        style="max-width: 710px"
      ></PlayerGamesList>
    </div>
    <div v-else>
      <h2>v-t="'profile.not_found'"</h2>
    </div>
  </div>
</template>

<script>
import PlayerGamesList from "./PlayerGamesList.vue";

export default {
  components: {
    PlayerGamesList,
  },

  data: () => ({
    error: "",
    games: [],
    player: {},
    gamesLoading: true,
    playerFound: true,
  }),

  computed: {
    steamID() {
      return this.$route.params.steam_id;
    },
  },

  created() {
    fetch(`/api/players/${this.steamID}/games?limit=20`)
      .then((res) => res.json())
      .then((games) => {
        this.gamesLoading = false;
        this.games = games;
      });

    fetch(`/api/players/${this.steamID}/stats`)
      .then((res) => res.json())
      .then((player) => {
        if (player.steam_id) this.playerFound = true;
        this.player = player;
      });
  },
};
</script>

<style>
</style>