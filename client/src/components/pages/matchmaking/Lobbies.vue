<template>
  <div class="text-center">
    <h1 class="blue">Matchmaking</h1>
    <div class="text-center" v-if="ladderMMR < 4500">
      <p class="text-muted">You must be Immortal to join these lobbies</p>
    </div>
    <HostLobby v-if="ladderMMR >= 4500" class="mb-3" />
    <LobbyList key="Lobbies" class="lobbies-list" />
  </div>
</template>

<script>
import LobbyList from "./lobbies/LobbyList";
import HostLobby from "./buttons/HostLobby";
export default {
  components: {
    LobbyList,
    HostLobby,
  },
  computed: {
    ladderMMR() {
      return this.$store.getters.ladderMMR;
    },
  },
};
</script>

<style scoped>
.lobbies-list {
  max-width: 600px;
  margin: auto;
}
</style>