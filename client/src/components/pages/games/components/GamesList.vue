<template>
  <table class="table">
    <thead>
      <tr>
        <td class="tb-head" scope="col">Duration</td>
        <td class="tb-head" scope="col">Rounds</td>
        <td class="tb-head" scope="col">Mode</td>
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
        <router-link
          v-for="game in games"
          :key="game.game_id"
          :to="'/games/' + game.game_id"
          tag="tr"
        >
          <td>
            <div>{{ hhmmss(game.duration) }}</div>
            <div class="text-muted">{{ dateFromNow(game.created_at) }}</div>
          </td>
          <td>{{ game.rounds }}</td>
          <td>{{ game.ranked ? "Ranked" : "Unranked" }}</td>
        </router-link>
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
  width: 1109px;
}

tr:hover {
  background-color: #324250;
}
</style>