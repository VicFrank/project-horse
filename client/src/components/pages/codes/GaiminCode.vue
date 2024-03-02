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
          There should be a link in the Gaimin app that will sync your account
        </p>
        <b-button
          type="submit"
          variant="primary"
          href="https://www.gaimin.gg/download/steps"
          target="_blank"
          class="mb-3"
          >Download</b-button
        >
      </template>
      <template v-else>
        <LoginButton class="mx-auto" style="max-width: 300px"></LoginButton>
      </template>
    </div>
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
};
</script>

<style></style>
