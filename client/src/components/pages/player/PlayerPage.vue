<template>
  <div>
    <div v-if="playerFound">
      <h1 class="page-title mb-1">
        {{ player.username }}
      </h1>
      <RankBadge
        class="text-center mb-2"
        :badge="player.badge"
        :pips="player.pips"
        :rank="player.rank"
      ></RankBadge>

      <div v-if="!player.username" style="height: 48px"></div>

      <PlayerStats :stats="playerStats" :loading="statsLoading"></PlayerStats>
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
        <b-tab title="Gods" lazy>
          <template v-if="godsLoading">
            <div class="d-flex justify-content-center my-3">
              <b-spinner label="Loading..."></b-spinner>
            </div>
          </template>
          <GodStats :gods="godStats" @created="loadGodStats"></GodStats>
        </b-tab>
        <!-- Only load abilities once this tab is clicked -->
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
    <div v-else>
      <h2 v-t="'profile.not_found'"></h2>
    </div>
  </div>
</template>

<script>
import PlayerGamesList from "./PlayerGamesList.vue";
import GodStats from "../stats/GodStats.vue";
import AbilityStats from "../stats/AbilityStats.vue";
import PlayerStats from "../player/components/PlayerStats.vue";
import RankBadge from "../../utility/RankBadge.vue";

export default {
  components: {
    PlayerGamesList,
    GodStats,
    AbilityStats,
    PlayerStats,
    RankBadge,
  },

  data: () => ({
    error: "",
    games: [],
    player: {},
    playerStats: {},
    plusBenefits: {},
    abilityStats: [],
    godStats: [],
    gamesLoading: true,
    statsLoading: true,
    godsLoading: true,
    abilitiesLoading: true,
    playerFound: true,
  }),

  computed: {
    steamID() {
      return this.$route.params.steam_id;
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
        this.playerStats = player;
        this.statsLoading = false;
      });

    fetch(`/api/players/${this.steamID}`)
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