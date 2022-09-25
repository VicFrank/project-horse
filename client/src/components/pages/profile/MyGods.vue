<template>
  <div>
    <h1 class="page-title">{{ $t("gods.my_gods") }}</h1>
    <div class="gods-container">
      <div
        v-for="god of gods"
        :key="god.god_name"
        class="text-center m-3"
        style="position: relative"
      >
        <div v-if="!god.owned" class="overlay"></div>
        <GodImage
          :god="god.god_name"
          :height="100"
          v-bind:class="{
            'gold-card': god.gold,
          }"
        ></GodImage>
        <div
          v-bind:class="{
            'my-1': true,
            'text-muted': !god.owned,
            'text-danger': god.banned,
          }"
        >
          {{ $t(`gods.${god.god_name}`) }}
        </div>
        <div v-if="god.plus_exclusive" class="text-muted">Plus</div>
        <div v-if="god.free" class="text-muted">Free</div>
        <!-- <div v-if="god.error" class="text-danger">Error</div>
        <b-button
          variant="secondary"
          size="sm"
          :disabled="!god.owned"
          @click="toggleBanned(god)"
        >
          <template v-if="god.banned">{{ $t("gods.unban") }}</template>
          <template v-if="!god.banned">{{ $t("gods.ban") }}</template>
          <b-spinner small v-if="god.loading" :label="Loading"></b-spinner>
        </b-button> -->
      </div>
    </div>
  </div>
</template>

<script>
import GodImage from "../games/components/GodImage.vue";

export default {
  components: {
    GodImage,
  },

  data: () => ({
    loading: true,
    gods: [],
  }),

  computed: {
    steamID() {
      return this.$store.state.auth.userSteamID;
    },
  },

  created() {
    fetch(`/api/players/${this.steamID}/gods`)
      .then((res) => res.json())
      .then((gods) => {
        this.gods = gods;
        this.loading = false;
      });
  },

  methods: {
    toggleBanned(god) {
      god.loading = true;
      const { god_name, banned } = god;
      fetch(
        `/api/players/${this.steamID}/gods/${god_name}/ban?banned=${!banned}`,
        {
          method: "POST",
        }
      )
        .then((res) => res.json())
        .then((data) => {
          god.banned = data.banned;
          god.loading = false;
        })
        .catch(() => {
          god.error = true;
          god.loading = false;
        });
    },
  },
};
</script>

<style scoped>
.gods-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.overlay {
  position: absolute;
  top: 0;
  background-color: #403652;
  opacity: 0.5;
  width: 100%;
  height: 100px;
}

.gold-card {
  box-shadow: 0 0 0 1px gold, 0 0 0 2px gold, 0 0 0 3px gold;
}
</style>