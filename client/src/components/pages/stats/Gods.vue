<template>
  <div>
    <h1 class="page-title">{{ $t("gods.page_title") }}</h1>
    <b-table :fields="fields" :items="gods" responsive class="m-auto">
      <template #cell(god)="data">
        {{ data.item.god }}
      </template>
      <template #cell(pick_rate)="data">
        {{ percentage(data.item.pick_rate, 1) }}
        <div class="percentage-holder">
          <PercentBar
            :max="1"
            :value="data.item.pick_rate"
            class="mt-1 progress-bar"
          ></PercentBar>
        </div>
      </template>
      <template #cell(avg_place)="data">
        {{ round(data.item.avg_place, 2) }}
        <div class="percentage-holder">
          <PercentBar
            :max="8"
            :value="data.item.avg_place"
            class="mt-1 progress-bar"
          ></PercentBar>
        </div>
      </template>
      <template #cell(placements)="data">
        <PlacemementGraph :placements="data.placements"></PlacemementGraph>
      </template>
    </b-table>
  </div>
</template>

<script>
import PercentBar from "../../utility/PercentBar.vue";
import PlacemementGraph from "./components/PlacementGraph.vue";
import { percentage, round } from "../../../filters/filters";

export default {
  components: {
    PercentBar,
    PlacemementGraph,
  },

  data: () => ({
    fields: [],
    gods: [],
  }),

  created() {
    this.fields = [
      {
        key: "god",
        label: this.$i18n.t("gods.god"),
        thClass: "table-head text-left",
        sortable: true,
      },
      {
        key: "pick_rate",
        label: this.$i18n.t("gods.pick_rate"),
        thClass: "table-head",
        sortable: true,
      },
      {
        key: "avg_place",
        label: this.$i18n.t("gods.avg_place"),
        thClass: "table-head",
        sortable: true,
      },
      {
        key: "placements",
        label: this.$i18n.t("gods.placements"),
        thClass: "table-head",
        sortable: false,
      },
    ];
    fetch(`/api/stats/gods`)
      .then((res) => res.json())
      .then((gods) => {
        this.gods = gods;
      });
  },

  methods: {
    percentage,
    round,
  },
};
</script>

<style scoped>
.percentage-holder {
  width: 100px;
  margin: auto;
}
</style>