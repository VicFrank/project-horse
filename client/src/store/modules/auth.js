// initial state
const state = {
  userSteamID: "",
  username: "",
  profilePictureLink: "",
  isAdmin: false,
  coins: 0,
  achievementsToClaim: 0,
  dailiesToClaim: 0,
  // battlePass: {
  //   level: null,
  //   progress: null,
  //   required: null,
  // },
  battlePass: null,
};

// getters
const getters = {
  userSteamID: (state) => state.userSteamID,
  username: (state) => state.username,
  profilePictureLink: (state) => state.profilePictureLink,
  loggedIn: (state) => state.userSteamID !== "",
  isAdmin: (state) => state.isAdmin,
  coins: (state) => state.coins,

  battlePass: (state) => state.battlePass,
  hasBattlePass: (state) => state.battlePass !== null,
  bpLevel: (state) => state.battlePass?.level ?? 0,
  bpLevelProgress: (state) => state.battlePass?.progress,
  bpLevelRequired: (state) => state.battlePass?.required,

  achievementsToClaim: (state) => state.achievementsToClaim,
  dailiesToClaim: (state) => state.dailiesToClaim,
};

const mutations = {
  SET_USER(state, { steamID, username, picture, isAdmin }) {
    state.userSteamID = steamID;
    state.username = username;
    state.profilePictureLink = picture;
    state.loggedIn = true;
    state.isAdmin = isAdmin;
  },
  LOG_OUT(state) {
    state.username = "";
    state.userSteamID = "";
    state.profilePictureLink = "";
    state.loggedIn = false;
    state.battlePass = null;
  },
  SAVE_USER(state, { username, isAdmin, achievementsToClaim, coins }) {
    state.username = username;
    state.loggedIn = true;
    state.isAdmin = isAdmin;
    state.achievementsToClaim = achievementsToClaim;
    state.coins = coins;
  },
  SAVE_COINS(state, coins) {
    state.coins = coins;
  },
  SAVE_BATTLE_PASS(state, { battlePass }) {
    state.battlePass = battlePass;
  },
};

// actions
const actions = {
  REFRESH_PLAYER({ commit, state }) {
    fetch(`/api/players/${state.userSteamID}`)
      .then((res) => res.json())
      .then((player) => {
        // TODO: Initialize player state
        // TODO: refresh battle pass state
        const { username, user_type } = player;
        commit("SAVE_USER", {
          username,
          isAdmin: user_type === "ADMIN",
          achievementsToClaim: 0,
          coins: 0,
        });
      })
      .catch((err) => {
        throw new Error(`API: ${err}`);
      });
  },
  REFRESH_COINS({ commit, state }) {
    fetch(`/api/players/${state.userSteamID}`)
      .then((res) => res.json())
      .then((player) => {
        commit("SAVE_COINS", player.coins);
      })
      .catch((err) => {
        throw new Error(`API: ${err}`);
      });
  },
  REFRESH_BATTLE_PASS({ commit, state }) {
    fetch(`/api/players/${state.userSteamID}`)
      .then((res) => res.json())
      .then((player) => {
        const { level, progress, required } = player.battlePass;
        commit("SAVE_BATTLE_PASS", { level, progress, required });
      })
      .catch((err) => {
        throw new Error(`API: ${err}`);
      });
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
