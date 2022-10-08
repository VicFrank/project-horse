<template>
  <table class="table" style="width: 600px">
    <thead>
      <tr>
        <th>{{ $t("leaderboard.match_id") }}</th>
        <th>{{ $t("leaderboard.date") }}</th>
        <th>{{ $t("leaderboard.players") }}</th>
        <th>{{ $t("leaderboard.duration") }}</th>
        <th>{{ $t("leaderboard.rounds") }}</th>
        <th>{{ $t("leaderboard.ranked") }}</th>
      </tr>
    </thead>

    <tbody>
      <template v-if="loading">
        <tr v-for="i in placeholderRows" :key="i" class="animate-pulse">
          <td />
          <td />
          <td />
        </tr>
      </template>
      <template v-else>
        <tr v-for="game in games" :key="game.game_id">
          <td>
            <router-link :to="'/games/' + game.game_id">{{
              game.game_id
            }}</router-link>
          </td>
          <td>{{ dateFromNow(game.created_at) }}</td>
          <!-- text-muted if game.players < 8 -->
          <td>
            <span v-if="game.players < 8" class="text-muted">
              {{ game.players }}/8
            </span>
            <span v-else>{{ game.players }}/8</span>
          </td>
          <td>
            {{ hhmmss(game.duration) }}
          </td>
          <td>{{ game.rounds || "?" }} Rounds</td>
          <td>{{ game.ranked ? "Ranked" : "Unranked" }}</td>
        </tr>
      </template>
    </tbody>
  </table>
</template>
 
<script>
import { hhmmss, dateFromNow } from "../../../../filters/filters";
export default {
  props: {
    games: Array,
    loading: Boolean,
    placeholderRows: {
      type: Number,
      default: 3,
    },
  },

  methods: {
    hhmmss,
    dateFromNow,
  },
};
</script>

<style scoped>
tr {
  cursor: pointer;
  height: 31px;
}

tr:hover {
  background-color: #324250;
}
</style>