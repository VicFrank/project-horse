<template>
  <div id="app">
    <Header />
    <div class="main-layout" :key="loggedIn">
      <Sidebar />
      <div
        @click="onMainContentClicked"
        v-bind:class="{ 'sidebar-open': sidebarOpen, 'neutral-div': true }"
      >
        <div class="main-content">
          <div class="main-layout__content">
            <div class="content">
              <router-view class="container" />
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
import Sidebar from "./components/utility/Sidebar.vue";
import Footer from "./components/utility/Footer.vue";
export default {
  name: "App",
  components: {
    Header,
    Sidebar,
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
    fetch("/api/auth/steam/success", { credentials: "include" })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          // const { photos, id, isAdmin } = res.user;

          // this.$store.commit({
          //   type: "setUser",
          //   steamID: id,
          //   picture: photos[2].value,
          //   isAdmin
          // });

          this.$store.dispatch("refreshPlayer");
        } else {
          this.$store.commit({
            type: "setNotLoggedIn",
          });
        }
      });
  },
};
</script>

<style>
@import "./assets/styles/styles.css";
</style>
