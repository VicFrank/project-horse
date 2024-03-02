<template>
  <div>
    <div class="mx-auto text-center" style="max-width: 600px">
      <template v-if="!loggedIn">
        <p>
          Login with steam, then return to this page to sync your Gaimin Account
        </p>
        <LoginButton class="mx-auto" style="max-width: 300px"></LoginButton>
      </template>
      <template v-else>
        <div v-if="checkingCode">Connecting to Gaimin...</div>
        <div v-if="!checkingCode">
          <div v-if="invalidCode">
            {{ invalidCodeMessage }}
          </div>
          <div v-if="!invalidCode">
            Congratulations! Your Ability Arena is now successfully connected to
            your Gaimin account. Enjoy your free Plus.
          </div>
        </div>
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
      invalidCodeMessage: "",
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
    const playerToken = this.$route.query.playerToken;
    if (!playerToken) return this.$router.push("/connect_gaimin");

    fetch(`/api/players/${this.steamID}/connect_gaimin`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ playerToken }),
    })
      .then((res) => res.json())
      .then((res) => {
        this.checkingCode = false;
        if (res.connected) {
          this.invalidCode = false;
        } else {
          this.invalidCode = true;
          this.invalidCodeMessage = res.message;
        }
      });
  },
};
</script>

<style></style>
