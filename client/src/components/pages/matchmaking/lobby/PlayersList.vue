<template>
  <table class="table">
    <tbody>
      <tr>
        <td class="team-header">Players</td>
      </tr>
      <tr v-for="i in 8" :key="i">
        <Player :player="players[i - 1]" />
      </tr>
    </tbody>
  </table>
</template>

<script>
import Player from "./Player";
export default {
  components: {
    Player,
  },
  computed: {
    players() {
      return this.$store.getters.lobbyPlayers;
    },
  },
};
</script>

<style scoped>
table {
  max-width: 700px;
}

.team-header {
  height: 50px;
  text-transform: uppercase;
}
</style>