<template>
  <div>
    <h1 class="page-title" v-t="'leaderboard.page_title'"></h1>
    <table class="table m-auto">
      <thead>
        <tr>
          <th v-t="'leaderboard.rank'"></th>
          <th class="text-left" v-t="'leaderboard.player'"></th>
          <th v-t="'leaderboard.mmr'"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="player in players" :key="player.steam_id">
          <td>{{ player.rank }}</td>
          <td class="text-left">
            <router-link :to="'/players/' + player.steam_id">
              {{ player.username }}
            </router-link>
          </td>
          <td>{{ player.mmr }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data: () => ({
    error: "",
    players: [],
  }),

  mounted() {
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((players) => {
        this.players = players;
      })
      .catch(() => {
        this.error = "Error fetching leaderboard data";
      });
  },
};
</script>

<style scoped>
table {
  max-width: 710px;
}

td {
  padding: 8px 20px !important;
  font-size: 16px;
}
</style>