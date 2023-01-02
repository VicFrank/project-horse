<template>
  <b-table
    :fields="fields"
    :items="abilities"
    class="m-auto"
    style="max-width: 800px"
  >
    <template #table-colgroup>
      <col style="width: 600px" />
      <col style="width: 200px" />
    </template>
    <template #cell(icon)="data">
      <div class="d-flex align-items-center justify-content-start p-2">
        <AbilityImage
          :ability="data.item.ability_name"
          :icon="data.item.icon"
          :small="true"
          :size="48"
        ></AbilityImage>
        <router-link class="ml-2" :to="`/abilities/${data.item.ability_name}`">
          {{ $t(`abilities.${data.item.ability_name}`) }}
        </router-link>
      </div>
    </template>
    <template #cell(placements)="data">
      <PlacemementGraph :placements="data.item.placements"></PlacemementGraph>
    </template>
  </b-table>
</template>

<script>
import AbilityImage from "../games/components/AbilityImage.vue";
import PlacemementGraph from "./components/PlacementGraph.vue";

export default {
  components: {
    AbilityImage,
    PlacemementGraph,
  },

  props: {
    abilities: {
      type: Array,
      required: true,
    },
  },

  data: () => ({
    fields: [],
  }),

  created() {
    this.$emit("created");

    this.fields = [
      {
        key: "icon",
        label: this.$i18n.t("stats.ability_name"),
        thClass: "table-head text-left",
        sortable: true,
      },
      {
        key: "placements",
        label: "Level",
        thClass: "table-head text-left",
      },
    ];
  },
};
</script>

<style scoped>
.percentage-holder {
  margin: auto;
}

.percent-td {
  padding: 0 15px;
}
</style>