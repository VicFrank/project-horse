<template>
  <div>
    <h1 class="page-title">Connect your Gaimin account</h1>
    <div class="container text-center" style="max-width: 600px">
      <p>
        Download the Gaimin app and create an account to get Plus for free!
        Gaiman is a platform that runs in the background to monetize your unused
        computational resources and earn GMRX tokens.
      </p>
      <template v-if="loggedIn">
        <p>
          Idk exactly how the connection process is going to work, but imagine
          you have a code you can entere here or something
        </p>
        <b-button
          type="submit"
          variant="primary"
          href="https://www.gaimin.gg/download/steps"
          target="_blank"
          class="mb-3"
          >Download</b-button
        >
        <b-form-input
          type="text"
          v-model="code"
          style="max-width: 200px"
          class="m-auto"
        ></b-form-input>
        <b-button
          :disabled="!code"
          type="submit"
          variant="primary"
          @click="redeemCode"
          class="my-3"
          >Redeem</b-button
        >
      </template>
      <template v-else>
        <LoginButton class="mx-auto" style="max-width: 300px"></LoginButton>
      </template>
    </div>

    <b-modal
      id="success-modal"
      title="Success"
      :ok-label="$t('common.close')"
      ok-only
    >
      <p>
        Successfully connected your account! Plus has been added to your account
        for free.
      </p>
    </b-modal>
    <b-modal
      id="failure-modal"
      title="Failed to redeem code"
      :ok-label="$t('common.close')"
      ok-only
    >
      <p>{{ error }}</p>
    </b-modal>
  </div>
</template>

<script>
import LoginButton from "../../utility/LoginButton.vue";

export default {
  components: {
    LoginButton,
  },

  data() {
    return {
      code: "",
      error: "",
    };
  },
  computed: {
    steamID() {
      return this.$store.state.auth.userSteamID;
    },
    loggedIn() {
      return this.$store.getters.loggedIn;
    },
  },
  methods: {
    redeemCode() {
      fetch(`/api/players/${this.steamID}/redeem_code/${this.code}`, {
        method: "post",
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            this.$bvModal.show("success-modal");
            this.$store.dispatch("REFRESH_PLAYER");
          } else {
            this.error = res.message;
            this.$bvModal.show("failure-modal");
          }
        });
    },
  },
};
</script>

<style></style>
