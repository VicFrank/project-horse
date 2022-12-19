<template>
  <div class="text-center">
    <h1 class="page-title">Bodies</h1>

    <div style="max-width: 700px" class="mx-auto">
      <div class="text-left d-flex mb-2">
        <div>
          <div class="mb-2">Date</div>
          <b-form-select
            v-model="selectedDate"
            :options="dateOptions"
            @change="loadStats()"
            :disabled="loading"
            style="width: 100px"
            class="mx-auto"
          ></b-form-select>
        </div>
        <div class="ml-2">
          <div class="mb-2">MMR</div>
          <b-form-select
            v-model="selectedMMR"
            :options="mmrOptions"
            @change="loadStats()"
            :disabled="loading"
            style="width: 100px"
            class="mx-auto"
          ></b-form-select>
        </div>
      </div>
      <template v-if="loading">
        <div class="d-flex justify-content-center my-3">
          <b-spinner label="Loading..."></b-spinner>
        </div>
      </template>
      <b-table
        :fields="fields"
        :items="bodies"
        responsive
        class="m-auto"
        style="max-width: 700px"
      >
        <template #cell(icon)="data">
          <div class="d-flex align-items-center justify-content-start p-2">
            <HeroImage
              :hero="data.item.hero_name"
              :small="true"
              :size="48"
              style="height: 36px"
            ></HeroImage>
          </div>
        </template>
        <template #cell(freq)="data">
          <div class="percent-td">
            <div class="text-left">
              {{ data.item.freq }}
            </div>
            <div class="percentage-holder">
              <PercentBar
                :max="maxFreq"
                :value="data.item.freq"
                class="mt-1"
                v-b-tooltip.hover
                :title="data.item.freq"
              ></PercentBar>
            </div>
          </div>
        </template>
        <template #cell(winner_freq)="data">
          <div class="percent-td">
            <div class="text-left">
              {{ data.item.winner_freq }}
            </div>
            <div class="percentage-holder">
              <PercentBar
                :max="maxWinnerFreq"
                :value="data.item.winner_freq"
                class="mt-1"
                v-b-tooltip.hover
                :title="data.item.winner_freq"
              ></PercentBar>
            </div>
          </div>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import HeroImage from "../games/components/HeroImage.vue";
import PercentBar from "../../utility/PercentBar.vue";
import { percentage } from "../../../filters/filters";

export default {
  components: {
    HeroImage,
    PercentBar,
  },

  data: () => ({
    selectedDate: 24,
    selectedMMR: null,
    dateOptions: [
      { value: 24, text: "Day" },
      { value: 24 * 7, text: "Week" },
      { value: 24 * 30, text: "Month" },
    ],
    mmrOptions: [
      { value: null, text: "All MMR" },
      { value: 1000, text: "1000+" },
      { value: 1100, text: "1100+" },
      { value: 1200, text: "1200+" },
      { value: 1300, text: "1300+" },
      { value: 1400, text: "1400+" },
      { value: 1500, text: "1500+" },
      { value: 1600, text: "1600+" },
    ],
    bodies: [],
    fields: [],
  }),

  created() {
    this.loadStats();
    this.fields = [
      {
        key: "icon",
        label: this.$i18n.t("stats.hero_name"),
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
    ];
  },

  methods: {
    percentage,
    loadStats() {
      this.loading = true;
      fetch(
        `/api/stats/bodies?hours=${this.selectedDate}&minMMR=${this.selectedMMR}`
      )
        .then((res) => res.json())
        .then((stats) => {
          this.bodies = stats;
          this.loading = false;
        });
    },
  },

  computed: {
    maxFreq() {
      return this.bodies.reduce((max, body) => {
        return body.freq > max ? body.freq : max;
      }, 0);
    },
    maxWinnerFreq() {
      return this.bodies.reduce((max, body) => {
        return body.winner_freq > max ? body.winner_freq : max;
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