// initial state
const state = {
  userSteamID: "",
  username: "",
  profilePictureLink: "",
  isAdmin: false,
  achievementsToClaim: 0,
};

// getters
const getters = {
  userSteamID: (state) => state.userSteamID,
  username: (state) => state.username,
  profilePictureLink: (state) => state.profilePictureLink,
  loggedIn: (state) => state.userSteamID !== "",
  isAdmin: (state) => state.isAdmin,

  achievementsToClaim: (state) => state.achievementsToClaim,
};

const mutations = {
  setUser(state, { steamID, picture, isAdmin }) {
    state.userSteamID = steamID;
    state.profilePictureLink = picture;
    state.loggedIn = true;
    state.isAdmin = isAdmin;
  },
  setNotLoggedIn(state) {
    state.username = "";
    state.userSteamID = "";
    state.profilePictureLink = "";
    state.loggedIn = false;
  },
  SAVE_USER(state, { username, steamID, isAdmin, achievementsToClaim }) {
    state.username = username;
    state.userSteamID = steamID;
    state.loggedIn = true;
    state.isAdmin = isAdmin;
    state.achievementsToClaim = achievementsToClaim;
  },
};

// actions
const actions = {
  refreshPlayer({ commit, state }) {
    fetch(`/api/players/${state.userSteamID}`)
      .then((res) => res.json())
      .then((player) => {
        const { username, steam_id, is_admin } = player;
        commit("SAVE_USER", {
          username,
          steamID: steam_id,
          isAdmin: is_admin,
          achievementsToClaim: 0,
        });
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
