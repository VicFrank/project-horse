<template>
  <div>
    <h1 class="page-title" v-t="'navigation.my_stats'"></h1>
    <div v-if="loading" class="d-flex justify-content-center mb-3">
      <b-spinner label="Loading..."></b-spinner>
    </div>
    <RankBadge
      class="text-center mb-2"
      :badge="playerStats.badge"
      :pips="playerStats.pips"
      :rank="playerStats.rank"
    ></RankBadge>
    <PlayerStats :stats="playerStats" :loading="loading"></PlayerStats>
    <b-tabs
      v-if="!loading"
      content-class="mt-3"
      style="max-width: 700px; margin: auto"
    >
      <b-tab title="Gods" active>
        <GodStats :gods="godStats"></GodStats>
      </b-tab>
      <b-tab title="Abilities">
        <AbilityStats :abilities="abilityStats"></AbilityStats>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import GodStats from "../stats/GodStats.vue";
import AbilityStats from "../stats/AbilityStats.vue";
import PlayerStats from "../player/components/PlayerStats.vue";
import RankBadge from "../../utility/RankBadge.vue";

export default {
  components: {
    GodStats,
    AbilityStats,
    PlayerStats,
    RankBadge,
  },

  data: () => ({
    error: "",
    playerStats: {},
    godStats: [],
    abilityStats: [],
    loading: true,
  }),

  computed: {
    steamID() {
      return this.$store.state.auth.userSteamID;
    },
  },

  created() {
    fetch(`/api/players/${this.steamID}/stats`)
      .then((res) => res.json())
      .then((playerStats) => {
        this.loading = false;
        this.playerStats = playerStats;
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