<template>
  <tr
    :class="{ joinable: joinable, 'out-of-range': outOfRange }"
    @click="joinLobby"
  >
    <td>
      <div v-if="lobby">
        <span class="ml-2">{{ lobby.region }}</span>
        <div class="text-muted">({{ lobby.lobbysize }}/8)</div>
        <div class="text-muted">
          <div
            v-if="mmrToRank(lobby.min_rank) != mmrToRank(lobby.max_rank)"
            class="d-flex align-items-center justify-content-center"
          >
            <RankBadge
              :badge="mmrToRank(lobby.min_rank)"
              :height="24"
              class="mx-1"
            />
            {{ mmrToRank(lobby.min_rank) }} -
            <RankBadge
              :badge="mmrToRank(lobby.max_rank)"
              :height="24"
              class="mx-1"
            />{{ mmrToRank(lobby.max_rank) }}
          </div>
          <div
            v-if="mmrToRank(lobby.min_rank) == mmrToRank(lobby.max_rank)"
            class="d-flex align-items-center justify-content-center"
          >
            <RankBadge
              :badge="mmrToRank(lobby.min_rank)"
              :height="24"
              class="mx-1"
            />
            {{ mmrToRank(lobby.min_rank) }}
          </div>
        </div>
      </div>
      <div v-else class="text-muted">Empty Lobby</div>
    </td>
  </tr>
</template>

<script>
const { mmrToRank } = require("../../../../filters/filters");
import RankBadge from "../../../utility/RankBadge.vue";
export default {
  components: {
    RankBadge,
  },
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
    ladderMMR() {
      return this.$store.getters.ladderMMR;
    },
    joinable() {
      return (
        this.lobby &&
        this.lobby.lobbysize < 8 &&
        this.ladderMMR <= this.lobby.max_rank &&
        this.ladderMMR >= this.lobby.min_rank
      );
    },
    outOfRange() {
      return (
        this.lobby &&
        this.ladderMMR >= this.lobby.max_rank &&
        this.ladderMMR <= this.lobby.min_rank
      );
    },
  },
  methods: {
    mmrToRank,
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