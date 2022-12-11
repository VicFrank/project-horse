<template>
  <b-table
    :fields="fields"
    :items="cosmetics"
    responsive
    class="m-auto"
    style="max-width: 700px"
  >
    <template #cell(name)="data">
      <div class="text-left p-2">
        <img
          :src="`/images/cosmetics/${data.item.name}.png`"
          :alt="data.item.name"
          @click="$bvModal.show(`bp-modal-${i}`)"
          style="width: 50px; height: 50px"
        />
        {{ $t(`cosmetics.${data.item.name}`) }}
      </div>
    </template>
    <template #cell(count)="data">
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
    <template #cell(dollars)="data">
      <div class="percent-td">
        <div class="text-left">${{ data.item.dollars }}</div>
        <div class="percentage-holder">
          <PercentBar
            :max="maxDollars"
            :value="data.item.dollars"
            class="mt-1 progress-bar"
            v-b-tooltip.hover
            :title="data.item.dollars"
          ></PercentBar>
        </div>
      </div>
    </template>
  </b-table>
</template>

<script>
import PercentBar from "../../../utility/PercentBar.vue";
import { percentage, round } from "../../../../filters/filters";

export default {
  components: {
    PercentBar,
  },

  props: {
    cosmetics: {
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
        key: "name",
        label: "Item",
        thClass: "table-head text-left",
        sortable: true,
      },
      {
        key: "count",
        label: "Purchased",
        thClass: "table-head",
        sortable: true,
      },
      {
        key: "dollars",
        label: "Earned",
        thClass: "table-head",
        sortable: true,
      },
    ];
  },

  methods: {
    percentage,
    round,
  },

  computed: {
    maxCount() {
      return Math.max(...this.cosmetics.map((god) => god.count));
    },
    maxDollars() {
      return Math.max(...this.cosmetics.map((god) => god.dollars));
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