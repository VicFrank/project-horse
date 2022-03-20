<template>
  <!-- TODO - Make rows collapsible to view detailed hero/ability stats -->
  <tr>
    <td class="col1">
      {{ player.place }}
    </td>
    <td class="col5">
      {{ player.rounds }}
    </td>
    <td class="col6">{{ player.wins }} - {{ player.losses || "?" }}</td>
    <td class="col2">
      <!-- TODO: Add profile Picture -->
      <router-link :to="'/players/' + player.steam_id">
        {{ player.username }}
      </router-link>
    </td>
    <!-- <div class="col3">God</div> -->
    <td class="d-flex col4 pr-3">
      <div class="d-flex flex-wrap">
        <HeroAndAbilities
          v-for="hero of player.heroes"
          :key="player.steam_id + hero.hero_name"
          :hero="hero"
        ></HeroAndAbilities>
      </div>
    </td>
  </tr>
</template>

<script>
import HeroAndAbilities from "./HeroAndAbilities.vue";

export default {
  components: {
    HeroAndAbilities,
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
  padding: 12px !important;
  text-align: left;
  width: 200px;
}
.col3 {
  width: 50px;
}
.col4 {
  text-align: left;
}
.col5 {
  width: 50px;
}
.col6 {
  width: 75px;
}
</style>