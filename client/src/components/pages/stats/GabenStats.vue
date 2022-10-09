<template>
  <b-table
    :fields="fields"
    :items="abilities"
    responsive
    class="m-auto"
    style="max-width: 800px"
  >
    <template #cell(icon)="data">
      <div class="d-flex align-items-center justify-content-start p-2">
        <AbilityImage
          :ability="data.item.ability_name"
          :icon="data.item.icon"
          :small="true"
          :size="48"
        ></AbilityImage>
        <span class="ml-2">{{
          $t(`abilities.${data.item.ability_name}`)
        }}</span>
      </div>
    </template>
    <template #cell(freq)="data">
      <div class="percent-td">
        <div class="text-left">
          {{ data.item.count }}
        </div>
        <div class="percentage-holder">
          <PercentBar
            :max="maxCount"
            :value="data.item.count"
            class="mt-1 progress-bar"
            v-b-tooltip.hover
            :title="data.item.count"
          ></PercentBar>
        </div>
      </div>
    </template>
  </b-table>
</template>

<script>
import AbilityImage from "../games/components/AbilityImage.vue";
import PercentBar from "../../utility/PercentBar.vue";
import { percentage } from "../../../filters/filters";

export default {
  components: {
    AbilityImage,
    PercentBar,
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
        key: "freq",
        label: "Count",
        thClass: "table-head text-left",
        sortable: true,
      },
    ];
  },

  methods: {
    percentage,
  },

  computed: {
    maxCount() {
      return this.abilities.reduce((max, ability) => {
        return ability.count > max ? ability.count : max;
      }, 0);
    },
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