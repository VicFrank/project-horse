<template>
  <div>
    <b-button v-b-modal.modal-host-lobby>Host a Lobby</b-button>

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
          :state="mmrMinState"
          :invalid-feedback="`Must be lower than ${mmr}`"
          label="Min MMR"
          label-for="mmr-min"
        >
          <b-form-input
            :max="mmr"
            :min="0"
            id="mmr-min"
            v-model="mmrMin"
            type="number"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          :state="mmrMaxState"
          :invalid-feedback="`Must be between ${mmr} and ${mmr + 400}`"
          label="Max MMR"
          label-for="mmr-max"
        >
          <b-form-input
            :max="mmr + 400"
            :min="mmr"
            id="mmr-max"
            v-model="mmrMax"
            type="number"
            required
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script>
export default {
  data() {
    const mmr = this.$store.state.auth.mmr;
    const mmrFloor = mmr ? Math.floor(mmr / 100) * 100 : 1000;
    const mmrCeil = mmr ? Math.ceil(mmr / 100) * 100 : 1000;
    return {
      mmrMin: mmrFloor,
      mmrMax: mmrCeil,
      region: null,
      regionState: null,
      mmrMinState: null,
      mmrMaxState: null,
      regions: [
        { text: "Select One", value: null },
        "North America",
        "South America",
        "Europe West",
        "Europe East",
        "South East Asia",
        "China",
      ],
    };
  },
  computed: {
    mmr() {
      return this.$store.state.auth.mmr;
    },
  },
  methods: {
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.regionState = this.region != null;
      this.mmrMinState = this.mmrMin != null && this.mmrMin <= this.mmr;
      this.mmrMaxState =
        this.mmrMax != null &&
        this.mmrMax >= this.mmr &&
        this.mmrMax <= this.mmr + 200;
      return valid;
    },
    resetModal() {
      this.region = null;
      this.regionState = null;
      this.mmrMinState = null;
      this.mmrMaxState = null;
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleSubmit();
    },
    handleSubmit() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return;
      }
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide("modal-host-lobby");
      });
      this.$store.dispatch("hostLobby", {
        region: this.region,
        mmrMin: this.mmrMin,
        mmrMax: this.mmrMax,
      });
    },
  },
};
</script>

<style>
</style>