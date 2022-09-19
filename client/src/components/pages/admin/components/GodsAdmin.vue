<template>
  <div>
    <div class="gods-container">
      <div
        v-for="god of gods"
        :key="god.god_name"
        class="text-center m-3"
        style="position: relative"
      >
        <div v-if="!god.god_enabled" class="overlay"></div>
        <GodImage :god="god.god_name" :height="100"></GodImage>
        <div
          v-bind:class="{
            'my-1': true,
            'text-muted': !god.god_enabled,
          }"
        >
          {{ $t(`gods.${god.god_name}`) }}
        </div>
        <div v-if="god.error" class="text-danger">Error</div>
        <div>
          <b-button variant="secondary" size="sm" @click="toggleDisabled(god)">
            <template v-if="god.god_enabled">Enabled</template>
            <template v-if="!god.god_enabled">Disabled</template>
            <b-spinner small v-if="god.loading" :label="Loading"></b-spinner>
          </b-button>
        </div>
        <div>
          <b-button variant="secondary" size="sm" @click="toggleIsFree(god)">
            <template v-if="god.free">Free</template>
            <template v-if="!god.free">Paid</template>
            <b-spinner small v-if="god.loading" :label="Loading"></b-spinner>
          </b-button>
        </div>
        <div>
          <b-button
            variant="secondary"
            size="sm"
            @click="togglePlusExclusive(god)"
          >
            <template v-if="god.plus_exclusive">Plus</template>
            <template v-if="!god.plus_exclusive">Not Plus</template>
            <b-spinner small v-if="god.loading" :label="Loading"></b-spinner>
          </b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GodImage from "../../games/components/GodImage.vue";

export default {
  components: {
    GodImage,
  },

  data: () => ({
    loading: true,
    gods: [],
  }),

  created() {
    fetch(`/api/gods`)
      .then((res) => res.json())
      .then((gods) => {
        this.gods = gods;
        this.loading = false;
      });
  },

  methods: {
    toggleDisabled(god) {
      god.loading = true;
      const { god_name, god_enabled } = god;
      fetch(`/api/gods/${god_name}/set_enabled?enabled=${!god_enabled}`, {
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => {
          god.god_enabled = data.god_enabled;
          god.loading = false;
        })
        .catch(() => {
          god.error = true;
          god.loading = false;
        });
    },

    toggleIsFree(god) {
      god.loading = true;
      const { god_name, free } = god;
      fetch(`/api/gods/${god_name}/set_is_free?isFree=${!free}`, {
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => {
          god.free = data.free;
          god.loading = false;
        })
        .catch(() => {
          god.error = true;
          god.loading = false;
        });
    },

    togglePlusExclusive(god) {
      god.loading = true;
      const { god_name, plus_exclusive } = god;
      fetch(
        `/api/gods/${god_name}/set_plus_exclusive?plusExclusive=${!plus_exclusive}`,
        {
          method: "POST",
        }
      )
        .then((res) => res.json())
        .then((data) => {
          god.plus_exclusive = data.plus_exclusive;
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
button {
  width: 100%;
  margin: 2px 0px;
}
.gods-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.overlay {
  position: absolute;
  top: 0;
  left: 17px;
  background-color: #403652;
  opacity: 0.5;
  width: 100px;
  height: 100px;
}
</style>