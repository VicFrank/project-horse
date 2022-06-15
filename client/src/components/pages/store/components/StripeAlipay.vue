<template>
  <div>
    <b-button variant="primary" @click="goToAlipay" :disabled="!complete"
      >Pay with Alipay</b-button
    >
    <b-alert v-model="showError" variant="danger" dismissible>{{
      error
    }}</b-alert>
  </div>
</template>

<script>
export default {
  props: {
    item: {},
  },

  data: () => ({
    error: "",
    showError: false,
    clientSecret: "",
    alipayRedirect: "",
    alipayStatus: "",
    complete: false,
  }),

  created() {
    const stripe = window.Stripe("pk_test_kG4TReBTkO6yDfO9mMwtShME00mx65Yyw2");
    // const stripe = window.Stripe("pk_live_FlJcVm7zuiGei0k6IDXksnmy003GNNZuiw");
    this.stripe = stripe;
    stripe
      .createSource({
        type: "alipay",
        amount: this.item.cost_usd * 100,
        currency: "usd",
        metadata: {
          itemID: this.item.cosmetic_id,
          steamID: this.$store.state.auth.userSteamID,
        },
        redirect: {
          // return_url: `https://www.abilityarena.com/alipay_payment?item_id=${this.item.cosmetic_id}`
          return_url: `http://localhost:8080/alipay_payment?item_id=${this.item.cosmetic_id}`,
        },
      })
      .then((result) => {
        if (result.error) {
          this.error = result.error.message;
          this.showError = true;
        } else {
          const source = result.source;
          this.clientSecret = source.client_secret;
          this.alipayRedirect = source.redirect.url;
          this.alipayStatus = source.status;
          this.complete = true;
        }
      });
  },

  methods: {
    goToAlipay() {
      window.location.href = this.alipayRedirect;
    },
  },
};
</script>

<style>
</style>