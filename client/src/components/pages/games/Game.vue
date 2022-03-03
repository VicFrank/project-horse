<template>
  <div>
    <h1 v-if="error">{{ error }}</h1>
    <div v-else>
      <table class="table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Heroes</th>
            <th>Rounds</th>
            <th>W/L</th>
          </tr>
        </thead>
        <tbody>
          <GamePlayerRow
            v-for="player of game.players"
            :key="player.steam_id + player.place"
            :player="player"
          ></GamePlayerRow>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import GamePlayerRow from "./components/GamePlayerRow.vue";
export default {
  components: {
    GamePlayerRow,
  },

  data: () => ({
    error: "",
    game: {},
  }),

  mounted() {
    fetch(`/api/games/${this.$route.params.game_id}`)
      .then((res) => res.json())
      .then((gameData) => {
        if (!gameData) this.error = "Game not found";
        else this.game = gameData;
      })
      .catch(() => {
        this.error = "Error fetching game data";
      });
  },
};
</script>

<style>
</style>