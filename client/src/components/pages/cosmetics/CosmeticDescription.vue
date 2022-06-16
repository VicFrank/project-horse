<template>
  <div v-if="typeof getDescription() === 'object'">
    <ul>
      <li v-for="line in getDescription()" :key="line">{{ line }}</li>
    </ul>
  </div>
  <div v-else-if="typeof getDescription() === 'string'">
    {{ getDescription() }}
  </div>
  <div v-else>{{ getDescription() }}</div>
</template>

<script>
export default {
  props: {
    cosmetic: {},
  },
  methods: {
    getDescription() {
      return this.$i18n.t(
        `cosmetic_descriptions.${this.cosmetic.cosmetic_name}`
      );
    },
  },
};
</script>

<style>
</style>