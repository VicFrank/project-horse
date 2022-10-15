<template>
  <span :style="{ height: `${height}px`, width: `${height}px` }">
    <b-img
      :id="god"
      :height="height"
      v-bind:src="getGodPath(god)"
      v-bind:alt="god"
    />
    <b-tooltip :target="god" custom-class="tooltip">
      <div class="god-header">{{ $t(`gods.${god}`) }}</div>
      <div class="d-flex" v-for="power of getPowers(god)" :key="power">
        <b-img
          lazy
          v-bind:src="`/images/gods/powers/power_${power}.png`"
          class="ability-image"
        ></b-img>
        <div>
          <div class="ability-name">{{ $t(`powers.${power}`) }}</div>
          <div class="ability-description">
            {{ $t(`powers.${power}_Description`) }}
          </div>
        </div>
      </div>
    </b-tooltip>
  </span>
</template>

<script>
import godPowers from "../scripts/GodPowers.js";

export default {
  props: {
    god: String,
    height: Number,
  },

  methods: {
    getGodPath(god) {
      return `/images/gods/${god}.png`;
    },
    getPowers(god) {
      return godPowers(god);
    },
  },
};
</script>

<style scoped>
.tooltip {
  width: 250px;
}

.tooltip-inner {
  width: 250px !important;
  max-width: 250px !important;
}

.god-header {
  font-size: 1rem;
  font-weight: bold;
  text-align: left;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid #56509e;
}

.ability-image {
  height: 60px;
  width: 60px;
  border: 1px solid #56509e;
  margin-right: 0.5rem;
}

.ability-name {
  text-align: left;
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.ability-description {
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
  text-align: left;
}
</style>
