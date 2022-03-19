<template>
  <div class="ability-container">
    <img
      :height="size"
      :width="size"
      :src="getAbilityPath(icon)"
      :alt="ability"
      class="ability-image"
    />
    <div class="level-container">
      <span class="level-icon">{{ level }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    ability: String,
    icon: String,
    size: Number,
    small: {
      type: Boolean,
      default: false,
    },
    level: Number,
    isUltimate: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    getAbilityPath(icon) {
      if (icon && icon.startsWith("custom_")) {
        icon = icon.slice(7);
      }
      if (this.small)
        return require(`../../../../assets/images/ability_icons/small/${icon}.jpg`);
      else
        return require(`../../../../assets/images/ability_icons/${icon}.png`);
    },
  },
};
</script>

<style scoped>
.ability-container {
  position: relative;
  width: 100%;
}

.level-container {
  position: absolute;
  bottom: 0;
  left: 25%;
  width: 18px;
  height: 18px;
  text-align: center;
  font-size: 0.8em;
  color: #fff;
  border-radius: 50%;
  background-color: #70563e;
}

.level-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-shadow: 1px 1px #000;
  color: #c0b092;
}
</style>
