<template>
  <b-modal id="websocket-error" ok-only>
    <p class="text-danger">{{websocketError}}</p>
  </b-modal>
</template>

<script>
export default {
  computed: {
    websocketError() {
      return this.$store.getters.websocketError;
    },
    newError() {
      return this.$store.getters.newError;
    }
  },
  watch: {
    newError(val) {
      const id = "websocket-error";
      if (val) {
        this.$bvModal.show(id);
        this.$store.dispatch("errorRecieved");
      }
    }
  }
};
</script>

<style>
</style>