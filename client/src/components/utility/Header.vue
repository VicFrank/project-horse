<template>
  <header id="main-nav">
    <nav class="navbar navbar-expand-lg">
      <div class="d-flex align-items-center">
        <SidebarToggle class="navbar-nav mr-1"></SidebarToggle>
        <router-link to="/" class="navbar-brand">
          <img src="../../assets/images/logo.png" alt="POG" />
        </router-link>
      </div>
      <ul class="navbar-nav mx-auto flex-row d-none d-lg-flex text-uppercase">
        <li class="nav-item mr-2">
          <router-link class="nav-link" to="/games">
            {{ $t("navigation.games") }}
          </router-link>
        </li>
        <li class="nav-item mr-2">
          <router-link class="nav-link" to="/store">
            {{ $t("navigation.store") }}
          </router-link>
        </li>
        <b-nav-item-dropdown text="STATS" class="mx-2">
          <b-dropdown-item to="/leaderboard">
            {{ $t("navigation.leaderboard") }}
          </b-dropdown-item>
          <b-dropdown-item to="/gods">
            {{ $t("navigation.gods") }}
          </b-dropdown-item>
          <b-dropdown-item to="/abilities">
            {{ $t("navigation.abilities") }}
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <li class="nav-item mx-2">
          <router-link class="nav-link" to="/changelog">
            {{ $t("navigation.change_log") }}
          </router-link>
        </li>
        <!-- <li class="nav-item ml-2">
          <router-link class="nav-link" to="/credits">
            {{ $t("navigation.credits") }}
          </router-link>
        </li> -->
      </ul>
      <div class="d-flex align-items-center">
        <div class="d-flex align-items-center">
          <!-- <div>
            <b-button
              class="d-none d-md-flex mr-3"
              href="#"
              target="_blank"
              variant="secondary"
              v-t="'navigation.report_a_bug'"
            ></b-button>
          </div> -->
          <div>
            <b-button
              class="d-none d-md-flex"
              href="#"
              target="_blank"
              variant="primary"
              v-t="'navigation.play_now'"
            ></b-button>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import SidebarToggle from "./SidebarToggle.vue";

export default {
  components: {
    SidebarToggle,
  },

  data: () => ({ langs: ["en", "ru", "cn"], selected: null }),

  created() {
    const lang = this.$route.query.lang;
    if (this.langs.includes(lang)) {
      this.$root._i18n._vm.locale = lang.toLowerCase();
    }
  },
};
</script>

<style scoped>
.btn-sm {
  padding: 0.25rem !important;
  font-size: 0.65rem !important;
  border-radius: 0.2rem !important;
}
</style>
