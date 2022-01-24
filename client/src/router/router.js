import Vue from "vue";
import VueRouter from "vue-router";

const NotFound = () => import("../components/pages/misc/NotFound");
const LoginRedirect = () => import("../components/pages/misc/LoginRedirect");

const Home = () => import("../components/pages/home/Home");
const Credits = () => import("../components/pages/credits/Credits");
const Changelog = () => import("../components/pages/changelog/Changelog");

Vue.use(VueRouter);

const routes = [
  { path: "/404", alias: "*", component: NotFound },
  { path: "*", redirect: "/404" },
  { path: "/", component: Home },
  { path: "/credits", component: Credits },
  { path: "/changelog", component: Changelog },
  { path: "/redirect", component: LoginRedirect },
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

// router.beforeEach((to, from, next) => {
//   if (to.matched.some((record) => record.meta.requiresAuth)) {
//     if (store.getters.loggedIn) {
//       next();
//     } else {
//       next("");
//     }
//   } else {
//     next();
//   }
//   if (to.matched.some((record) => record.meta.requiresAdmin)) {
//     if (store.getters.isAdmin) {
//       next();
//     } else {
//       next("");
//     }
//   } else {
//     next();
//   }
// });

export default router;
