<template>
  <div>
    <h2>
      Lobbies
      <a
        :class="{
          fa: true,
          'fa-sync': true,
          'refresh-button': true,
          'fa-spin': loadingLobbies,
        }"
        class="fa fa-sync refresh-button"
        @click="refreshLobbies"
      ></a>
    </h2>

    <table class="table">
      <tbody>
        <LobbyPreview v-for="lobby of lobbies" :key="lobby.id" :lobby="lobby" />
        <LobbyPreview v-for="i in numEmptyLobbies" :key="`empty-lobby${i}`" />
      </tbody>
    </table>
  </div>
</template>

<script>
import LobbyPreview from "./LobbyPreview";
export default {
  components: {
    LobbyPreview,
  },
  data: () => ({
    interval: null,
  }),
  created() {
    this.refreshLobbies();

    // Refresh the lobbies every 30 seconds
    this.interval = setInterval(() => {
      this.refreshLobbies();
    }, 30000);
  },
  unmounted() {
    clearInterval(this.interval);
  },
  computed: {
    lobbies() {
      return this.$store.getters.lobbies;
    },
    loadingLobbies() {
      return this.$store.getters.loadingLobbies;
    },
    numEmptyLobbies() {
      const minLobbies = 12;
      const numLobbies = this.lobbies.length;
      if (numLobbies < minLobbies) {
        return minLobbies - numLobbies;
      }
      return 0;
    },
  },
  methods: {
    refreshLobbies() {
      this.$store.dispatch("refreshLobbies");
    },
  },
};
</script>

<style scoped>
.refresh-button {
  font-size: 20px;
  margin-left: 5px;

  cursor: pointer;
}
</style>
