<template>
  <div class="container">
    <div class="text-center">
      <div v-if="initialLoading">Waiting for initial websocket response</div>
      <b-button @click="refreshConnection" v-if="disconnected"
        >Refresh Connection</b-button
      >
    </div>
    <template v-if="loggedIn">
      <template v-if="!inLobby">
        <Lobbies />
      </template>
      <template v-else>
        <Lobby />
      </template>
    </template>
    <template v-else>You need to log in, dog</template>
    <Disconnected />
    <ErrorMessage />
  </div>
</template>

<script>
import Lobbies from "./Lobbies";
import Lobby from "./lobby/Lobby";
import Disconnected from "./modals/Disconnected";
import ErrorMessage from "./modals/ErrorMessage";

export default {
  components: {
    Lobbies,
    Lobby,
    Disconnected,
    ErrorMessage,
  },

  computed: {
    initialLoading() {
      return this.$store.getters.initialLoading;
    },
    inLobby() {
      return this.$store.getters.inLobby;
    },
    loggedIn() {
      return this.$store.getters.loggedIn;
    },
    disconnected() {
      return this.$store.getters.disconnected;
    },
  },

  methods: {
    refreshConnection() {
      this.$store.dispatch("refreshConnection");
    },
  },
};
</script>

<style></style>
