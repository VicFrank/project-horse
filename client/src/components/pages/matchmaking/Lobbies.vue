<template>
  <div class="text-center">
    <h1 class="blue">Matchmaking</h1>
    <HostLobby class="mb-3" />
    <LobbyList class="lobbies-list" />
  </div>
</template>

<script>
import LobbyList from "./lobbies/LobbyList";
import HostLobby from "./buttons/HostLobby";
export default {
  components: {
    LobbyList,
    HostLobby
  }
};
</script>

<style scoped>
.lobbies-list {
  max-width: 600px;
  margin: auto;
}
</style>