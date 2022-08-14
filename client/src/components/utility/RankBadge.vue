<template>
  <div v-b-tooltip.hover.html :title="`${badge} ${pips > 0 ? pips : ''}`">
    <b-img
      :height="height"
      v-bind:src="getBadgePath(hero)"
      v-bind:alt="badge"
    />
    <b-img
      v-if="pips > 0"
      class="pip"
      :height="height"
      v-bind:src="getPipsPath(hero)"
    />
  </div>
</template>

<script>
export default {
  props: {
    badge: String,
    pips: Number,
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
      return require(`../../assets/images/badges/rank${rankNumber}_psd.png`);
    },
    getPipsPath() {
      return require(`../../assets/images/badges/pip${this.pips}_psd.png`);
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
  height: 100%;
  margin: auto;
}
</style>
