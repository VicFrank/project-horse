<template>
  <label
    v-on:click="onClick"
    v-bind:class="{
      'btns-bar__btn': true,
      'active-filter': active,
      'btns-bar__btn_right': isRight,
      'btns-bar__btn_left': isLeft,
    }"
  >
    <span>{{ $t(`filters.${filterName}`) }}</span>
  </label>
</template>

<script>
export default {
  props: {
    active: { type: Boolean, default: false },
    filterName: String,
    isLeft: { type: Boolean, default: false },
    isRight: { type: Boolean, default: false },
  },
  methods: {
    onClick() {
      const name = this.filterName;
      const active = !this.active; // this is about to be toggled, so I'm sending the negative
      this.$emit("toggle-filter", name, active);
    },
  },
};
</script>

<style></style>
