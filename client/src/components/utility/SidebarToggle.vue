<template>
  <b-icon-justify
    icon="justify"
    aria-hidden="true"
    font-scale="2"
    class="icon-button"
    @click="handleClick"
  ></b-icon-justify>
</template>

<script>
import { BIconJustify } from "bootstrap-vue";

export default {
  name: "sidebar-toggle",
  components: {
    BIconJustify,
  },
  computed: {
    open() {
      return this.$store.state.ui.sidebarOpen;
    },
  },
  methods: {
    handleClick() {
      this.$store.dispatch("toggleSidebar");
    },
  },
};
</script>

<style scoped>
.icon-button {
  cursor: pointer;
}
</style>
