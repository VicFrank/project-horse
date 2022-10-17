import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import ui from "./modules/ui";
import auth from "./modules/auth";
import matchmaking from "./modules/matchmaking";
import matchmakingSocket from "./plugins/matchmakingSocket";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  modules: {
    ui,
    auth,
    matchmaking,
  },
  plugins: [createPersistedState(), matchmakingSocket()],
  strict: debug,
});
