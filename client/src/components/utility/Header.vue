<template>
  <header
    id="main-nav"
    style="
      background-image: url('/images/site/top_nav_bg.png');
      background-repeat: no-repeat;
    "
  >
    <nav class="navbar navbar-expand-lg">
      <router-link to="/" class="navbar-brand">
        <img
          style="height: 40px"
          class="ml-2"
          src="/images/site/ability_arena_logo_nav.png"
          alt="Ability Arena"
        />
      </router-link>
      <ul
        class="navbar-nav flex-row d-none d-lg-flex text-uppercase mt-2 align-items-center"
      >
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
          <!-- <b-dropdown-item
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
          </b-dropdown-item> -->
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
            class="nav-link d-flex"
            to="/store"
            exact-active-class="active-link"
          >
            <img src="/images/coin1.png" class="coins-img" alt="Gold" />
            {{ $t("navigation.store") }}
          </router-link>
        </li>
        <b-nav-item-dropdown text="GAME" class="mx-2">
          <!-- <b-dropdown-item exact-active-class="active-link" to="/games">
            {{ $t("navigation.matches") }}
          </b-dropdown-item> -->
          <b-dropdown-item to="/leaderboard" exact-active-class="active-link">
            {{ $t("navigation.leaderboard") }}
          </b-dropdown-item>
          <b-dropdown-item
            to="/god_leaderboard"
            exact-active-class="active-link"
          >
            {{ $t("navigation.god_leaderboard") }}
          </b-dropdown-item>
          <b-dropdown-item exact-active-class="active-link" to="/tournaments">
            {{ $t("navigation.tournaments") }}
          </b-dropdown-item>
          <b-dropdown-item exact-active-class="active-link" to="/changelog">
            {{ $t("navigation.change_log") }}
          </b-dropdown-item>
          <b-dropdown-item exact-active-class="active-link" to="/faq">
            {{ $t("navigation.faq") }}
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item-dropdown v-if="canSeeStats" text="STATS" class="mx-2">
          <b-dropdown-item
            v-if="canSeeStats"
            to="/stats/games"
            exact-active-class="active-link"
          >
            Games
          </b-dropdown-item>
          <b-dropdown-item
            v-if="canSeeStats"
            to="/gods"
            exact-active-class="active-link"
          >
            {{ $t("navigation.gods") }}
          </b-dropdown-item>
          <b-dropdown-item
            v-if="canSeeStats"
            to="/abilities"
            exact-active-class="active-link"
          >
            {{ $t("navigation.abilities") }}
          </b-dropdown-item>
          <b-dropdown-item
            v-if="canSeeStats"
            to="/bodies"
            exact-active-class="active-link"
          >
            Bodies
          </b-dropdown-item>
          <b-dropdown-item
            v-if="canSeeStats"
            to="/cosmetics"
            exact-active-class="active-link"
          >
            Economy
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item-dropdown :text="$t('navigation.learn')" class="mx-2">
          <b-dropdown-item to="/learn/spells" exact-active-class="active-link">
            {{ $t("navigation.spells") }}
          </b-dropdown-item>
          <b-dropdown-item to="/learn/gods" exact-active-class="active-link">
            {{ $t("navigation.gods") }}
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <li class="mr-2 nav-item">
          <a href="https://news.abilityarena.com/" class="nav-link">
            {{ $t("navigation.news") }}
          </a>
        </li>
        <li class="nav-item">
          <a href="/matchmaking" class="nav-link">
            {{ $t("navigation.matchmaking") }}
          </a>
        </li>
        <li class="ml-2 nav-item">
          <a
            href="https://cardsmith.abilityarena.com/"
            target="_blank"
            class="nav-link"
          >
            Cardsmith
          </a>
        </li>
      </ul>
      <div class="d-flex align-items-center ml-auto">
        <b-dropdown
          size="sm"
          variant="outline-secondary"
          class="mr-2 d-none d-lg-block"
          :text="$t('navigation.language')"
        >
          <b-dropdown-item
            v-for="(lang, i) in langs"
            :key="`Lang${i}`"
            :value="lang"
            @click="
              $i18n.locale = lang;
              $store.dispatch('setLanguage', lang);
            "
            >{{ $t(`navigation.${lang}`) }}</b-dropdown-item
          >
        </b-dropdown>
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
          <div class="d-none d-lg-block mr-2">
            <div class="d-flex align-items-center" style="height: 100%">
              <!-- <div class="d-flex flex-column">
                <img
                  src="/images/battlepass_logo.png"
                  alt="Battle Pass"
                  :class="{ 'profile-image': true, disabled: !bpUpgraded }"
                />
                <span class="custom-badge text-center">{{ bpLevel }}</span>
              </div> -->
              <img
                src="/images/cosmetics/plus.png"
                alt="Plus Badge"
                v-b-tooltip.hover
                :title="
                  hasPlus ? `Plus Expires ${plusExpiration}` : 'Upgrade to Plus'
                "
                :class="{
                  'profile-image': true,
                  'mx-1': true,
                  disabled: !hasPlus,
                }"
              />
              <div
                class="d-flex justify-content-center align-items-center mt-1"
              >
                <img src="/images/coin1.png" class="coins-img" alt="Gold" />
                {{ coins.toLocaleString() }}
              </div>
            </div>
          </div>
          <b-nav-item-dropdown class="username-dropdown" v-if="loggedIn">
            <template #button-content>
              <img
                :src="profilePicture"
                class="profile-picture"
                alt="Profile Picture"
              /><span class="d-none d-sm-inline">{{ username }}</span>
            </template>
            <div class="d-lg-none">
              <div
                class="d-flex justify-content-center align-items-center mx-auto"
                style="width: 75%"
              >
                <!-- <div class="d-flex align-items-center">
                  <img
                    src="/images/battlepass_logo.png"
                    alt="Battle Pass"
                    :class="{ 'profile-image': true, disabled: !bpUpgraded }"
                  />
                </div> -->
                <img
                  src="/images/cosmetics/plus.png"
                  alt="Plus Badge"
                  v-b-tooltip.hover
                  :title="
                    hasPlus
                      ? `Plus Expires ${plusExpiration}`
                      : 'Upgrade to Plus'
                  "
                  :class="{
                    'profile-image': true,
                    'ml-3': true,
                    disabled: !hasPlus,
                  }"
                />
              </div>
              <div class="custom-badge text-center mt-1">{{ bpLevel }}</div>
              <div class="row">
                <ProgressBar
                  class="bp-progress my-1"
                  :progress="progress"
                  :required="required"
                />
              </div>
              <div
                class="d-flex justify-content-center align-items-center mt-1"
              >
                <img src="/images/coin1.png" class="coins-img" alt="Gold" />
                {{ coins.toLocaleString() }}
              </div>
            </div>
            <a
              href="/api/auth/logout"
              class="btn sign-out-button mt-3"
              variant="outline-primary"
              v-t="'navigation.sign_out'"
            ></a>
          </b-nav-item-dropdown>
        </div>
        <button
          class="navbar-toggler d-lg-none ml-2"
          type="button"
          @click="mobileMenuOpen = !mobileMenuOpen"
          :aria-expanded="String(mobileMenuOpen)"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>
    </nav>

    <!-- Mobile Navigation -->
    <transition name="slide-down">
      <div v-if="mobileMenuOpen" class="mobile-nav d-lg-none">
        <ul class="list-unstyled mb-0">
          <template v-if="loggedIn">
            <li class="mobile-nav-header">{{ $t("navigation.my_profile") }}</li>
            <li>
              <router-link
                class="mobile-nav-link"
                to="/profile"
                @click="mobileMenuOpen = false"
              >
                {{ $t("navigation.profile") }}
                <b-badge
                  v-if="numQuests > 0"
                  style="background-color: #523c88"
                  class="ml-1"
                  >{{ numQuests }}</b-badge
                >
              </router-link>
            </li>
            <li>
              <router-link
                class="mobile-nav-link"
                to="/profile/armory"
                @click="mobileMenuOpen = false"
              >
                {{ $t("navigation.armory") }}
                <b-badge
                  v-if="unopenedChests > 0"
                  style="background-color: #523c88"
                  class="ml-1"
                  >{{ unopenedChests }}</b-badge
                >
              </router-link>
            </li>
            <li>
              <router-link
                class="mobile-nav-link"
                to="/profile/gods"
                @click="mobileMenuOpen = false"
                >{{ $t("navigation.gods") }}</router-link
              >
            </li>
            <li>
              <router-link
                class="mobile-nav-link"
                to="/profile/games"
                @click="mobileMenuOpen = false"
                >{{ $t("navigation.match_history") }}</router-link
              >
            </li>
            <li>
              <router-link
                class="mobile-nav-link"
                to="/profile/stats"
                @click="mobileMenuOpen = false"
                >{{ $t("navigation.my_stats") }}</router-link
              >
            </li>
            <li v-if="isAdmin">
              <router-link
                class="mobile-nav-link"
                to="/admin"
                @click="mobileMenuOpen = false"
                >{{ $t("navigation.admin") }}</router-link
              >
            </li>
          </template>
          <li>
            <router-link
              class="mobile-nav-link"
              to="/store"
              @click="mobileMenuOpen = false"
              >{{ $t("navigation.store") }}</router-link
            >
          </li>
          <li class="mobile-nav-header">GAME</li>
          <li>
            <router-link
              class="mobile-nav-link"
              to="/leaderboard"
              @click="mobileMenuOpen = false"
              >{{ $t("navigation.leaderboard") }}</router-link
            >
          </li>
          <li>
            <router-link
              class="mobile-nav-link"
              to="/god_leaderboard"
              @click="mobileMenuOpen = false"
              >{{ $t("navigation.god_leaderboard") }}</router-link
            >
          </li>
          <li>
            <router-link
              class="mobile-nav-link"
              to="/tournaments"
              @click="mobileMenuOpen = false"
              >{{ $t("navigation.tournaments") }}</router-link
            >
          </li>
          <li>
            <router-link
              class="mobile-nav-link"
              to="/changelog"
              @click="mobileMenuOpen = false"
              >{{ $t("navigation.change_log") }}</router-link
            >
          </li>
          <li>
            <router-link
              class="mobile-nav-link"
              to="/faq"
              @click="mobileMenuOpen = false"
              >{{ $t("navigation.faq") }}</router-link
            >
          </li>
          <template v-if="canSeeStats">
            <li class="mobile-nav-header">STATS</li>
            <li>
              <router-link
                class="mobile-nav-link"
                to="/stats/games"
                @click="mobileMenuOpen = false"
                >Games</router-link
              >
            </li>
            <li>
              <router-link
                class="mobile-nav-link"
                to="/gods"
                @click="mobileMenuOpen = false"
                >{{ $t("navigation.gods") }}</router-link
              >
            </li>
            <li>
              <router-link
                class="mobile-nav-link"
                to="/abilities"
                @click="mobileMenuOpen = false"
                >{{ $t("navigation.abilities") }}</router-link
              >
            </li>
            <li>
              <router-link
                class="mobile-nav-link"
                to="/bodies"
                @click="mobileMenuOpen = false"
                >Bodies</router-link
              >
            </li>
            <li>
              <router-link
                class="mobile-nav-link"
                to="/cosmetics"
                @click="mobileMenuOpen = false"
                >Economy</router-link
              >
            </li>
          </template>
          <li class="mobile-nav-header">{{ $t("navigation.learn") }}</li>
          <li>
            <router-link
              class="mobile-nav-link"
              to="/learn/spells"
              @click="mobileMenuOpen = false"
              >{{ $t("navigation.spells") }}</router-link
            >
          </li>
          <li>
            <router-link
              class="mobile-nav-link"
              to="/learn/gods"
              @click="mobileMenuOpen = false"
              >{{ $t("navigation.gods") }}</router-link
            >
          </li>
          <li>
            <a class="mobile-nav-link" href="https://news.abilityarena.com/">{{
              $t("navigation.news")
            }}</a>
          </li>
          <li>
            <a class="mobile-nav-link" href="/matchmaking">{{
              $t("navigation.matchmaking")
            }}</a>
          </li>
          <li>
            <a
              class="mobile-nav-link"
              href="https://cardsmith.abilityarena.com/"
              target="_blank"
              >Cardsmith</a
            >
          </li>
          <li class="mobile-nav-header">{{ $t("navigation.language") }}</li>
          <li v-for="(lang, i) in langs" :key="`MobileLang${i}`">
            <a
              class="mobile-nav-link"
              href="#"
              @click.prevent="
                $i18n.locale = lang;
                $store.dispatch('setLanguage', lang);
                mobileMenuOpen = false;
              "
              >{{ $t(`navigation.${lang}`) }}</a
            >
          </li>
        </ul>
      </div>
    </transition>
  </header>
