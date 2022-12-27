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
        <router-link
          class="ml-2"
          v-if="linkAbilities"
          :to="`abilities/${data.item.ability_name}`"
        >
          {{ $t(`abilities.${data.item.ability_name}`) }}
        </router-link>
        <span class="ml-2" v-else>
          {{ $t(`abilities.${data.item.ability_name}`) }}</span
        >
      </div>
    </template>
    <template #cell(freq)="data">
      <div class="percent-td">
        <div class="text-left">
          <template v-if="showPercentages">
            {{ percentage(data.item.freq / data.item.numGames, 1) }}
          </template>
          <template v-else>
            {{ data.item.freq }}
          </template>
        </div>
        <div class="percentage-holder">
          <PercentBar
            :max="maxFreq"
            :value="data.item.freq / (showPercentages ? data.item.numGames : 1)"
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
          <template v-if="showPercentages">
            {{ percentage(data.item.winner_freq / data.item.numGames, 1) }}
          </template>
          <template v-else>
            {{ data.item.winner_freq }}
          </template>
        </div>
        <div class="percentage-holder">
          <PercentBar
            :max="maxWinnerFreq"
            :value="
              data.item.winner_freq / (showPercentages ? data.item.numGames : 1)
            "
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
          <template v-if="showPercentages">
            {{ percentage(data.item.top_four_freq / data.item.numGames, 1) }}
          </template>
          <template v-else>
            {{ data.item.winner_freq }}
          </template>
        </div>
        <div class="percentage-holder">
          <PercentBar
            :max="maxTopFourFreq"
            :value="
              data.item.top_four_freq /
              (showPercentages ? data.item.numGames : 1)
            "
            class="mt-1 progress-bar"
            v-b-tooltip.hover
            :title="data.item.top_four_freq"
          ></PercentBar>
        </div>
      </div>
    </template>
  </b-table>
</template>

<script>
import AbilityImage from "../../games/components/AbilityImage.vue";
import PercentBar from "../../../utility/PercentBar.vue";
import { percentage } from "../../../../filters/filters";

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
    showPercentages: {
      type: Boolean,
      default: true,
    },
    linkAbilities: {
      type: Boolean,
      default: false,
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
        sortable: true,
      },
    ];
  },

  methods: {
    percentage,
  },

  computed: {
    maxFreq() {
      return this.abilities.reduce((max, ability) => {
        const divisor = this.showPercentages ? ability.numGames : 1;
        return ability.freq / divisor > max ? ability.freq / divisor : max;
      }, 0);
    },
    maxWinnerFreq() {
      return this.abilities.reduce((max, ability) => {
        const divisor = this.showPercentages ? ability.numGames : 1;
        return ability.winner_freq / divisor > max
          ? ability.winner_freq / divisor
          : max;
      }, 0);
    },
    maxTopFourFreq() {
      return this.abilities.reduce((max, ability) => {
        const divisor = this.showPercentages ? ability.numGames : 1;
        return ability.top_four_freq / divisor > max
          ? ability.top_four_freq / divisor
          : max;
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