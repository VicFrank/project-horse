// const supportedLanguages = ["en", "ru", "cn"];
// initial state
const state = {
  lang: "en",
};

// getters
const getters = {
  lang: (state) => state.lang,
};

const actions = {
  setLanguage({ commit }, languages) {
    if (typeof languages === "string") {
      commit("SET_LANGUAGE", languages);
    }
  },
};

// mutations
const mutations = {
  SET_LANGUAGE(state, lang) {
    state.lang = lang;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
