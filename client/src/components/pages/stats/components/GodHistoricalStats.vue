<template>
  <div>
    <b-row class="mx-auto d-flex mb-2" style="max-width: 700px">
      <b-col>
        <div class="mb-2">Period</div>
        <b-form-select v-model="selectedPeriod" :options="peroidOptions"
          style="width: 200px" class="mx-auto mb-2"></b-form-select>
      </b-col>
      <b-col class="ml-2">
        <div class="mb-2">MMR</div>
        <b-form-select v-model="selectedMMR" :options="mmrOptions" 
          style="width: 200px" class="mx-auto"></b-form-select>
      </b-col>
    </b-row>
    <GodHistoricalGraph :godName="godName" :selectedMMR="selectedMMR" :selected-time-option="selectedPeriod" />
  </div>
</template>

<script>
import GodHistoricalGraph from "./GodHistoricalGraph.vue";

export default {
  components: {
    GodHistoricalGraph
  },
  props: {
    godName: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    selectedPeriod: "daily",
    peroidOptions: [
      { value: "daily", text: "Daily" },
      { value: "weekly", text: "Weekly" },
      { value: "monthly", text: "Monthly" },
      { value: "per_patch", text: "Patch" },
    ],

    selectedMMR: 'all_mmr',
    mmrOptions: [
      {value: 'all_mmr', text: 'All MMR'},
      {value: '1000_plus', text: '1000+'},
      {value: '1100_plus', text: '1100+'},
      {value: '1200_plus', text: '1200+'},
      {value: '1300_plus', text: '1300+'},
      {value: '1400_plus', text: '1400+'},
      {value: '1500_plus', text: '1500+'},
    ],
  }),
};
</script>

<style scoped>

</style>