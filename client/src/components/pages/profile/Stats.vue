<template>
  <div>
    <h1 class="page-title" v-t="'navigation.my_stats'"></h1>
    <div v-if="loading" class="d-flex justify-content-center mb-3">
      <b-spinner label="Loading..."></b-spinner>
    </div>
    <RankBadge
      v-if="!loading"
      class="text-center mb-2"
      :badge="playerStats.badge"
      :pips="playerStats.pips"
      :rank="playerStats.rank"
    ></RankBadge>
    <PlayerStats
      :stats="playerStats"
      :loading="loading"
      :isUser="true"
    ></PlayerStats>
    <b-tabs
      v-if="!loading"
      content-class="mt-3"
      style="max-width: 700px; margin: auto"
      lazy
    >
      <b-tab title="Gods" active>
        <template v-if="godsLoading">
          <div class="d-flex justify-content-center my-3">
            <b-spinner label="Loading..."></b-spinner>
          </div>
        </template>
        <GodStats :gods="godStats" @created="loadGodStats"></GodStats>
      </b-tab>
      <b-tab title="Abilities">
        <template v-if="abilitiesLoading">
          <div class="d-flex justify-content-center my-3">
            <b-spinner label="Loading..."></b-spinner>
          </div>
        </template>
        <AbilityStats
          :abilities="abilityStats"
          @created="loadAbilityStats"
        ></AbilityStats>
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

  methods: {
    loadGodStats() {
      if (this.godStats.length > 0) return;
      fetch(`/api/players/${this.steamID}/god_stats`)
        .then((res) => res.json())
        .then((godStats) => {
          this.godsLoading = false;
          this.godStats = godStats;
        });
    },

    loadAbilityStats() {
      if (this.abilityStats.length > 0) return;
      fetch(`/api/players/${this.steamID}/ability_stats`)
        .then((res) => res.json())
        .then((abilityStats) => {
          this.abilitiesLoading = false;
          this.abilityStats = abilityStats;
        });
    },
  },

  created() {
    fetch(`/api/players/${this.steamID}/stats`)
      .then((res) => res.json())
      .then((playerStats) => {
        this.loading = false;
        this.playerStats = playerStats;
      });
  },
};
</script>

<style>
</style>