<template>
  <div>
    <h1 class="page-title">Profile</h1>

    <WelcomeQuests v-if="isAdmin" class="mb-5"></WelcomeQuests>

    <LoginQuests v-if="isAdmin" class="mb-5"></LoginQuests>

    <!-- Daily Quests -->
    <DailyQuests class="mb-5"></DailyQuests>

    <!-- Recent Games -->
    <div class="d-flex justify-content-between align-items-center">
      <h2 v-if="games.length > 0">{{ $t("profile.recent_games") }}</h2>
      <router-link to="/profile/games" class="color-primary"
        ><i class="fas fa-plus mr-1"></i
        >{{ $t("profile.view_all") }}</router-link
      >
    </div>
    <PlayerGamesList
      :games="games"
      :loading="gamesLoading"
      :placeholderRows="3"
    ></PlayerGamesList>

    <b-tabs class="mt-5" style="max-width: 700px; margin: auto">
      <b-tab title="Gods" lazy>
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
    </b-tabs>
  </div>
</template>

<script>
import DailyQuests from "../quests/DailyQuests.vue";
import LoginQuests from "../quests/LoginQuests.vue";
import WelcomeQuests from "../quests/WelcomeQuests.vue";
import PlayerGamesList from "../player/PlayerGamesList.vue";
import PlayerGodStats from "../stats/gods/PlayerGodStats.vue";
import PlayerSeasonResults from "../player/components/PlayerSeasonResults.vue";

export default {
  components: {
    DailyQuests,
    LoginQuests,
    WelcomeQuests,
    PlayerGamesList,
    PlayerGodStats,
    PlayerSeasonResults,
  },

  data: () => ({
    error: "",
    games: [],
    godStats: [],
    seasonResults: [],
    playerStats: {},
    plusBenefits: {},
    gamesLoading: true,
    godsLoading: true,
    seasonsLoading: true,
    secondsUntilReset: 0,
  }),

  computed: {
    steamID() {
      return this.$store.state.auth.userSteamID;
    },
    hasPlus() {
      return this.$store.state.auth.hasPlus;
    },
    isAdmin() {
      return this.$store.getters.isAdmin;
    },
  },

  methods: {
    getPlusBenefits() {
      fetch(`/api/players/${this.steamID}/plus_benefits`)
        .then((res) => res.json())
        .then((plusBenefits) => {
          this.plusBenefits = plusBenefits;
        });
    },

    loadGodStats() {
      if (this.godStats.length > 0) return;
      fetch(`/api/players/${this.steamID}/god_stats`)
        .then((res) => res.json())
        .then((godStats) => {
          this.godsLoading = false;
          this.godStats = godStats;
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
    // claimDailyGold() {
    //   fetch(`/api/players/${this.steamID}/claim_daily_gold`, { method: "post" })
    //     .then((res) => res.json())
    //     .then(() => {
    //       this.plusBenefits.canClaimGold = false;
    //       this.getPlusBenefits();
    //       this.$store.dispatch("REFRESH_PLAYER");
    //     })
    //     .catch((err) => {
    //       console.error("Error fetching player stats", err);
    //     });
    // },
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

    if (this.hasPlus) {
      this.getPlusBenefits();
    }
  },
};
</script>

<style></style>
