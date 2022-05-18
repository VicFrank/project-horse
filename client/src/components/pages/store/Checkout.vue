<template>
  <div>
    <h1 class="page-title" v-t="'store.checkout_title'"></h1>
    <div class="container text-center">
      <b-button to="/store" class="mb-3">{{
        $t("store.back_to_store")
      }}</b-button>

      <div>
        Hi, this is still a work in progress, don't actually try to buy anything
        lmao
      </div>

      <h3>{{ item.cosmetic_name }}</h3>
      <div class="text-muted">${{ item.cost_usd }}</div>

      <template v-if="loggedIn">
        <div v-if="loading" class="d-flex justify-content-center mb-3">
          <b-spinner label="Loading..."></b-spinner>
        </div>
        <b-card v-else class="mt-3" style="max-width: 300px; margin: auto">
          <StripePurchase
            class="my-3"
            :item="item"
            v-on:purchaseSuccess="onPurchaseSuccess"
            v-on:error="onError"
          />
          <StripeAlipay :item="item" class="mb-3" />
          <PaypalPurchase
            :item="item"
            :paypalType="paypalType"
            v-on:purchaseSuccess="onPurchaseSuccess"
          />
          <b-alert v-model="showError" variant="danger" dismissible>{{
            error
          }}</b-alert>
        </b-card>
      </template>
      <template v-else>
        <LoginButton></LoginButton>
      </template>
    </div>
  </div>
</template>

<script>
import LoginButton from "../../utility/LoginButton.vue";
import StripePurchase from "./components/StripePurchase.vue";
import StripeAlipay from "./components/StripeAlipay.vue";
import PaypalPurchase from "./components/PaypalPurchase.vue";

export default {
  components: {
    LoginButton,
    StripePurchase,
    StripeAlipay,
    PaypalPurchase,
  },

  data() {
    return {
      item: {},
      error: "",
      showError: false,
      loading: true,
    };
  },

  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn;
    },
    paypalType() {
      return this.item.cost_usd < 12 ? "cheap" : "expensive";
    },
  },

  methods: {
    onPurchaseSuccess() {
      this.$router.push("/payment_success");
    },
    onError(error) {
      this.error = error;
      this.showError = true;
    },
  },

  created() {
    fetch(`/api/cosmetics/${this.$route.params.item_id}`)
      .then((res) => res.json())
      .then((item) => {
        if (item) {
          this.item = item;
          this.loading = false;
        } else {
          this.error = "Invalid Item";
          this.showError = true;
          this.$router.push("/store");
        }
      })
      .catch((err) => {
        this.showError = true;
        this.error = err;
      });
  },
};
</script>

<style>
</style>