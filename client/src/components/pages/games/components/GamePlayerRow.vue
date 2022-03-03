<template>
  <tr>
    <td class="col1">
      {{ player.place }}
    </td>
    <td class="col2">
      <!-- TODO: Add profile Picture -->
      {{ player.username }}
    </td>
    <!-- <div class="col3">God</div> -->
    <td class="d-flex col4">
      <HeroImage
        v-for="hero of player.heroes"
        :key="hero.hero_name"
        :hero="hero.hero_name"
      ></HeroImage>
    </td>
    <td class="col5">
      {{ player.rounds }}
    </td>
    <td class="col6">{{ player.wins }} - {{ player.losess || "?" }}</td>
  </tr>
</template>

<script>
import HeroImage from "./HeroImage.vue";

export default {
  components: {
    HeroImage,
  },

  props: {
    player: Object,
  },
};
</script>

<style scoped>
.col1 {
  width: 50px;
}
.col2 {
  width: 200px;
}
.col3 {
  width: 50px;
}
.col4 {
  width: 300px;
}
.col5 {
  width: 50px;
}
.col6 {
  width: 75px;
}
</style>