<template>
  <div id="app">
    <Header />
    <div class="main-layout" :key="loggedIn">
      <div class="sidebar-open neutral-div">
        <div class="main-content">
          <div class="main-layout__content">
            <div class="content">
              <router-view class="container" style="overflow-x: auto" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  </div>
</template>

<script>
import Header from "./components/utility/Header.vue";
import Footer from "./components/utility/Footer.vue";
export default {
  name: "App",
  components: {
    Header,
    Footer,
  },
  computed: {
    isRoot() {
      return this.$route.path === "/";
    },
    sidebarOpen() {
      return this.$store.state.ui.sidebarOpen;
    },
    loggedIn() {
      return this.$store.state.auth.loggedIn;
    },
  },
  methods: {
    onMainContentClicked() {
      if (this.sidebarOpen && window.innerWidth < 1600)
        this.$store.dispatch("toggleSidebar");
    },
  },
  created() {
    const chineseLocales = ["zh-CN", "zh-TW", "zh-HK", "zh"];
    const useChinese = chineseLocales.includes(navigator.language);
    if (useChinese) {
      this.$i18n.locale = "cn";
      this.$store.dispatch("setLanguage", "cn");
    }

    fetch("/api/auth/steam/success", { credentials: "include" })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          const { photos, id, isAdmin, displayName, userType } = res.user;

          this.$store.commit({
            type: "SET_USER",
            steamID: id,
            username: displayName,
            picture: photos[2].value,
            isAdmin,
            userType,
          });

          this.$store.dispatch("REFRESH_PLAYER");
          this.$store.dispatch("REFRESH_BATTLE_PASS");
        } else {
          this.$store.commit({
            type: "LOG_OUT",
          });
        }
      });
  },
  beforeUnmount() {
    this.unwatch();
  },
};
</script>

<style>
@import "./assets/styles/styles.css";
</style>
