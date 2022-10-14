<template>
  <div>
    <b-button variant="primary" @click="goToWechat" :disabled="!complete"
      >{{ $t("store.pay_with_wechat") }}
    </b-button>
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
    qrCodeUrl: "",
    paymentStatus: "",
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
      : "https://abilityarena.com";
    let amount = this.items.reduce((acc, item) => {
      return acc + item.cost_usd * 100;
    }, 0);
    amount = Math.round(amount);
    const itemIDs = this.$route.params.item_ids;

    stripe
      .createSource({
        type: "wechat",
        amount,
        currency: "usd",
        metadata: {
          cosmeticIDs: JSON.stringify(
            this.items.map((item) => item.cosmetic_id)
          ),
          steamID: this.$store.state.auth.userSteamID,
        },
        redirect: {
          return_url: `${rootUrl}/wechat_payment?item_id=${itemIDs}`,
        },
      })
      .then((result) => {
        console.log(result);
        if (result.error) {
          this.error = result.error.message;
          this.showError = true;
        } else {
          const source = result.source;
          this.clientSecret = source.client_secret;
          this.qrCodeUrl = source.wechat.qr_code_url;
          this.paymentStatus = source.status;
          this.complete = true;
        }
      });
  },

  methods: {
    goToWechat() {
      window.location.href = this.qrCodeUrl;
    },
  },
};
</script>

<style>
</style>