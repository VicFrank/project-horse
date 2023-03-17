<template>
  <div class="d-flex align-items-center">
    <HeroImage
      :hero="hero.hero_name"
      :height="48"
      class="mx-1 my-1"
    ></HeroImage>
    <AbilityImage
      v-for="ability in hero.abilities"
      :isUltimate="ability.is_ultimate"
      :key="ability.ability_name"
      :ability="ability.ability_name"
      :icon="ability.icon"
      :level="ability.ability_level"
      :small="true"
      :size="48"
      :positionRelative="true"
    ></AbilityImage>
    <!-- fill in the rest of the images if there are less than 4 -->
    <div v-for="n in 4 - hero.abilities.length" :key="n">
      <AbilityImage
        :ability="'empty'"
        :icon="'empty'"
        :level="0"
        :small="true"
        :size="48"
        :positionRelative="true"
      ></AbilityImage>
    </div>
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