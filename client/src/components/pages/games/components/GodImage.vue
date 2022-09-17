<template>
  <b-img :height="height" v-bind:src="getGodPath(god)" v-bind:alt="god" />
</template>

<script>
export default {
  props: {
    god: String,
    height: Number,
  },

  methods: {
    getGodPath(god) {
      return `/images/gods/${god}.png`;
    },
  },
};
</script>

<style>
</style>
