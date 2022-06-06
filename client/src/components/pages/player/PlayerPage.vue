<template>
  <div>
    <div v-if="playerFound">
      <h1 class="page-title">{{ player.username }}</h1>

      <b-tabs style="max-width: 700px; margin: auto">
        <b-tab title="Games" active>
          <PlayerGamesList
            :games="games"
            :loading="gamesLoading"
            :placeholderRows="20"
            class="m-auto"
            style="max-width: 710px"
          ></PlayerGamesList>
        </b-tab>
        <b-tab title="Gods">
          <GodStats :gods="godStats"></GodStats>
        </b-tab>
        <b-tab title="Abilities">
          <AbilityStats :abilities="abilityStats"></AbilityStats>
        </b-tab>
      </b-tabs>
    </div>
    <div v-else>
      <h2>v-t="'profile.not_found'"</h2>
    </div>
  </div>
</template>

<script>
import PlayerGamesList from "./PlayerGamesList.vue";
import GodStats from "../stats/GodStats.vue";
import AbilityStats from "../stats/AbilityStats.vue";

export default {
  components: {
    PlayerGamesList,
    GodStats,
    AbilityStats,
  },

  data: () => ({
    error: "",
    games: [],
    player: {},
    abilityStats: [],
    godStats: [],
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

    fetch(`/api/players/${this.steamID}/ability_stats`)
      .then((res) => res.json())
      .then((abilityStats) => {
        this.loading = false;
        this.abilityStats = abilityStats;
      });

    fetch(`/api/players/${this.steamID}/god_stats`)
      .then((res) => res.json())
      .then((godStats) => {
        this.loading = false;
        this.godStats = godStats;
      });
  },
};
</script>

<style>
</style>