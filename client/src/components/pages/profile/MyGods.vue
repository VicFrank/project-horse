<template>
  <div>
    <h1 class="page-title">{{ $t("gods.my_gods") }}</h1>
    <div class="gods-container">
      <div
        v-for="god of gods"
        :key="god.god_name"
        class="text-center m-3"
        style="position: relative; max-width: 100px"
      >
        <GodImage
          :class="{ overlay: !god.owned }"
          :god="god.god_name"
          :height="100"
        ></GodImage>
        <div
          v-bind:class="{
            'my-1': true,
            'text-muted': !god.owned,
            'text-danger': god.banned,
            'text-gold': god.gold,
          }"
        >
          {{ $t(`gods.${god.god_name}`) }}
        </div>
        <div v-if="god.plus_exclusive" class="text-muted">
          {{ $t("common.plus") }}
        </div>
        <div v-if="god.free" class="text-muted">{{ $t("common.free") }}</div>
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
  background-color: #403652;
  opacity: 0.5;
  width: 100%;
  height: 100px;
}
</style>