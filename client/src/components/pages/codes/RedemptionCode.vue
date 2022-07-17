<template>
  <div>
    <h1 class="page-title">Redeem Codes</h1>
    <div class="container text-center">
      <label>Enter a code:</label>
      <b-form-input
        type="text"
        v-model="code"
        style="max-width: 200px"
        class="m-auto"
      ></b-form-input>
      <b-button
        :disabled="!code"
        type="submit"
        variant="primary"
        @click="redeemCode"
        class="my-3"
        >Redeem</b-button
      >
    </div>

    <b-modal
      id="success-modal"
      title="Success"
      :ok-label="$t('common.close')"
      ok-only
    >
      <p>Successfully redeemed code! Check your inventory for your item(s).</p>
    </b-modal>
    <b-modal
      id="failure-modal"
      title="Failed to redeem code"
      :ok-label="$t('common.close')"
      ok-only
    >
      <p>{{ error }}</p>
    </b-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      code: "",
      error: "",
    };
  },
  computed: {
    steamID() {
      return this.$store.state.auth.userSteamID;
    },
  },
  methods: {
    redeemCode() {
      fetch(`/api/players/${this.steamID}/redeem_code/${this.code}`, {
        method: "post",
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            this.$bvModal.show("success-modal");
            this.$store.dispatch("REFRESH_PLAYER");
          } else {
            this.error = res.message;
            this.$bvModal.show("failure-modal");
          }
        });
    },
  },
};
</script>

<style>
</style>