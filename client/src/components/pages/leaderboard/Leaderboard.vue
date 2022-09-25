<template>
  <div>
    <h1 class="page-title" v-t="'leaderboard.page_title'"></h1>
    <table class="table m-auto">
      <thead>
        <tr>
          <th style="width: 80px" v-t="'leaderboard.rank'"></th>
          <th style="width: 80px">Badge</th>
          <th class="text-left" v-t="'leaderboard.player'"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="player in players" :key="player.steam_id">
          <td>{{ player.rank }}</td>
          <td>
            <RankBadge
              :height="60"
              :badge="player.badge"
              :pips="player.pips"
              :rank="player.rank"
            />
          </td>
          <td class="text-left">
            <router-link :to="'/players/' + player.steam_id">
              {{ player.username }}
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import RankBadge from "../../utility/RankBadge.vue";
export default {
  components: {
    RankBadge,
  },

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