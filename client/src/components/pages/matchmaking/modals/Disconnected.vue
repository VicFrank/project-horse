<template>
  <b-modal id="websocket-disconnected" ok-only>
    <p class="text-danger">You have been disconnected.</p>
    <p v-if="disconnected">Attempting to restore connection...</p>
  </b-modal>
</template>

<script>
export default {
  computed: {
    disconnected() {
      return this.$store.getters.disconnected;
    }
  },
  watch: {
    disconnected(val) {
      // Trigger this popup when the websocket is disconnected
      const id = "websocket-disconnected";
      if (val) {
        this.$bvModal.show(id);
      } else {
        this.$bvModal.hide(id);
      }
    }
  }
};
</script>

<style>
</style>