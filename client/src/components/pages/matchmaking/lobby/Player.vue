<template>
  <td>
    <template v-if="player">
      <img v-if="player.avatar" :src="player.avatar" :alt="player.username" class="mr-2" />
      <i v-if="player.is_host" class="fas fa-crown mr-1"></i>
      {{ player.username }}
    </template>
    <template v-else>
      <span class="text-muted">Empty Slot</span>
    </template>
  </td>
</template>

<script>
export default {
  props: {
    player: Object
  }
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