<template>
  <div>
    <b-button
      variant="primary"
      @click="submit"
      :disabled="!paymentIntent"
      class="mt-3"
    >
      {{ $t("store.pay_with_wechat") }}
      <b-spinner
        small
        v-if="awaitingPayment"
        :label="$t('store.loading')"
      ></b-spinner>
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
    steamID: {
      type: String,
      required: false,
    }
  },

  data: () => ({
    error: "",
    showError: false,
    complete: false,
    paymentIntent: false,
    clientSecret: "",
    awaitingPayment: false,
    qrCodeURL: null,
    keys: {
      dev: "pk_test_kG4TReBTkO6yDfO9mMwtShME00mx65Yyw2",
      prod: "pk_live_FlJcVm7zuiGei0k6IDXksnmy003GNNZuiw",
    },
  }),

  async created() {
    const isDev = process.env.NODE_ENV == "development";
    const key = isDev ? this.keys.dev : this.keys.prod;
    this.stripe = window.Stripe(key);
    this.paymentIntent = await this.createIntent();
    this.clientSecret = this.paymentIntent.client_secret;
  },

  computed: {
    userSteamID() {
      return this.steamID ?? this.$store.state.auth.userSteamID;
    },
  },

  methods: {
    async createIntent() {
      const url = "/api/payments/stripe/intents";
      // stripe amounts are in cents
      let amount = this.items.reduce((acc, item) => {
        return acc + item.cost_usd * 100;
      }, 0);
      amount = Math.round(amount);
      const params = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          cosmeticIDs: this.items.map((item) => item.cosmetic_id),
          steamID: this.userSteamID,
        }),
      };
      const intent = await fetch(url, params);

      if (!intent.ok) {
        const error = await intent.json();
        this.$emit("error", error.message);
        return;
      }

      return intent.json();
    },

    async submit() {
      this.awaitingPayment = true;
      const { error, paymentIntent } =
        await this.stripe.confirmWechatPayPayment(this.clientSecret, {
          payment_method_options: {
            wechat_pay: {
              client: "web",
            },
          },
        });

      if (error) {
        console.error(error);
        this.$emit("error", error);
      } else {
        this.qrCodeURL =
          paymentIntent.next_action.wechat_pay_display_qr_code.image_data_url;
      }
    },
  },
};
</script>

<style></style>
