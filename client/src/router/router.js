import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
import i18n from "../i18n";

const NotFound = () => import("../components/pages/misc/NotFound");
const LoginRedirect = () => import("../components/pages/misc/LoginRedirect");

const Home = () => import("../components/pages/home/Home");
const Credits = () => import("../components/pages/credits/Credits");
const FAQ = () => import("../components/pages/faq/Faq");
const Changelog = () => import("../components/pages/changelog/Changelog");
const Tournaments = () => import("../components/pages/tournaments/Tournaments");
const Admin = () => import("../components/pages/admin/Admin");

const Store = () => import("../components/pages/store/Store");
const Checkout = () => import("../components/pages/store/Checkout");
const Checkout2 = () => import("../components/pages/store/Checkout2");
const PaymentSuccess = () => import("../components/pages/store/PaymentSuccess");
const AlipayPayment = () => import("../components/pages/store/AlipayPayment");
const WeChatPay = () => import("../components/pages/store/WeChatPay");

const Games = () => import("../components/pages/games/Games");
import Game from "../components/pages/games/Game";

const Gods = () => import("../components/pages/stats/Gods");
const Abilities = () => import("../components/pages/stats/Abilities");

const Profile = () => import("../components/pages/profile/Profile");
const MatchHistory = () => import("../components/pages/profile/MatchHistory");
const Armory = () => import("../components/pages/armory/Armory");
const Achievements = () => import("../components/pages/profile/Achievements");
const MyStats = () => import("../components/pages/profile/Stats");
const BattlePass = () =>
  import("../components/pages/profile/battlepass/BattlePass");
const MyGods = () => import("../components/pages/profile/MyGods");

const RedemptionCode = () => import("../components/pages/codes/RedemptionCode");

const Leaderboard = () => import("../components/pages/leaderboard/Leaderboard");
const PlayerPage = () => import("../components/pages/player/PlayerPage");
const PlayerGamesList = () =>
  import("../components/pages/player/PlayerGamesList");

const Matchmaking = () => import("../components/pages/matchmaking/Matchmaking");

const Spells = () => import("../components/pages/spells/Spells");

Vue.use(VueRouter);

const routes = [
  { path: "/404", alias: "*", component: NotFound },
  { path: "*", redirect: "/404" },
  { path: "/", component: Home },
  { path: "/credits", component: Credits },
  { path: "/faq", component: FAQ },
  { path: "/changelog", component: Changelog },
  { path: "/tournaments", component: Tournaments },
  {
    path: "/admin",
    component: Admin,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  { path: "/redirect", component: LoginRedirect },
  { path: "/games", component: Games },
  { path: "/games/:game_id", component: Game },
  {
    path: "/gods",
    component: Gods,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/abilities",
    component: Abilities,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  { path: "/leaderboard", component: Leaderboard },
  {
    path: "/redeem_code",
    component: RedemptionCode,
    meta: { requiresAuth: true },
  },
  {
    path: "/matchmaking",
    component: Matchmaking,
    meta: { requiresAuth: true },
  },
  { path: "/players/:steam_id", component: PlayerPage },
  { path: "/players/:steam_id/games", component: PlayerGamesList },

  { path: "/store", component: Store },
  { path: "/checkout/:item_ids+", component: Checkout },
  { path: "/checkout2/:item_ids+", component: Checkout2 },
  { path: "/payment_success/", component: PaymentSuccess },
  {
    path: "/alipay_payment/",
    component: AlipayPayment,
    props: (route) => ({
      source: route.query.source,
      livemode: route.query.livemode,
      clientSecret: route.query.client_secret,
      itemID: route.query.item_id,
    }),
  },
  {
    path: "/wechat_payment/",
    component: WeChatPay,
    props: (route) => ({
      source: route.query.source,
      livemode: route.query.livemode,
      clientSecret: route.query.client_secret,
      itemID: route.query.item_id,
    }),
  },

  { path: "/profile", component: Profile, meta: { requiresAuth: true } },
  {
    path: "/profile/games",
    component: MatchHistory,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile/achievements",
    component: Achievements,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile/stats",
    component: MyStats,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile/battlepass",
    component: BattlePass,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile/armory",
    component: Armory,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile/gods",
    component: MyGods,
    meta: { requiresAuth: true },
  },
  {
    path: "/learn/spells",
    component: Spells,
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters.loggedIn) {
      next();
    } else {
      next("");
    }
  } else {
    next();
  }
  if (to.matched.some((record) => record.meta.requiresAdmin)) {
    if (store.getters.isAdmin) {
      next();
    } else {
      next("");
    }
  } else {
    next();
  }
  if (to.matched.some((record) => record.meta.requiresImmortal)) {
    if (store.getters.ladderMMR >= 4500) {
      next();
    } else {
      next("");
    }
  } else {
    next();
  }
});

router.beforeEach((to, from, next) => {
  const lang = store.getters.lang;
  if (lang && lang !== i18n.locale) {
    i18n.locale = lang;
    next();
  } else {
    next();
  }
});

export default router;
