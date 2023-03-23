<template>
  <b-table
    :fields="fields"
    :items="gods"
    :busy="loading"
    responsive
    class="m-auto pb-5"
    style="max-width: 700px"
    show-empty
  >
    <template #cell(show_details)="row">
      <span @click="row.toggleDetails" class="" style="cursor: pointer">
        {{ row.detailsShowing ? "-" : "+" }}
      </span>
    </template>
    <template #row-details="row">
      <div class="d-flex-row p-2">
        <h5>Expanded Statistics</h5>
        <div class="d-flex mb-2">
          <div class="d-flex-row" style="flex-grow: 1">
            <span>Last 7 Days</span>
            <GodHistoricalGraph
              :godName="row.item.god"
              :selectedMMR="selectedMMR"
            />
          </div>
          <div class="d-flex-row">
            <span>Placements</span>
            <PlacementGraph :placements="row.item.placements" />
          </div>
        </div>
        <b-button size="sm" @click="row.toggleDetails">Hide</b-button>
      </div>
    </template>
    <template #cell(god)="data">
      <div class="text-left p-2">
        <GodImage :god="data.item.god" :height="25" class="mr-2" />
        <router-link
          class="ml-2"
          v-if="linkAbilities"
          :to="`gods/${data.item.god}`"
        >
          {{ $t(`gods.${data.item.god}`) }}
        </router-link>
        <span class="ml-2" v-else> {{ $t(`gods.${data.item.god}`) }}</span>
      </div>
    </template>
    <template #cell(pick_rate)="data">
      <div class="percent-td">
        <div class="text-left">
          {{ percentage(data.item.pick_rate, 1) }}
        </div>
        <div class="percentage-holder">
          <PercentBar
            :max="maxPickRate"
            :value="data.item.pick_rate"
            class="mt-1 progress-bar"
            v-b-tooltip.hover
            :title="`Total picks: ${data.item.picks}`"
          ></PercentBar>
        </div>
      </div>
    </template>
    <template #cell(win_rate)="data">
      <div class="percent-td">
        <div class="text-left">
          {{ percentage(data.item.win_rate, 1) }}
        </div>
        <div class="percentage-holder">
          <PercentBar
            :max="maxWinRate"
            :value="data.item.win_rate"
            class="mt-1 progress-bar"
            v-b-tooltip.hover
            :title="`Number of first places finishes: ${data.item.first_place}`"
          ></PercentBar>
        </div>
      </div>
    </template>
    <template #cell(top_four_rate)="data">
      <div class="percent-td">
        <div class="text-left">
          {{ percentage(data.item.top_four_rate, 1) }}
        </div>
        <div class="percentage-holder">
          <PercentBar
            :max="maxTopFourRate"
            :value="data.item.top_four_rate"
            class="mt-1 progress-bar"
            v-b-tooltip.hover
            :title="`Total top four finishes: ${[
              data.item.first_place,
              data.item.second_place,
              data.item.third_place,
              data.item.fourth_place,
            ].reduce((p, c) => p + Number(c), 0)}`"
          ></PercentBar>
        </div>
      </div>
    </template>
    <template #cell(avg_place)="data">
      <div class="percent-td">
        <div class="text-left">
          {{ round(data.item.avg_place, 2) }}
        </div>
        <div class="percentage-holder">
          <PercentBar
            :max="maxAvgPlace"
            :value="data.item.avg_place"
            class="mt-1 progress-bar"
          ></PercentBar>
        </div>
      </div>
    </template>
    <template #empty>
      <div class="text-center m-5">
        <h3>No results found, check filters</h3>
      </div>
    </template>
    <template #table-busy>
      <div class="text-center m-5">
        <b-spinner class="align-middle p-4"></b-spinner>
      </div>
    </template>
  </b-table>
</template>

<script>
import PercentBar from "../../../utility/PercentBar.vue";
import GodImage from "../../games/components/GodImage.vue";
import GodHistoricalGraph from "../components/GodHistoricalGraph.vue";
import PlacementGraph from "../components/PlacementGraph.vue";
import { percentage, round } from "../../../../filters/filters";

export default {
  components: {
    PercentBar,
    GodImage,
    GodHistoricalGraph,
    PlacementGraph,
  },

  props: {
    gods: {
      type: Array,
      required: true,
    },
    linkAbilities: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: true,
    },
    selectedMMR: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    fields: [],
    maxPickRate: 1,
    maxWinRate: 1,
    maxTopFourRate: 1,
    maxAvgPlace: 1,
  }),

  created() {
    this.$emit("created");

    this.fields = [
      {
        key: "show_details",
        label: "",
        sortable: false,
      },
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
        key: "win_rate",
        label: "Win Rate",
        thClass: "table-head",
        sortable: true,
      },
      {
        key: "top_four_rate",
        label: "Top 4 Rate",
        thClass: "table-head",
        sortable: true,
      },
      {
        key: "avg_place",
        label: this.$i18n.t("gods.avg_place"),
        thClass: "table-head",
        sortable: true,
      },
    ];
  },

  watch: {
    gods: function () {
      if (this.gods.length) {
        this.maxPickRate = Math.max(...this.gods.map((g) => g.pick_rate));
        this.maxWinRate = Math.max(...this.gods.map((g) => g.win_rate));
        this.maxTopFourRate = Math.max(
          ...this.gods.map((g) => g.top_four_rate)
        );
        this.maxAvgPlace = Math.max(...this.gods.map((g) => g.avg_place));
      }
    },
  },

  methods: {
    percentage,
    round,
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