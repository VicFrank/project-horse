<template>
  <div>
    <h1 class="page-title">Connect your Gaimin account</h1>
    <div class="mx-auto text-center" style="max-width: 600px">
      <p>
        Download the Gaimin app and create an account to get Plus for free!
        Gaiman is a platform that runs in the background to monetize your unused
        computational resources and earn GMRX tokens.
      </p>
      <template v-if="!loggedIn">
        <p>Login with steam to connect your gaimin account</p>
        <LoginButton class="mx-auto" style="max-width: 300px"></LoginButton>
      </template>
      <template v-else>
        <template v-if="!hasCode">
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
          <div v-if="checkingCode">Validating...</div>
          <div v-if="!checkingCode">
            <div v-if="invalidCode">
              There was an error connecting your Gaimin account. Please try
              again.
            </div>
            <div v-if="!invalidCode">
              Congratulations! Your Ability Arena is now successfully connected
              to your Gaimin account. Enjoy your free Plus.
            </div>
          </div>
        </template>
      </template>
      <div class="mt-1"></div>
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
      checkingCode: true,
      invalidCode: false,
      hasCode: false,
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
  created() {
    const paramsCode = this.$route.query.code;
    const sessionCode = sessionStorage.getItem("gaiminCode");
    if (!this.loggedIn) {
      // store the paramsCode in session storage
      sessionStorage.setItem("gaiminCode", paramsCode);
      return;
    }
    const code = paramsCode || sessionCode;
    if (code) this.hasCode = true;
    if (!code) return;
    fetch(`/api/players/${this.steamID}/connect_gaimin`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    })
      .then((res) => res.json())
      .then((res) => {
        this.checkingCode = false;
        if (res.connected) {
          this.invalidCode = false;
        } else {
          this.invalidCode = true;
        }
      });
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
