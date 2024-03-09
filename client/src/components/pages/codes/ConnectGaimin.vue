<template>
  <div>
    <div class="container mb-3" style="">
      <div class="row">
        <div class="col-lg-5">
          <!-- box using gaimin_panel_box as background image -->
          <div class="gaimin-panel-box">
            <p class="color-primary" style="padding-top: 150px">
              PARTNERSHIP WITH GAIMIN.GG
            </p>
            <p class="text-muted">
              We have partenered with Gaimin.GG to continue supporting this map.
              Part of this partnership includes bringing back monthly
              tournaments. So we are excited to announce the return of community
              tournaments.
            </p>
            <p class="text-muted">
              Each month <span style="color: white">$1,000</span> will be up for
              grabs, so make sure to sign up!
            </p>
            <p class="text-muted">
              Also, get
              <span style="color: #d8af24">Ability Arena Plus</span> for free
              just by connecting your Gaimin.GG account!
            </p>
            <div><a href="#" class="color-primary">READ MORE...</a></div>
          </div>
        </div>
        <div class="col-lg-7">
          <div class="plus-box" style="margin-top: 40px">
            <div>
              <img src="./images/plusicon.png" alt="Plus Icon" />
            </div>
            <div>
              <div class="color-primary mb-2">PLUS offers:</div>
              <ul>
                <li>Unlock spell favoriting</li>
                <li>Access to 25+ PLUS Gods that rotate occasionally</li>
                <li>Tickets to play in monthly $1,000 tournaments</li>
                <li>Unlock a god discard on god selection</li>
                <li>+1 daily quest</li>
                <li>Free daily gold bonus</li>
                <li>Double post-game gold</li>
                <li>1 weekly free MMR double-down</li>
                <li>Ability to mute enemy SFX</li>
                <li>Higher gold per day cap</li>
              </ul>
            </div>
          </div>

          <p class="mt-3">
            Download the Gaimin app and create an account to get it for free!
          </p>
          <p>
            Gaimin is a platform that runs in the background to monetize your
            unused computational resources and earn GMRX tokens (this can be
            toggled off).
          </p>

          <div v-if="!loggedIn">
            <LoginButton style="max-width: 300px"></LoginButton>
          </div>

          <div class="text-muted mt-3 mb-2">STEP 1</div>
          <div>
            <b-button
              type="submit"
              variant="outline-secondary"
              href="https://www.gaimin.gg/download/steps"
              target="_blank"
              class="mb-3"
              >DOWNLOAD GAIMIN.GG
              <img src="./images/external_link_icon.png" />
            </b-button>
            <div class="text-muted mt-1 mb-2">STEP 2</div>
            <div>Navigate to the "Games" section</div>
            <div class="text-muted mt-3 mb-2">STEP 3</div>
            <div>Click "Ability Arena"</div>
            <div class="text-muted mt-3 mb-2">STEP 4</div>
            <div>
              Click the link to connect your account (this will automatically
              activate PLUS)
            </div>
          </div>
        </div>
      </div>
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

<style scoped>
.gaimin-panel-box {
  background-image: url("./images/gaimin_panel_box_with_logos.png");
  background-size: cover;
  padding: 20px;
}

.plus-box {
  display: flex;
  justify-content: flex-start;
  background-color: #1c1634;
  border: 1px solid #504995;
  padding: 20px;
}

li {
  padding: 2px 0;
}

.btn-outline-secondary {
  border-color: #decb07;
  color: #decb07;
}

.btn-outline-secondary:hover {
  background-color: #decb07;
  color: #1c1634;
}

.color-primary {
  color: #8667ca;
}
</style>
