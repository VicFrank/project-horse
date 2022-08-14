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
    items: [],
  },

  data: () => ({
    error: "",
    showError: false,
    clientSecret: "",
    alipayRedirect: "",
    alipayStatus: "",
    complete: false,
    keys: {
      dev: "pk_test_kG4TReBTkO6yDfO9mMwtShME00mx65Yyw2",
      prod: "pk_live_FlJcVm7zuiGei0k6IDXksnmy003GNNZuiw",
    },
  }),

  created() {
    const isDev = process.env.NODE_ENV == "development";
    const key = isDev ? this.keys.dev : this.keys.prod;
    const stripe = window.Stripe(key);
    this.stripe = stripe;
    const rootUrl = isDev
      ? "http://localhost:8080"
      : "https://www.abilityarena.com";
    let amount = this.items.reduce((acc, item) => {
      return acc + item.cost_usd * 100;
    }, 0);
    amount = Math.round(amount);
    stripe
      .createSource({
        type: "alipay",
        amount,
        currency: "usd",
        metadata: {
          cosmeticIDs: this.items.map((item) => item.cosmetic_id),
          steamID: this.$store.state.auth.userSteamID,
        },
        redirect: {
          return_url: `${rootUrl}/alipay_payment?item_id=${this.$route.params.item_ids}`,
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