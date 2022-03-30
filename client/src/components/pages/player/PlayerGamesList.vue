<template>
  <div>
    <h2 class="page-title">My Games</h2>
    <table class="table">
      <tbody>
        <template v-if="loading">
          <tr v-for="i in placeholderRows" :key="i" class="animate-pulse">
            <td />
          </tr>
        </template>
        <template v-else>
          <router-link
            v-for="game in games"
            :key="game.game_id"
            :to="'/games/' + game.game_id"
            tag="tr"
          >
            <td>{{ game.god }}</td>
            <td>{{ dateFromNow(game.created_at) }}</td>
            <td>
              {{ hhmmss(game.duration) }}
            </td>
            <td>{{ game.rounds || "?" }} Rounds</td>
            <td>{{ game.ranked ? "Ranked" : "Unranked" }}</td>
          </router-link>
        </template>
      </tbody>
    </table>
  </div>
</template>
 
<script>
import { hhmmss, dateFromNow } from "../../../filters/filters";
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