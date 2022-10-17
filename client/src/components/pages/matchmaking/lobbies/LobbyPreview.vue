<template>
  <tr :class="{joinable: joinable}" @click="joinLobby">
    <td>
      <div v-if="lobby">
        <span>{{lobby.lobbysize}}/6</span>
        <span class="ml-3">{{lobby.region}}</span>
      </div>
      <div v-else class="text-muted">Empty Lobby</div>
    </td>
  </tr>
</template>

<script>
export default {
  props: {
    lobby: {
      type: Object,
      required: false
    }
  },
  computed: {
    joinable() {
      return this.lobby && this.lobby.lobbysize < 6;
    }
  },
  methods: {
    joinLobby() {
      if (!this.joinable) return;

      this.$store.dispatch("tryJoinLobby", this.lobby.lobby_id);
    }
  }
};
</script>

<style scoped>
td {
  height: 55px;
}

.joinable {
  cursor: pointer;
}

.joinable:hover {
  background-color: #324250;
}
</style>