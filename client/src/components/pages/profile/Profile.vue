<template>
  <div>
    <h1 class="page-title">Profile</h1>

    <WelcomeQuests class="mb-5"></WelcomeQuests>

    <LoginQuests class="mb-5"></LoginQuests>

    <!-- Daily Quests -->
    <DailyQuests class="mb-5"></DailyQuests>

    <!-- Recent Games -->
    <div class="d-flex justify-content-between align-items-center">
      <h2 v-if="games.length > 0">Recent Games</h2>
      <router-link to="/profile/games" class="blue"
        ><i class="fas fa-plus mr-1"></i>View All</router-link
      >
    </div>
    <PlayerGamesList
      :games="games"
      :loading="gamesLoading"
      :placeholderRows="3"
    ></PlayerGamesList>
  </div>
</template>

<script>
import DailyQuests from "../quests/DailyQuests.vue";
import LoginQuests from "../quests/LoginQuests.vue";
import WelcomeQuests from "../quests/WelcomeQuests.vue";
import PlayerGamesList from "../player/PlayerGamesList.vue";

export default {
  components: {
    DailyQuests,
    LoginQuests,
    WelcomeQuests,
    PlayerGamesList,
  },

  data: () => ({
    error: "",
    games: [],
    playerStats: {},
    plusBenefits: {},
    gamesLoading: true,
    secondsUntilReset: 0,
  }),

  computed: {
    steamID() {
      return this.$store.state.auth.userSteamID;
    },
    hasPlus() {
      return this.$store.state.auth.hasPlus;
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

<style>
</style>