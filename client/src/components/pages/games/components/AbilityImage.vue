<template>
  <div
    :style="{
      height: `${size}px`,
      width: `${size}px`,
      position: `${positionRelative ? 'relative' : ''}`,
    }"
    v-bind:class="backgroundImage"
  >
    <img
      :height="size"
      :width="size"
      :src="getAbilityPath(icon)"
      :alt="ability"
      class="ability-image"
    />
    <div v-if="isUltimate" class="ultimate"></div>
    <div v-if="level" class="level-container" v-bind:class="backgroundImage">
      <span class="level-icon" v-bind:class="levelColor">{{ level }}</span>
    </div>
    <div v-if="level" v-bind:class="strokeColor"></div>
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
    positionRelative: {
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
    backgroundImage() {
      if (this.level == 9) {
        return { "background-gaben": true };
      } else if (this.level >= 6) {
        return { "background-super": true };
      }
      return {};
    },
    strokeColor() {
      if (this.level == 9) {
        return { "ability-stroke-gaben": true };
      } else if (this.level >= 6) {
        return { "ability-stroke-super": true };
      }
      return { "ability-stroke-basic": true };
    },
  },
};
</script>

<style scoped>
.level-container {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
  width: 20px;
  height: 20px;
  text-align: center;
  font-size: 12px;
  background-image: url("./images/ability_level_circle_basic.png");
  background-size: cover;
}

.ultimate {
  position: absolute;
  top: 0;
  left: 0;
  height: 16px;
  width: 16px;
  background-image: url("./images/is_ultimate.png");
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
  color: #7dc4ff;
}

.gaben-color {
  color: #ffc476;
}

.background-super {
  background-image: url("./images/ability_level_circle_super.png");
}

.background-gaben {
  background-image: url("./images/ability_level_circle_gaben.png");
}

.ability-stroke-basic {
  background-image: url("./images/ability_stroke_basic.png");
  background-size: cover;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.ability-stroke-super {
  background-image: url("./images/ability_stroke_super.png");
  background-size: cover;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.ability-stroke-gaben {
  background-image: url("./images/ability_stroke_gaben.png");
  background-size: cover;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
