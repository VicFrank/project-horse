<template>
  <div>
    <h1 class="blue text-center">
      Lobby
      <template v-if="locked">
        <i class="fas fa-lock mx-1"></i>
      </template>
    </h1>
    <div class="d-flex align-items-center justify-content-center">
      <RankBadge :badge="mmrToRank(minRank)" :height="30" class="mx-1" />
      {{ mmrToRank(minRank) }} -
      <RankBadge :badge="mmrToRank(maxRank)" :height="30" class="mx-1" />{{
        mmrToRank(maxRank)
      }}
    </div>
    <div v-if="locked" class="text-muted text-center">
      This lobby will be locked for 5 minutes while players join the Dota lobby.
    </div>
    <div v-if="locked" class="text-muted text-center mb-2">
      If a game starts with these 8 players within the next 10 minutes, it will
      be counted as a matchmade game.
    </div>
    <p v-if="lobbyPassword && isHost" class="text-muted text-center">
      As the host, it is your job to create the lobby with this password
    </p>
    <p v-if="lobbyPassword && !isHost" class="text-muted text-center">
      Wait for the host to create the lobby, then join it with this password
    </p>
    <h2 v-if="lobbyPassword" class="text-center">
      <span class="text-muted text-center">Password:</span>
      {{ lobbyPassword }}
    </h2>
    <PlayersList class="mx-auto" />
    <Chat class="text-center" />
    <div class="text-center">
      <b-button
        v-if="!locked"
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
import RankBadge from "../../../utility/RankBadge.vue";
import PlayersList from "./PlayersList";
import Chat from "./Chat";
import { hhmmss, mmrToRank } from "../../../../filters/filters";
export default {
  components: {
    PlayersList,
    Chat,
    RankBadge,
  },
  methods: {
    leaveLobby() {
      if (this.locked) return;
      this.$store.dispatch("attemptLeave");
    },
    hhmmss,
    mmrToRank,
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
    minRank() {
      return this.$store.getters.lobbyMinRank;
    },
    maxRank() {
      return this.$store.getters.lobbyMaxRank;
    },
    isHost() {
      return this.$store.getters.isHost;
    },
  },
};
</script>

<style></style>
