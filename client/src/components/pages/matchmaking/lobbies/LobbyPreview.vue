<template>
  <tr
    :class="{ joinable: joinable, 'out-of-range': outOfRange }"
    @click="joinLobby"
  >
    <td>
      <div v-if="lobby">
        <span>{{ lobby.lobbysize }}/8</span>
        <span class="ml-2">{{ lobby.region }}</span>
        <div class="text-muted">
          <span>MMR ({{ lobby.min_rank }} - {{ lobby.max_rank }})</span>
        </div>
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
      required: false,
    },
  },
  computed: {
    mmr() {
      return this.$store.getters.mmr;
    },
    joinable() {
      return (
        this.lobby &&
        this.lobby.lobbysize < 8 &&
        this.mmr >= this.lobby.min_rank &&
        this.mmr <= this.lobby.max_rank
      );
    },
    outOfRange() {
      return (
        this.lobby &&
        (this.mmr < this.lobby.min_rank || this.mmr > this.lobby.max_rank)
      );
    },
  },
  methods: {
    joinLobby() {
      if (!this.joinable) return;

      this.$store.dispatch("tryJoinLobby", this.lobby.lobby_id);
    },
  },
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

.out-of-range {
  cursor: not-allowed;
}
</style>