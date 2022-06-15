<template>
  <div class="main-layout__content">
    <div class="content">
      <div class="container text-center">
        <h1 class="blue" v-t="'store.payment_success'"></h1>
        <h6 v-t="'store.success_1'"></h6>
        <h6 v-t="'store.success_2'"></h6>
        <b-button to="store" variant="primary" class="mt-3">{{
          $t("store.back_to_store")
        }}</b-button>
        <div>
          <b-button to="profile/armory" variant="primary" class="mt-3">{{
            $t("store.to_armory")
          }}</b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
