// initial state
const state = {
  userSteamID: "",
  username: "",
  profilePictureLink: "",
  isAdmin: false,
  hasPlus: false,
  plus_expiration: null,
  coins: 0,
  achievementsToClaim: 0,
  dailiesToClaim: 0,
  unopenedChests: 0,
  unclaimedBPRewards: 0,
  battlePass: {
    level: null,
    progress: null,
    required: null,
    upgraded: null,
  },
};

// getters
const getters = {
  userSteamID: (state) => state.userSteamID,
  username: (state) => state.username,
  profilePictureLink: (state) => state.profilePictureLink,
  loggedIn: (state) => state.userSteamID !== "",
  isAdmin: (state) => state.isAdmin,
  hasPlus: (state) => state.hasPlus,
  coins: (state) => state.coins,
  plus_expiration: (state) => state.plus_expiration,

  battlePass: (state) => state.battlePass,
  bpLevel: (state) => state.battlePass?.level ?? 0,
  bpLevelProgress: (state) => state.battlePass?.progress,
  bpLevelRequired: (state) => state.battlePass?.required,
  bpUpgraded: (state) => state.battlePass?.upgraded,

  achievementsToClaim: (state) => state.achievementsToClaim,
  dailiesToClaim: (state) => state.dailiesToClaim,
  unopenedChests: (state) => state.unopenedChests,
  unclaimedBPRewards: (state) => state.unclaimedBPRewards,
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
  SAVE_USER(
    state,
    {
      username,
      isAdmin,
      achievementsToClaim,
      coins,
      hasPlus,
      plusExpiration,
      unopenedChests,
      unclaimedBPRewards,
    }
  ) {
    state.username = username;
    state.loggedIn = true;
    state.isAdmin = isAdmin;
    state.achievementsToClaim = achievementsToClaim;
    state.unopenedChests = unopenedChests;
    state.unclaimedBPRewards = unclaimedBPRewards;
    state.coins = coins;
    state.hasPlus = hasPlus;
    state.plusExpiration = plusExpiration;
  },
  SAVE_COINS(state, coins) {
    state.coins = coins;
  },
  SAVE_BATTLE_PASS(state, battlePass) {
    state.battlePass = battlePass;
  },
};

// actions
const actions = {
  REFRESH_PLAYER({ commit, state }) {
    fetch(`/api/players/${state.userSteamID}`)
      .then((res) => res.json())
      .then((player) => {
        const {
          username,
          user_type,
          coins,
          achievements_to_claim,
          has_plus,
          plus_expiration,
          unopenedChests,
          unclaimedBPRewards,
        } = player;
        commit("SAVE_USER", {
          username,
          isAdmin: user_type === "ADMIN",
          achievementsToClaim: achievements_to_claim,
          coins,
          hasPlus: has_plus,
          plusExpiration: plus_expiration,
          unopenedChests,
          unclaimedBPRewards,
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
    fetch(`/api/players/${state.userSteamID}/battle_pass`)
      .then((res) => res.json())
      .then((battlePass) => {
        const { bp_level, total_xp, requirements, unlocked } = battlePass;
        const { next_level_xp, total_xp: requiredSoFar } = requirements;
        const progress = total_xp - requiredSoFar;
        const required = next_level_xp;

        commit("SAVE_BATTLE_PASS", {
          level: bp_level,
          progress,
          required,
          upgraded: unlocked,
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
