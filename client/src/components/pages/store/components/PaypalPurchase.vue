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
    items: [],
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
    const isDev = process.env.NODE_ENV == "development";
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
      const costUSD =
        Math.round(
          this.items.reduce((acc, item) => {
            return acc + item.cost_usd;
          }, 0) * 100
        ) / 100;

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
                    value: costUSD,
                  },
                },
              ],
              application_context: { shipping_preference: "NO_SHIPPING" },
            });
          },
          onApprove: (data) => {
            _this.processingPayment = true;
            return fetch(`/api/payments/paypal/${steamID}`, {
              method: "post",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify({
                orderID: data.orderID,
                cosmeticIDs: this.items.map((item) => item.cosmetic_id),
                paypalType,
              }),
            })
              .then((res) => res.json())
              .then((res) => {
                _this.processingPayment = false;
                if (res.message === "Payment Success") {
                  _this.$store.dispatch("REFRESH_PLAYER");
                  _this.$emit("purchaseSuccess");
                } else {
                  console.error(res.message);
                  _this.$emit("purchaseError", res.message);
                }
              })
              .catch((err) => {
                _this.processingPayment = false;
                console.error(err);
                _this.$emit("purchaseError", err);
              });
          },
          onError: (err) => {
            console.error(err);
            _this.$emit("purchaseError", err);
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
