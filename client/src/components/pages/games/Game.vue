<template>
  <div>
    <h1 v-if="error">{{ error }}</h1>
    <div v-else>
      <div v-if="!loading" class="text-center">
        <h3>
          {{ dateFromNow(game.created_at) }}
        </h3>
        <h4 class="text-muted">{{ hhmmss(game.duration) }}</h4>
      </div>
      <div v-if="loading" class="text-center" style="height: 70px">
        <h3>
          <b-spinner label="Loading"></b-spinner>
        </h3>
      </div>
      <table class="table game-table">
        <thead>
          <tr>
            <th>{{ $t("leaderboard.rank") }}</th>
            <th>{{ $t("leaderboard.rounds") }}</th>
            <th>{{ $t("leaderboard.wl") }}</th>
            <th v-if="showMMR">{{ $t("leaderboard.mmr") }}</th>
            <th class="text-left">{{ $t("leaderboard.player") }}</th>
            <th class="text-left">{{ $t("leaderboard.heroes") }}</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="loading">
            <tr
              v-for="i in 8"
              :key="i"
              class="animate-pulse"
              style="height: 113px"
            >
              <td />
              <td />
              <td />
              <td />
              <td />
            </tr>
          </template>
          <GamePlayerRow
            v-for="player of game.players"
            :key="player.steam_id + player.place"
            :player="player"
            :showMMR="showMMR"
          ></GamePlayerRow>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import GamePlayerRow from "./components/GamePlayerRow.vue";
import { hhmmss, dateFromNow } from "../../../filters/filters";

export default {
  components: {
    GamePlayerRow,
  },

  data: () => ({
    error: "",
    game: {},
    showMMR: false,
    loading: true,
  }),

  mounted() {
    fetch(`/api/games/${this.$route.params.game_id}`)
      .then((res) => res.json())
      .then((gameData) => {
        this.loading = false;
        if (!gameData) this.error = "Game not found";
        else {
          this.game = gameData;
          if (gameData.players[0].ladder_mmr_change != undefined)
            this.showMMR = true;
        }
      })
      .catch(() => {
        this.loading = false;
        this.error = "Error fetching game data";
      });
  },

  methods: {
    hhmmss,
    dateFromNow,
  },
};
</script>

<style scoped>
.game-table {
  max-width: 1061px;
  margin: auto;
}
</style>