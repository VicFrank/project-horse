// initial state
const state = {
  userSteamID: "",
  username: "",
  profilePictureLink: "",
  isAdmin: false,
  hasPlus: false,
  plus_expiration: null,
  coins: 0,
  mmr: null,
  achievementsToClaim: 0,
  questsToClaim: 0,
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
  userType: (state) => state.userType,
  mmr: (state) => state.mmr,
  hasPlus: (state) => state.hasPlus,
  coins: (state) => state.coins,
  plus_expiration: (state) => state.plus_expiration,

  battlePass: (state) => state.battlePass,
  bpLevel: (state) => state.battlePass?.level ?? 0,
  bpLevelProgress: (state) => state.battlePass?.progress,
  bpLevelRequired: (state) => state.battlePass?.required,
  bpUpgraded: (state) => state.battlePass?.upgraded,

  achievementsToClaim: (state) => state.achievementsToClaim,
  questsToClaim: (state) => state.questsToClaim,
  unopenedChests: (state) => state.unopenedChests,
  unclaimedBPRewards: (state) => state.unclaimedBPRewards,
};

const mutations = {
  SET_USER(state, { steamID, username, picture, isAdmin, userType }) {
    state.userSteamID = steamID;
    state.username = username;
    state.profilePictureLink = picture;
    state.loggedIn = true;
    state.isAdmin = isAdmin;
    state.userType = userType;
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
      userType,
      mmr,
      achievementsToClaim,
      questsToClaim,
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
    state.userType = userType;
    state.mmr = mmr;
    state.achievementsToClaim = achievementsToClaim;
    state.questsToClaim = questsToClaim;
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
        commit("SAVE_USER", {
          username: player.username,
          userType: player.user_type,
          isAdmin: player.user_type === "ADMIN",
          mmr: player.mmr,
          achievementsToClaim: player.achievements_to_claim,
          questsToClaim: player.unclaimed_quests,
          coins: player.coins,
          hasPlus: player.has_plus,
          plusExpiration: player.plus_expiration,
          unopenedChests: player.unopened_chests,
          unclaimedBPRewards: player.unclaimed_bp_rewards,
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
