<template>
  <div
    v-b-tooltip.hover.html
    :title="`${badge} ${pips > 0 ? pips : ''}`"
    style="position: relative"
  >
    <b-img :height="height" v-bind:src="getBadgePath()" v-bind:alt="badge" />
    <b-img
      v-if="pips > 0"
      class="pip"
      :height="height"
      alt="pips"
      v-bind:src="getPipsPath()"
    />
    <span class="rank" v-if="badge === 'Immortal'">{{
      rank.toLocaleString()
    }}</span>
  </div>
</template>

<script>
export default {
  props: {
    badge: String,
    pips: Number,
    rank: Number,
    height: {
      type: Number,
      default: 80,
    },
  },

  methods: {
    getRankNumber() {
      if (this.badge === "Herald") return 1;
      if (this.badge === "Guardian") return 2;
      if (this.badge === "Crusader") return 3;
      if (this.badge === "Archon") return 4;
      if (this.badge === "Legend") return 5;
      if (this.badge === "Ancient") return 6;
      if (this.badge === "Divine") return 7;
      if (this.badge === "Immortal") return 8;
    },
    getBadgePath() {
      const rankNumber = this.getRankNumber();
      return `/images/badges/rank${rankNumber}_psd.png`;
    },
    getPipsPath() {
      return `/images/badges/pip${this.pips}_psd.png`;
    },
  },
};
</script>

<style scoped>
.pip {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
}

.rank {
  color: #f7e5c4;
  position: absolute;
  bottom: 8%;
  left: 0;
  right: 0;
  margin: auto;
  font-size: 100%;
  font-weight: bold;
  text-shadow: 0 0 2px #000;
  height: 20%;
}
</style>
