<template>
  <div>
    <div ref="card"></div>
    <b-button
      variant="primary"
      @click="submitPayment"
      :disabled="!paymentIntent || !complete"
      class="mt-3"
    >
      {{ $t("store.pay_with_stripe") }}
      <b-spinner
        small
        v-if="awaitingPayment"
        :label="$t('store.loading')"
      ></b-spinner>
    </b-button>
  </div>
</template>

<script>
let card = undefined;
export default {
  props: {
    items: [],
    steamID: {
      type: String,
      required: false,
    },
  },

  data: () => ({
    error: "",
    showError: false,
    complete: false,
    paymentIntent: false,
    clientSecret: "",
    awaitingPayment: false,
    keys: {
      dev: "pk_test_kG4TReBTkO6yDfO9mMwtShME00mx65Yyw2",
      prod: "pk_live_FlJcVm7zuiGei0k6IDXksnmy003GNNZuiw",
    },
  }),

  async created() {
    const isDev = process.env.NODE_ENV == "development";
    const key = isDev ? this.keys.dev : this.keys.prod;
    const stripe = window.Stripe(key);
    this.stripe = stripe;
    const elements = stripe.elements();
    this.paymentIntent = await this.createIntent();
    this.clientSecret = this.paymentIntent.client_secret;
    this.createCardForm(elements);
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

    createCardForm(elements) {
      card = elements.create("card");
      card.mount(this.$refs.card);

      card.on("change", (e) => (this.complete = e.complete));
    },

    async submitPayment() {
      this.awaitingPayment = true;
      const result = await this.stripe.handleCardPayment(
        this.clientSecret,
        card,
        {
          payment_method_data: {},
        }
      );

      if (result.error) {
        console.error(result.error);
        this.$emit("error", result.error);
      } else {
        this.$emit("purchaseSuccess");
      }
    },
  },
};
</script>

<style></style>
