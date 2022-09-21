<template>
  <header
    id="main-nav"
    style="background-image: url('/images/site/top_nav_bg.png')"
  >
    <nav class="navbar navbar-expand-lg">
      <div class="d-flex align-items-center">
        <router-link to="/" class="navbar-brand">
          <img
            style="height: 40px"
            class="ml-2"
            src="/images/site/ability_arena_logo_nav.png"
            alt="Ability Arena"
          />
        </router-link>
      </div>
      <ul class="navbar-nav flex-row d-flex text-uppercase mt-2">
        <b-nav-item-dropdown
          :text="$t('navigation.my_profile')"
          class="mx-2 my-profile-dropdown"
          v-if="loggedIn"
        >
          <template #button-content>
            {{ $t("navigation.my_profile") }}
            <b-badge
              v-if="totalAlerts > 0"
              style="background-color: #523c88"
              class="ml-1"
            >
              {{ totalAlerts }}
              <span class="sr-only">Unclaimed Quests</span>
            </b-badge>
          </template>
          <b-dropdown-item to="/profile" exact-active-class="active-link">
            <img src="/images/icons/profile.png" class="link-icon" />
            {{ $t("navigation.profile") }}
            <b-badge
              v-if="numQuests > 0"
              style="background-color: #523c88"
              class="ml-1"
            >
              {{ numQuests }}
              <span class="sr-only">Unclaimed Quests</span>
            </b-badge>
          </b-dropdown-item>
          <b-dropdown-item
            to="/profile/battlepass"
            exact-active-class="active-link"
          >
            <img src="/images/icons/book.svg" class="link-icon" />
            {{ $t("navigation.battle_pass") }}
            <b-badge
              v-if="unclaimedBPRewards > 0"
              style="background-color: #523c88"
              class="ml-1"
            >
              {{ unclaimedBPRewards }}
              <span class="sr-only">Unclaimed Battle Pass Rewards</span>
            </b-badge>
          </b-dropdown-item>
          <b-dropdown-item
            to="/profile/armory"
            exact-active-class="active-link"
          >
            <img src="/images/icons/columns.svg" class="link-icon" />
            {{ $t("navigation.armory") }}
            <b-badge
              v-if="unopenedChests > 0"
              style="background-color: #523c88"
              class="ml-1"
            >
              {{ unopenedChests }}
              <span class="sr-only">Unopened Chests</span>
            </b-badge>
          </b-dropdown-item>
          <b-dropdown-item to="/profile/gods" exact-active-class="active-link">
            <img src="/images/icons/newspaper-solid.svg" class="link-icon" />
            {{ $t("navigation.gods") }}
          </b-dropdown-item>
          <b-dropdown-item
            to="/profile/achievements"
            exact-active-class="active-link"
            v-if="isAdmin"
          >
            <img src="/images/icons/gift.svg" class="link-icon" />
            {{ $t("navigation.achievements") }}
            <b-badge
              v-if="numAchievements > 0"
              style="background-color: #523c88"
              class="ml-1"
            >
              {{ numAchievements }}
              <span class="sr-only">Unclaimed Achievements</span>
            </b-badge>
          </b-dropdown-item>
          <b-dropdown-item to="/profile/games" exact-active-class="active-link">
            <img src="/images/icons/history.svg" class="link-icon" />
            {{ $t("navigation.match_history") }}
          </b-dropdown-item>
          <b-dropdown-item to="/profile/stats" exact-active-class="active-link">
            <img src="/images/icons/chart-bar.svg" class="link-icon" />
            {{ $t("navigation.my_stats") }}
          </b-dropdown-item>
          <b-dropdown-item
            v-if="isAdmin"
            to="/admin"
            exact-active-class="active-link"
          >
            <img src="/images/icons/cog.svg" class="link-icon" />
            {{ $t("navigation.admin") }}
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <li class="nav-item mr-2">
          <router-link
            class="nav-link"
            to="/store"
            exact-active-class="active-link"
          >
            <img src="/images/coin1.png" class="coins-img" alt="Gold" />
            {{ $t("navigation.store") }}
          </router-link>
        </li>
        <b-nav-item-dropdown text="GAME" class="mx-2 d-none d-sm-block">
          <b-dropdown-item exact-active-class="active-link" to="/games">
            {{ $t("navigation.matches") }}
          </b-dropdown-item>
          <b-dropdown-item to="/leaderboard" exact-active-class="active-link">
            {{ $t("navigation.leaderboard") }}
          </b-dropdown-item>
          <b-dropdown-item exact-active-class="active-link" to="/tournaments">
            {{ $t("navigation.tournaments") }}
          </b-dropdown-item>
          <b-dropdown-item exact-active-class="active-link" to="/changelog">
            {{ $t("navigation.change_log") }}
          </b-dropdown-item>
          <b-dropdown-item
            v-if="isAdmin"
            to="/gods"
            exact-active-class="active-link"
          >
            {{ $t("navigation.gods") }}
          </b-dropdown-item>
          <b-dropdown-item
            v-if="isAdmin"
            to="/abilities"
            exact-active-class="active-link"
          >
            {{ $t("navigation.abilities") }}
          </b-dropdown-item>
        </b-nav-item-dropdown>
      </ul>
      <div class="d-flex align-items-center ml-auto">
        <div class="d-flex align-items-center" v-if="!loggedIn">
          <div class="mr-2">
            <LoginButton></LoginButton>
          </div>
          <div>
            <a
              role="button"
              tabindex="0"
              href="https://steamcommunity.com/sharedfiles/filedetails/?id=2865676075"
              target="_blank"
              class="d-none d-md-flex mr-3 play-button btn"
              style="background-image: url('/images/site/play_button_pink.png')"
            >
              {{ $t("navigation.play_now") }}
            </a>
          </div>
        </div>
        <div class="d-flex" style="list-style: none" v-if="loggedIn">
          <b-nav-item-dropdown class="username-dropdown" v-if="loggedIn">
            <template #button-content
              ><img
                :src="profilePicture"
                class="profile-picture"
                alt="Profile Picture"
              />{{ username }}</template
            >
            <a
              href="/api/auth/logout"
              class="btn sign-out-button"
              variant="outline-primary"
              v-t="'navigation.sign_out'"
            ></a>
          </b-nav-item-dropdown>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import LoginButton from "./LoginButton";

