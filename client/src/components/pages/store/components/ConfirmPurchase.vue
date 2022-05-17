<template>
  <b-modal
    id="modal-confirm-purchase"
    ref="modal-confirm-purchase"
    centered
    hide-header
    hide-footer
  >
    Are you sure you want to pay for this item?
    <div class="mt-4 d-flex justify-content-end">
      <b-button class="mr-2" variant="secondary" @click="cancel"
        >Cancel</b-button
      >
      <b-button class="mr-2" variant="primary" @click="buy">Confirm</b-button>
    </div>
  </b-modal>
</template>

<script>
export default {
  props: {
    cosmetic: {},
  },
  methods: {
    buy() {
      const name = this.$i18n.t(`cosmetics.${this.cosmetic.cosmetic_id}`);
      this.$bvToast.toast(`Added ${name} to your armory`, {
        title: `Notification`,
        toaster: "b-toaster-bottom-left",
        solid: true,
        appendToast: true,
      });

      this.$refs["modal-confirm-purchase"].hide();
      this.$emit("buy", this.cosmetic);
    },
    cancel() {
      this.$refs["modal-confirm-purchase"].hide();
      this.$emit("cancel", this.cosmetic.cosmetic_id);
    },
  },
};
</script>

<style></style>
