<template>
  <div class="main-layout__content">
    <div class="content">
      <h1 class="page-title" v-t="'store.alipay_title'"></h1>
      <div class="container text-center">
        <div v-if="status === 'failed'">
          <div>{{ $t("store.payment_issue") }}</div>
          <b-button to="store" variant="primary" class="mt-3">{{
            $t("store.back_to_store")
          }}</b-button>
        </div>
        <div v-else-if="status !== 'consumed'">
          {{ $t("store.waiting_for_process") }}
        </div>
        <div v-else>
          <div>
            {{ $t("store.payment_success") }}
            {{ $t(`cosmetics.${item.cosmetic_name}`) }}
            {{ $t("store.added_to_account") }}
          </div>
          <b-button to="store" variant="primary" class="mt-3">{{
            $t("store.back_to_store")
          }}</b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    source: String,
    livemode: String,
    clientSecret: String,
    itemID: String,
  },

  data: () => ({
    error: "",
    showError: false,
    item: {},
    MAX_POLL_COUNT: 10,
    pollCount: 0,
    status: "",
  }),

  created() {
    const stripe = window.Stripe("pk_test_kG4TReBTkO6yDfO9mMwtShME00mx65Yyw2");
    // const stripe = window.Stripe("pk_live_FlJcVm7zuiGei0k6IDXksnmy003GNNZuiw");
    this.stripe = stripe;

    this.pollForSourceStatus();
  },

  methods: {
    pollForSourceStatus() {
      this.stripe
        .retrieveSource({
          id: this.source,
          client_secret: this.clientSecret,
        })
        .then((result) => {
          const source = result.source;
          this.status = source.status;
          if (
            (source.status === "chargeable" || source.status === "pending") &&
            this.pollCount < this.MAX_POLL_COUNT
          ) {
            // Try again in a second, if the Source is still `pending`:
            this.pollCount += 1;
            setTimeout(this.pollForSourceStatus, 1000);
          } else if (source.status === "consumed") {
            // Payment success
            this.$store.dispatch("refreshPlayer");
          } else {
            // We've timed out or failed
            this.status = "failed";
          }
        });
    },
  },
};
</script>

<style>
</style>