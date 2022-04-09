<template>
  <table class="table">
    <thead>
      <tr>
        <th>Match Id</th>
        <th>Result</th>
        <th>God</th>
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
        <tr v-for="game in games" :key="game.game_id">
          <td>
            <router-link :to="'/games/' + game.game_id">{{
              game.game_id
            }}</router-link>
          </td>
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
          <td>{{ game.god }}</td>
          <td>
            {{ game.rounds || "?" }} Rounds
            <div class="text-muted">{{ hhmmss(game.duration) }}</div>
          </td>
          <td>{{ game.ranked ? "Ranked" : "Unranked" }}</td>
        </tr>
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
</style>