export default {
  components: {
    LoginButton,
  },

  data: () => ({ langs: ["en", "ru", "cn"], selected: null }),

  created() {
    const lang = this.$route.query.lang;
    if (this.langs.includes(lang)) {
      this.$root._i18n._vm.locale = lang.toLowerCase();
    }
  },

  computed: {
    username() {
      return this.$store.state.auth.username;
    },
    profilePicture() {
      return this.$store.state.auth.profilePictureLink;
    },
    loggedIn() {
      return this.$store.getters.loggedIn;
    },
    isAdmin() {
      return this.$store.getters.isAdmin;
    },
    numAchievements() {
      return this.$store.state.auth.achievementsToClaim;
    },
    numQuests() {
      return this.$store.state.auth.questsToClaim;
    },
    unopenedChests() {
      return this.$store.state.auth.unopenedChests;
    },
    unclaimedBPRewards() {
      return this.$store.state.auth.unclaimedBPRewards;
    },
    totalAlerts() {
      const { questsToClaim, unopenedChests, unclaimedBPRewards } =
        this.$store.state.auth;
      return questsToClaim + unopenedChests + unclaimedBPRewards;
    },
  },
};
</script>

<style scoped>
.btn-sm {
  padding: 0.25rem !important;
  font-size: 0.65rem !important;
  border-radius: 0.2rem !important;
}

.play-button {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  text-align: center;
}

.play-button:hover {
  color: #fff;
  filter: brightness(1.2);
}

.link-icon {
  height: 16px;
  width: 16px;
  margin-right: 5px;
}

.profile-picture {
  height: 32px;
  width: 32px;
  margin-right: 5px;
}

.sign-out-button {
  border-color: var(--primary-color);
}

.coins-img {
  width: 16px;
  height: 16px;
  margin-bottom: 2px;
}
</style>
