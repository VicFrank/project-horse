<template>
  <div class="placements">
    <div class="bar-container" v-for="(rate, index) in placements" :key="index">
      <div
        class="bar"
        :title="getRankString(index + 1) + ': ' + percentage(rate)"
        v-b-tooltip.hover
      >
        <div
          class="bar-inner"
          v-bind:style="{ height: graphHeight(rate) + '%' }"
        ></div>
      </div>
      <div class="bar-label">{{ index + 1 }}</div>
    </div>
  </div>
</template>

<script>
import { percentage, getRankString } from "../../../../filters/filters";

export default {
  props: {
    placements: Array,
  },

  methods: {
    percentage,
    getRankString,
    graphHeight(rate) {
      rate = Math.min(1, rate / 0.3);
      return 100 * rate;
    },
  },
};
</script>

<style scoped>
.placements {
  display: flex;
  height: 80px;
  padding: 10px;
}

.bar-container {
  height: 50px;
  width: 15px;
  margin-left: 6px;
}

.bar {
  height: 100%;
  width: 100%;
  display: flex;
}

.bar-inner {
  background-color: #0b86c4;
  width: 100%;
  align-self: flex-end;
}

.bar-label {
  text-align: center;
  font-size: 10px;
}
</style>