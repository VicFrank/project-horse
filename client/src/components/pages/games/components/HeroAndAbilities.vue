<template>
  <div class="d-flex">
    <HeroImage
      :hero="hero.hero_name"
      :height="48"
      class="mx-1 my-1"
    ></HeroImage>
    <AbilityImage
      v-for="ability in hero.abilities"
      :key="ability.ability_name"
      :ability="ability.ability_name"
      :icon="ability.icon"
      :level="ability.ability_level"
      :small="true"
      :size="48"
    ></AbilityImage>
  </div>
</template>

<script>
import HeroImage from "./HeroImage.vue";
import AbilityImage from "./AbilityImage.vue";

export default {
  components: {
    HeroImage,
    AbilityImage,
  },

  props: {
    hero: Object,
  },
};
</script>

<style>
</style>