<script>
/*
interface Ability {
  name: string;
  id: string;
  categories: Array<string>;
  description: string;
  values: Array<string>;
  cooldowns: Array<number>;
  manaCost: Array<number>;
  superUpgrade: string;
  gabenUpgrade: string;
  isUlt: boolean;
  tags: Array<string>;
  icon: string;
}
*/

export default {
  data() {
    return {
      ability: {},
    };
  },
};
</script>

<template>
  <div class="card">
    <header class="card-header">{{ability.name}}</header>
  </div>
</template>