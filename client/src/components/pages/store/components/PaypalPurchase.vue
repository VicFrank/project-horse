<template>
  <div>
    <b-alert v-model="showError" variant="danger" dismissible>{{
      error
    }}</b-alert>
    <b-alert v-model="showSuccess" variant="success" dismissible>{{
      success
    }}</b-alert>
    <div v-if="processingPayment">
      {{ $t("store.processing") }}
      <div v-if="loading" class="d-flex justify-content-center mb-3">
        <b-spinner label="Loading..."></b-spinner>
      </div>
    </div>
    <div v-else class="paypal-container" ref="paypal"></div>
  </div>
</template>

<script>
export default {
  props: {
    item: {},
    paypalType: String,
  },

  data() {
    return {
      error: "",
      showError: false,
      success: "",
      showSuccess: false,
      processingPayment: false,
      loading: false,
      credentials: null,
      keys: {
        dev: {
          cheap:
            "AYAmQijTIaUAckei3KBH9rJh7Vea0lmIuUZclFx5RWUfhaG6OfcG7w_IOZclheI431gFF0ETdwfhnWbU",
          expensive:
            "AYAmQijTIaUAckei3KBH9rJh7Vea0lmIuUZclFx5RWUfhaG6OfcG7w_IOZclheI431gFF0ETdwfhnWbU",
        },
        prod: {
          cheap:
            "AZJSuJyzSWP6mBtWjYUohMjjdj7NaMFacv7MAIhCG5Bjm12tmkoeYkJwwPxPh1ZPqXROCJAxpFM7M3wY",
          expensive:
            "ARyCiFJGaPqBv5V0OJNPloAOgwUDp-YOu2cLtrp8fdTLlpBCaIfbXhnFHfVuMylXG9iyPaKCw2SR2D4",
        },
      },
    };
  },

  mounted() {
    const isDev = window.webpackHotUpdate;
    this.credentials = isDev ? this.keys.dev : this.keys.prod;
    const script = document.createElement("script");
    const clientID =
      this.paypalType === "cheap"
        ? this.credentials.cheap
        : this.credentials.expensive;
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientID}`;
    script.addEventListener("load", this.setLoaded);
    document.body.appendChild(script);
  },

  methods: {
    setLoaded() {
      // "this" doesn't work in window.paypal because javascript sucks
      const steamID = this.$store.state.auth.userSteamID;
      const itemID = this.item.cosmetic_id;
      const cost_usd = this.item.cost_usd;
      const paypalType = this.paypalType;
      const _this = this;
      window.paypal
        .Buttons({
          style: {
            size: "small",
            color: "gold",
            shape: "pill",
            label: "checkout",
            layout: "horizontal",
          },
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    currency_code: "USD",
                    value: cost_usd,
                  },
                },
              ],
              application_context: { shipping_preference: "NO_SHIPPING" },
            });
          },
          onApprove: function (data) {
            _this.processingPayment = true;
            return fetch(`/api/payments/paypal/${steamID}`, {
              method: "post",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify({
                orderID: data.orderID,
                itemID,
                paypalType,
              }),
            })
              .then((res) => res.json())
              .then((res) => {
                _this.processingPayment = false;
                if (res.message === "Payment Success") {
                  _this.$store.dispatch("refreshPlayer");
                  _this.$emit("purchaseSuccess");
                } else {
                  _this.error = res.message;
                  _this.showError = true;
                }
              })
              .catch((err) => {
                _this.processingPayment = false;
                _this.error = err;
                _this.showError = true;
              });
          },
          onError: (err) => {
            _this.showError = true;
            _this.error = err;
          },
        })
        .render(this.$refs.paypal);
    },
  },
};
</script>

<style scoped>
.purchase-preview {
  width: 200px;
  height: 200px;
}

.paypal-container {
  max-width: 200px;
  margin: auto;
}

.payment-card {
  max-width: 400px;
  margin: auto;
}

.card {
  color: black !important;
}

.card-footer {
  height: 100% !important;
}
</style>
