<template>
  <div class="text-center">
    <div
      style="height: 128px; width: 128px; background-color: black"
      v-if="!icon"
    ></div>
    <AbilityImage
      :ability="abilityName"
      :icon="icon"
      :small="false"
      v-if="icon"
    ></AbilityImage>
    <h1 class="page-title">{{ $t(`abilities.${abilityName}`) }}</h1>

    <div class="mt-3 mx-auto" style="max-width: 700px">
      <div class="text-left d-flex mb-2">
        <div>
          <div class="mb-2">Date</div>
          <b-form-select
            v-model="selectedDate"
            :options="dateOptions"
            @change="loadAbilityStats(true)"
            :disabled="abilitiesLoading"
            style="width: 100px"
            class="mx-auto"
          ></b-form-select>
        </div>
        <div class="ml-2">
          <div class="mb-2">MMR</div>
          <b-form-select
            v-model="selectedMMR"
            :options="mmrOptions"
            @change="loadAbilityStats(true)"
            :disabled="abilitiesLoading"
            style="width: 100px"
            class="mx-auto"
          ></b-form-select>
        </div>
      </div>
      <template v-if="abilitiesLoading">
        <div class="d-flex justify-content-center my-3">
          <b-spinner label="Loading..."></b-spinner>
        </div>
      </template>
      <IndividualAbilityStats
        :showPercentages="selectedMMR == null"
        :linkAbilities="true"
        :abilities="abilityStats"
        @created="loadAbilityStats"
      ></IndividualAbilityStats>
    </div>
  </div>
</template>

<script>
import IndividualAbilityStats from "./abilities/IndividualAbilityStats.vue";
import AbilityImage from "../games/components/AbilityImage.vue";

export default {
  components: {
    IndividualAbilityStats,
    AbilityImage,
  },

  data: () => ({
    icon: null,
    abilityStats: [],
    abilitiesLoading: true,
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
  }),

  computed: {
    abilityName() {
      return this.$route.params.ability_name;
    },
  },

  created() {
    this.loadAbility();
  },

  methods: {
    loadAbility() {
      fetch(`/api/abilities/${this.abilityName}`)
        .then((res) => res.json())
        .then((ability) => {
          this.icon = ability.icon;
        });
    },
    loadAbilityStats(force) {
      if (!force && this.abilityStats.length > 0) return;
      this.abilitiesLoading = true;
      fetch(
        `/api/stats/abilities/${this.abilityName}/stats?hours=${this.selectedDate}&minMMR=${this.selectedMMR}`
      )
        .then((res) => res.json())
        .then((abilities) => {
          this.abilityStats = abilities;
          this.abilitiesLoading = false;
        });
    },
  },
};
</script>

<style scoped>
</style>