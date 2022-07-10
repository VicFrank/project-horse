<template>
  <div>
    <h1 v-if="error">{{ error }}</h1>
    <div v-else>
      <div class="text-center">
        <h3>
          {{ dateFromNow(game.created_at) }}
        </h3>
        <h4 class="text-muted">{{ hhmmss(game.duration) }}</h4>
      </div>
      <table class="table game-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Rounds</th>
            <th>W/L</th>
            <th v-if="showMMR">MMR</th>
            <th class="text-left">Player</th>
            <th class="text-left">Heroes</th>
          </tr>
        </thead>
        <tbody>
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
  }),

  mounted() {
    fetch(`/api/games/${this.$route.params.game_id}`)
      .then((res) => res.json())
      .then((gameData) => {
        if (!gameData) this.error = "Game not found";
        else {
          this.game = gameData;
          if (gameData.players[0].ladder_mmr_change != undefined)
            this.showMMR = true;
        }
      })
      .catch(() => {
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