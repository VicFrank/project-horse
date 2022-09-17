<template>
  <div>
    <h1 class="page-title" v-t="'store.checkout_title'"></h1>
    <div class="container text-center">
      <b-alert v-model="showGeneralError" variant="danger" dismissible>{{
        generalError
      }}</b-alert>

      <div v-for="item in items" :key="item.cosmetic_id" class="item-card">
        <div class="item-card-img">
          <img
            v-bind:src="cosmeticImageSrc(item)"
            :alt="item.cosmetic_name"
            class="preview-image"
          />
        </div>
        <div class="item-card-body">
          <div class="mb-2 text-muted">
            {{ $t(`cosmetics.${item.cosmetic_name}`) }}
          </div>
          <strong>${{ item.cost_usd }}</strong>
        </div>
      </div>
      <!-- subtotal  -->
      <div class="item-card text-align-right">
        <div class="item-card-body">
          <div v-if="totalXp != 0" class="mb-2">
            <span class="mr-2">{{ $t("store.totalXp") }}</span>
            <strong>{{ totalXp }}</strong>
          </div>
          <div>
            <span class="mr-2">{{ $t("store.subtotal") }}</span>
            <strong>${{ totalCost }}</strong>
          </div>
        </div>
      </div>

      <template v-if="containsPurchasedBattlePass">
        <div>You have already upgraded your battle pass!</div>
      </template>
      <template v-else>
        <template v-if="loggedIn && validPurchase">
          <div v-if="loading" class="d-flex justify-content-center mb-3">
            <b-spinner label="Loading..."></b-spinner>
          </div>
          <b-card v-else class="mt-3" style="max-width: 300px; margin: auto">
            <StripePurchase
              class="my-3"
              :items="items"
              v-on:purchaseSuccess="onPurchaseSuccess"
              v-on:error="onError"
            />
            <StripeAlipay :items="items" class="mb-3" />
            <PaypalPurchase
              :items="items"
              :paypalType="paypalType"
              v-on:purchaseSuccess="onPurchaseSuccess"
              v-on:purchaseError="onError"
            />
            <b-alert v-model="showError" variant="danger" dismissible>{{
              error
            }}</b-alert>
          </b-card>
        </template>
        <template v-else>
          <template v-if="validPurchase">
            <LoginButton></LoginButton>
          </template>
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
      items: [],
      error: "",
      showError: false,
      showGeneralError: false,
      generalError: "",
      loading: true,
      validPurchase: true,
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
      const totalCost = this.items.reduce((acc, item) => {
        return acc + item.cost_usd;
      }, 0);
      return totalCost < 12 ? "cheap" : "expensive";
    },
    totalCost() {
      return this.items
        .reduce((acc, item) => {
          return acc + item.cost_usd;
        }, 0)
        .toLocaleString();
    },
    totalXp() {
      return this.items
        .reduce((acc, item) => {
          if (item.cosmetic_name.startsWith("buy_xp_")) {
            const xp = Number(item.cosmetic_name.slice(7));
            return acc + xp;
          }
          return acc;
        }, 0)
        .toLocaleString();
    },
    containsPurchasedBattlePass() {
      return (
        this.$store.getters.bpUpgraded &&
        this.items.some((item) => item.cosmetic_name === "buy_bp")
      );
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
      const { cosmetic_name } = cosmetic;
      return `/images/cosmetics/${cosmetic_name}.png`;
    },
  },

  created() {
    const cosmeticIDs = this.$route.params.item_ids.split("/");
    fetch(`/api/cosmetics/get_cosmetics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cosmeticIDs }),
    })
      .then((res) => res.json())
      .then((data) => {
        this.loading = false;

        if (data.some((item) => item.cost_usd <= 0)) {
          this.generalError =
            "Trying to purchase an invalid item (not purchaseable)";
          this.showGeneralError = true;
          this.validPurchase = false;
        }
        if (data.some((item) => !item.cosmetic_id)) {
          this.generalError = "Invalid item(s)!";
          this.showGeneralError = true;
          this.validPurchase = false;
        }
        this.items = data;
      })
      .catch(() => {
        this.error = "Error loading cosmetic data";
        this.showError = true;
        this.loading = false;
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