</template>

<script>
import LoginButton from "./LoginButton";
import ProgressBar from "./ProgressBar";

import dayjs from "dayjs";
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

export default {
  components: {
    LoginButton,
    ProgressBar,
  },

  data: () => ({ langs: ["en", "cn"], selected: null, mobileMenuOpen: false }),

  watch: {
    $route() {
      this.mobileMenuOpen = false;
    },
  },

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
    canSeeStats() {
      return (
        this.$store.getters.isAdmin ||
        this.$store.getters.userType === "STATS_GUY"
      );
    },
    ladderMMR() {
      return this.$store.getters.ladderMMR;
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
    // economy info stuff
    coins() {
      return this.$store.getters.coins;
    },
    bpLevel() {
      return this.$store.getters.bpLevel;
    },
    bpUpgraded() {
      return this.$store.getters.bpUpgraded;
    },
    hasPlus() {
      return this.$store.getters.hasPlus;
    },
    required() {
      return this.$store.getters.bpLevelRequired;
    },
    progress() {
      return this.$store.getters.bpLevelProgress;
    },
    plusExpiration() {
      const expiration = this.$store.state.auth.plusExpiration;
      return dayjs(expiration).fromNow();
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

.bp-progress {
  margin: auto;
  width: 75%;
}

.profile-image {
  height: 32px;
  width: auto;
}

.disabled {
  filter: grayscale(100%);
}

.navbar {
  flex-wrap: nowrap;
}

.navbar-toggler {
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.25rem 0.5rem;
  background: transparent;
  cursor: pointer;
  flex-shrink: 0;
}

.navbar-toggler-icon {
  display: inline-block;
  width: 1.5em;
  height: 1.5em;
  vertical-align: middle;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(255,255,255,0.8)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
  background-size: 100%;
  background-repeat: no-repeat;
}

.mobile-nav {
  background: rgba(10, 5, 20, 0.97);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.5rem 0 1rem;
  max-height: calc(100dvh - 64px);
  overflow-y: auto;
}

.mobile-nav-header {
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  padding: 0.75rem 1.25rem 0.2rem;
  text-transform: uppercase;
}

.mobile-nav-link {
  display: block;
  color: rgba(255, 255, 255, 0.85);
  padding: 0.55rem 1.75rem;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
}

.mobile-nav-link:hover,
.mobile-nav-link:focus {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  text-decoration: none;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: max-height 0.3s ease, opacity 0.25s ease;
  max-height: 600px;
  overflow: hidden;
}

.slide-down-enter,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
