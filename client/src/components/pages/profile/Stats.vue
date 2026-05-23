<template>
  <div>
    <h1 class="page-title" v-t="'navigation.my_stats'"></h1>
    <RankBadge
      class="text-center mb-2"
      :badge="playerStats.badge"
      :pips="playerStats.pips"
      :rank="playerStats.rank"
    ></RankBadge>
    <PlayerStats
      :stats="playerStats"
      :loading="loading"
      :isUser="true"
      :godStats="godStats"
      :godStatsLoading="godsLoading"
      :seasonResults="seasonResults"
      :seasonStatsLoading="seasonsLoading"
    ></PlayerStats>
    <b-tabs style="max-width: 700px; margin: auto">
      <b-tab title="Gods" active lazy>
        <template v-if="godsLoading">
          <div class="d-flex justify-content-center my-3">
            <b-spinner label="Loading..."></b-spinner>
          </div>
        </template>
        <PlayerGodStats
          :gods="godStats"
          @created="loadGodStats"
        ></PlayerGodStats>
      </b-tab>
      <b-tab title="Seasons" lazy>
        <PlayerSeasonResults
          :results="seasonResults"
          :loading="seasonsLoading"
          @created="loadSeasonResults"
        ></PlayerSeasonResults>
      </b-tab>
      <b-tab title="Abilities" lazy>
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
import PlayerGodStats from "../stats/gods/PlayerGodStats.vue";
import AbilityStats from "../stats/abilities/AbilityStats.vue";
import PlayerStats from "../player/components/PlayerStats.vue";
import PlayerSeasonResults from "../player/components/PlayerSeasonResults.vue";
import RankBadge from "../../utility/RankBadge.vue";

export default {
  components: {
    PlayerGodStats,
    AbilityStats,
    PlayerStats,
    PlayerSeasonResults,
    RankBadge,
  },

  data: () => ({
    playerStats: {},
    godStats: [],
    abilityStats: [],
    seasonResults: [],
    loading: true,
    godsLoading: true,
    abilitiesLoading: true,
    seasonsLoading: true,
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

    loadSeasonResults() {
      if (this.seasonResults.length > 0) return;
      fetch(`/api/players/${this.steamID}/season_results`)
        .then((res) => res.json())
        .then((results) => {
          this.seasonsLoading = false;
          this.seasonResults = results;
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

    this.loadGodStats();
    this.loadSeasonResults();
  },
};
</script>

<style>
</style>
