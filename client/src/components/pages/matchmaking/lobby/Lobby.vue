<template>
  <div>
    <h1 class="blue text-center">
      Lobby
      <template v-if="locked">
        <i class="fas fa-lock mx-1"></i>
      </template>
    </h1>
    <p v-if="locked" class="text-muted text-center">
      Lobby is locked for another {{ hhmmss(lockTimeRemaining) }} seconds
    </p>
    <h2 v-if="lobbyPassword">
      <span class="text-muted text-center">Password:</span>
      {{ lobbyPassword }}
    </h2>
    <p v-if="lobbyPassword && isHost" class="text-muted text-center">
      As the host, it is your job to create the lobby
    </p>
    <PlayersList class="mx-auto" />
    <Chat class="text-center" />
    <div class="text-center">
      <b-button
        :disabled="locked"
        variant="secondary"
        class="my-3 ml-auto"
        @click="leaveLobby"
      >
        <i class="fas fa-times mr-1"></i>Leave
      </b-button>
    </div>
  </div>
</template>

<script>
import PlayersList from "./PlayersList";
import Chat from "./Chat";
import { hhmmss } from "../../../../filters/filters";
export default {
  components: {
    PlayersList,
    Chat,
  },
  methods: {
    leaveLobby() {
      this.$store.dispatch("attemptLeave");
    },
    hhmmss,
  },
  created() {
    window.scrollTo(0, 0);
  },
  computed: {
    locked() {
      return this.$store.getters.isLobbyLocked;
    },
    lobbyPassword() {
      return this.$store.getters.lobbyPassword;
    },
    isHost() {
      return this.$store.getters.isHost;
    },
    lockTimeRemaining() {
      return this.$store.getters.lockTimeRemaining;
    },
  },
};
</script>

<style></style>
