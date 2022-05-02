<template>
  <div class="text-center">
    <h1 class="page-title" v-t="'stats.abilities'"></h1>
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
          <span class="ml-2">{{ data.item.icon }}</span>
        </div>
      </template>
      <template #cell(freq)="data">
        <div class="percent-td">
          <div class="text-left">
            {{ percentage(data.item.freq / maxFreq, 1) }}
          </div>
          <div class="percentage-holder">
            <PercentBar
              :max="1"
              :value="data.item.freq / maxFreq"
              class="mt-1 progress-bar"
              v-b-tooltip.hover
              :title="data.item.freq"
            ></PercentBar>
          </div>
        </div>
      </template>
      <template #cell(winner_freq)="data">
        <div class="percent-td">
          <div class="text-left">
            {{ percentage(data.item.winner_freq / maxWinnerFreq, 1) }}
          </div>
          <div class="percentage-holder">
            <PercentBar
              :max="1"
              :value="data.item.winner_freq / maxWinnerFreq"
              class="mt-1 progress-bar"
              v-b-tooltip.hover
              :title="data.item.winner_freq"
            ></PercentBar>
          </div>
        </div>
      </template>
      <template #cell(top_four_freq)="data">
        <div class="percent-td">
          <div class="text-left">
            {{ percentage(data.item.top_four_freq / maxTopFourFreq, 1) }}
          </div>
          <div class="percentage-holder">
            <PercentBar
              :max="1"
              :value="data.item.top_four_freq / maxTopFourFreq"
              class="mt-1 progress-bar"
              v-b-tooltip.hover
              :title="data.item.top_four_freq"
            ></PercentBar>
          </div>
        </div>
      </template>
    </b-table>
  </div>
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

  data: () => ({
    fields: [],
    abilities: [],
  }),

  created() {
    this.fields = [
      {
        key: "icon",
        label: this.$i18n.t("stats.ability_name"),
        thClass: "table-head text-left",
        sortable: true,
      },
      {
        key: "freq",
        label: this.$i18n.t("stats.pick_rate"),
        thClass: "table-head text-left",
        sortable: true,
      },
      {
        key: "winner_freq",
        label: this.$i18n.t("stats.first_place_rate"),
        thClass: "table-head text-left",
        sortable: true,
      },
      {
        key: "top_four_freq",
        label: this.$i18n.t("stats.top_four_freq"),
        thClass: "table-head text-left",
        sortable: false,
      },
    ];

    fetch(`/api/stats/abilities`)
      .then((res) => res.json())
      .then((abilities) => {
        this.abilities = abilities;
      });
  },

  methods: {
    percentage,
  },

  computed: {
    maxFreq() {
      return this.abilities.reduce((max, ability) => {
        return ability.freq > max ? ability.freq : max;
      }, 0);
    },
    maxWinnerFreq() {
      return this.abilities.reduce((max, ability) => {
        return ability.winner_freq > max ? ability.winner_freq : max;
      }, 0);
    },
    maxTopFourFreq() {
      return this.abilities.reduce((max, ability) => {
        return ability.top_four_freq > max ? ability.top_four_freq : max;
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