<template>
  <table class="table">
    <thead>
      <tr>
        <th>God</th>
        <th>Result</th>
        <th>Rounds</th>
        <th>Ranked</th>
      </tr>
    </thead>

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
          <td>
            {{ getRankString(game.place) }}
            <template v-if="game.mmr_change != undefined">
              <span v-if="game.mmr_change >= 0" class="win">
                +{{ game.mmr_change }}
              </span>
              <span v-else class="loss"> {{ game.mmr_change }} </span>
            </template>
            <div class="text-muted">{{ dateFromNow(game.created_at) }}</div>
          </td>
          <td>
            {{ game.rounds || "?" }} Rounds
            <div class="text-muted">{{ hhmmss(game.duration) }}</div>
          </td>
          <td>{{ game.ranked ? "Ranked" : "Unranked" }}</td>
        </router-link>
      </template>
    </tbody>
  </table>
</template>
 
<script>
import { hhmmss, dateFromNow, getRankString } from "../../../filters/filters";
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
    getRankString,
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