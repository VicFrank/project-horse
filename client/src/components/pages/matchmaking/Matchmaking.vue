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
    locked() {
      return this.$store.getters.isLobbyLocked;
    },
    players() {
      return this.$store.getters.lobbyPlayers;
    },
  },

  methods: {
    refreshConnection() {
      this.$store.dispatch("refreshConnection");
    },
  },

  watch: {
    locked() {
      if (!this.inLobby) return;
      if (this.locked) {
        console.log("locked");
        const audio = new Audio(require("./sounds/ready.mp3"));
        audio.volume = 1;
        audio.play();
        document.title = "Ready!";
      }
    },
    players() {
      if (!this.inLobby) return;
      if (this.locked) {
        document.title = "Ready!";
      } else {
        document.title = `Lobby - ${this.players.length}/8`;
      }
    },
    inLobby() {
      if (!this.inLobby) {
        document.title = "Ability Arena";
      }
    },
  },
};
</script>

<style></style>
