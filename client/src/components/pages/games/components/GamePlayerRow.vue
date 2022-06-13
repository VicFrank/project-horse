<template>
  <tr>
    <td class="col1">
      <div>{{ getRankString(player.place) }}</div>
    </td>
    <td class="col5">
      <div>{{ player.rounds }}</div>
      <div class="text-muted">{{ hhmmss(player.end_time) }}</div>
    </td>
    <td class="col6">{{ player.wins }} - {{ player.losses }}</td>
    <td v-if="showMMR">
      <div>{{ player.mmr }}</div>
      <span v-if="player.mmr_change >= 0" class="win">
        +{{ player.mmr_change }}
      </span>
      <span v-else class="loss"> {{ player.mmr_change }} </span>
    </td>
    <td class="col2">
      <div class="d-flex">
        <GodImage :god="player.god" :height="30" class="mr-2" />
        <div>
          <router-link :to="'/players/' + player.steam_id">
            {{ player.username }}
          </router-link>
          <div class="text-muted">{{ $t(`gods.${player.god}`) }}</div>
        </div>
      </div>
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
import GodImage from "./GodImage.vue";
import HeroAndAbilities from "./HeroAndAbilities.vue";
import { getRankString, hhmmss } from "../../../../filters/filters";

export default {
  components: {
    GodImage,
    HeroAndAbilities,
  },

  props: {
    player: Object,
    showMMR: Boolean,
  },

  methods: {
    getRankString,
    hhmmss,
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