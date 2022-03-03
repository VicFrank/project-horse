<template>
  <b-img v-bind:src="getHeroPath(hero)" v-bind:alt="hero" />
</template>

<script>
export default {
  props: {
    hero: String,
    small: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    getHeroPath(hero) {
      if (hero && hero.startsWith("npc_dota_hero")) {
        hero = hero.slice(14);
      }

      if (this.small) {
        // return require(`../../../../assets/images/heroes/small/${hero}.png`);
      } else {
        return require(`../../../../assets/images/heroes/${hero}.png`);
      }
    },
  },
};
</script>

<style>
</style>
