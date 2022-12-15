<template>
  <div>
    <b-button v-b-modal.modal-host-lobby variant="primary"
      >Host a Lobby</b-button
    >

    <b-modal
      id="modal-host-lobby"
      ref="modal"
      title="Lobby Settings"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          :state="regionState"
          invalid-feedback="Required"
          label="Region"
          label-for="region-input"
        >
          <b-form-select
            id="region-input"
            v-model="region"
            :options="regions"
            required
          ></b-form-select>
        </b-form-group>
        <b-form-group
          :state="minRankState"
          label="Min Rank"
          label-for="min-rank"
          invalid-feedback="Required"
        >
          <b-form-select
            id="min-rank"
            v-model="minRank"
            :options="minRanks"
            required
          ></b-form-select>
        </b-form-group>
        <b-form-group
          :state="maxRankState"
          label="Max Rank"
          label-for="max-rank"
          invalid-feedback="Required"
        >
          <b-form-select
            id="max-rank"
            v-model="maxRank"
            :options="maxRanks"
            required
          ></b-form-select>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script>
export default {
  data() {
    const ladderMMR = this.$store.state.auth.ladderMMR;
    console.log(ladderMMR < 500 && ladderMMR > 1000);
    return {
      minRank: null,
      maxRank: null,
      region: null,
      regionState: null,
      minRankState: null,
      maxRankState: null,
      regions: [
        { text: "Select One", value: null },
        "North America",
        "South America",
        "Europe West",
        "Europe East",
        "South East Asia",
        "China",
      ],
      minRanks: [
        { text: "Select One", value: null },
        { text: "Herald", value: 0 },
        { text: "Guardian", value: 500, disabled: ladderMMR < 500 },
        { text: "Crusader", value: 1000, disabled: ladderMMR < 1000 },
        { text: "Archon", value: 1500, disabled: ladderMMR < 1500 },
        { text: "Legend", value: 2000, disabled: ladderMMR < 2000 },
        { text: "Ancient", value: 2500, disabled: ladderMMR < 2500 },
        { text: "Divine", value: 3500, disabled: ladderMMR < 3500 },
        { text: "Immortal", value: 99999, disabled: ladderMMR < 4500 },
      ],
      maxRanks: [
        { text: "Select One", value: null },
        { text: "Herald", value: 0, disabled: ladderMMR >= 500 },
        {
          text: "Guardian",
          value: 500,
          disabled: ladderMMR < 500 || ladderMMR >= 1000,
        },
        {
          text: "Crusader",
          value: 1000,
          disabled: ladderMMR < 1000 || ladderMMR >= 1500,
        },
        {
          text: "Archon",
          value: 1500,
          disabled: ladderMMR < 1500 || ladderMMR >= 2000,
        },
        {
          text: "Legend",
          value: 2000,
          disabled: ladderMMR < 2000 || ladderMMR >= 2500,
        },
        {
          text: "Ancient",
          value: 2500,
          disabled: ladderMMR < 2500 || ladderMMR >= 3500,
        },
        {
          text: "Divine",
          value: 3500,
          disabled: ladderMMR < 3500 || ladderMMR >= 4500,
        },
        { text: "Immortal", value: 99999, disabled: ladderMMR < 4500 },
      ],
    };
  },
  computed: {
    ladderMMR() {
      return this.$store.state.auth.ladderMMR;
    },
  },
  methods: {
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.regionState = this.region != null;
      this.minRankState = this.minRank != null;
      this.maxRankState = this.minRank != null;
      return valid && this.minRankState && this.maxRankState;
    },
    resetModal() {
      this.region = null;
      this.regionState = null;
      this.minRankState = null;
      this.maxRankState = null;
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleSubmit();
    },
    handleSubmit() {
      // Exit when the form isn't valid
      console.log(this.checkFormValidity());
      if (!this.checkFormValidity()) {
        return;
      }
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide("modal-host-lobby");
      });
      this.$store.dispatch("hostLobby", {
        region: this.region,
        mmrMin: Math.min(4500, this.minRank),
        mmrMax: this.maxRank,
      });
    },
  },
};
</script>

<style>
</style>