<template>
  <td>
    <template v-if="player">
      <div class="d-flex justify-content-center align-items-center">
        <img
          v-if="player.avatar"
          :src="player.avatar"
          :alt="player.username"
          class="mr-2"
        />
        <i v-if="player.is_host" class="fas fa-crown mr-1"></i>
        {{ player.username }}
        <RankBadge
          class="ml-2"
          :height="32"
          :badge="player.badge"
          :pips="player.pips"
          :rank="player.rank"
        />
      </div>
    </template>
    <template v-else>
      <span class="text-muted">Empty Slot</span>
    </template>
  </td>
</template>

<script>
import RankBadge from "../../../utility/RankBadge.vue";
export default {
  components: {
    RankBadge,
  },
  props: {
    player: Object,
  },
};
</script>

<style scoped>
td {
  height: 50px;
}

img {
  height: 40px;
  width: auto;
}
</style>