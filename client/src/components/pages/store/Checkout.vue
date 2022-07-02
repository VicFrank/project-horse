<template>
  <div>
    <h1 class="page-title" v-t="'store.checkout_title'"></h1>
    <div class="container text-center">
      <div class="item-card">
        <div class="item-card-img">
          <img
            v-bind:src="cosmeticImageSrc(item)"
            :alt="item.cosmetic_name"
            class="preview-image"
          />
        </div>
        <div class="item-card-body">
          <div class="mb-2">{{ $t(`cosmetics.${item.cosmetic_name}`) }}</div>
          <div class="text-muted">${{ item.cost_usd }}</div>
        </div>
      </div>

      <template v-if="item.cosmetic_name === 'buy_bp'" && bpUpgraded>
        <div>You have already upgraded your battle pass!</div>
      </template>
      <template v-else>
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
      </template>
    </div>

    <div class="text-center mt-4">
      <b-button class="mx-auto" to="/store">{{
        $t("store.back_to_store")
      }}</b-button>
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
    bpUpgraded() {
      return this.$store.getters.bpUpgraded;
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
    cosmeticImageSrc(cosmetic) {
      const { cosmetic_name, cosmetic_type } = cosmetic;
      const includedTypes = [
        "Card Frame",
        "Chest",
        "Finisher",
        "Consumable",
        "Game Consumable",
      ];
      if (includedTypes.includes(cosmetic_type))
        return require(`../../../assets/images/cosmetics/${cosmetic_name}.png`);
      else return require(`../../../assets/images/cosmetics/placeholder.png`);
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

<style scoped>
.preview-image {
  width: 100%;
}

.item-card {
  width: 300px;
  display: flex;
  align-items: center;

  background-color: #f5f5f5;
  border-radius: 5px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
  margin: auto;
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 10px;
}

.item-card-img {
  width: 200px;
  height: auto;
}

.item-card-body {
  width: 100%;
  text-align: right;
  color: #333;
}
</style>