<template>
  <div class="ability-container">
    <img
      :height="size"
      :width="size"
      :src="getAbilityPath(icon)"
      :alt="ability"
      class="ability-image"
      v-bind:class="borderColor"
    />
    <div v-if="level != null" class="level-container">
      <span class="level-icon" v-bind:class="levelColor">{{ level }}</span>
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

  data() {
    return {
      publicPath: process.env.BASE_URL,
    };
  },

  methods: {
    getAbilityPath(icon) {
      if (icon && icon.startsWith("custom_")) {
        icon = icon.slice(7);
      }
      if (this.small)
        return `${this.publicPath}images/ability_icons/small/${icon}.png`;
      else return `${this.publicPath}images/ability_icons/${icon}.png`;
    },
  },

  computed: {
    levelColor() {
      if (this.level == 9) {
        return { "gaben-color": true };
      } else if (this.level >= 6) {
        return { "super-color": true };
      }
      return {};
    },
    borderColor() {
      if (this.level == 9) {
        return { "border-gaben": true };
      } else if (this.level >= 6) {
        return { "border-super": true };
      }
      return {};
    },
  },
};
</script>

<style scoped>
.ability-container {
  position: relative;
}

.level-container {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
  width: 18px;
  height: 18px;
  text-align: center;
  font-size: 0.8em;
  color: #fff;
  border-radius: 50%;
  background-color: #5a422a;
}

.level-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-shadow: 1px 1px 1px #000;
  color: #e4d9c7;
}

.super-color {
  color: #ae82ff;
}

.gaben-color {
  color: #ff6126;
}

.border-super {
  border: solid 2px #8847ff;
}

.border-gaben {
  border: solid 2px #ff6126;
}
</style>
