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
          invalid-feedback="Region is required"
          label="Region:"
          label-for="region-input"
        >
          <b-form-select
            id="region-input"
            v-model="region"
            :options="regions"
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
    return {
      region: null,
      regionState: null,
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
  methods: {
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.regionState = valid;
      return valid;
    },
    resetModal() {
      this.region = null;
      this.regionState = null;
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
      this.$store.dispatch("hostLobby", { region: this.region });
    },
  },
};
</script>

<style>
</style>