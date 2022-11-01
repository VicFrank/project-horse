function getLocalPlayer(rootState) {
  return {
    username: rootState.auth.username,
    steam_id: rootState.auth.userSteamID,
    avatar: rootState.auth.profilePictureLink,
    is_host: state.isHost,
  };
}

const state = {
  connected: false,

  newError: false,
  error: "",

  initialLoading: true,
  loadingLobbies: true,

  disconnected: false,

  lobbies: [],

  inLobby: false,
  isHost: false,
  ready: false,

  chatMessages: [],
  lobbyPlayers: [],
  lobbyPassword: null,
  lobbyRegion: "",
  isLobbyLocked: false,
  timeSinceLock: null,
};

const getters = {
  initialLoading: (state) => state.initialLoading,
  loadingLobbies: (state) => state.loadingLobbies,
  disconnected: (state) => state.disconnected,
  websocketError: (state) => state.error,
  newError: (state) => state.newError,

  lobbies: (state) => state.lobbies,
  chatMessages: (state) => state.chatMessages,
  inLobby: (state) => state.inLobby,
  isLobbyLocked: (state) => state.isLobbyLocked,
  lobbyPassword: (state) => state.lobbyPassword,
  isHost: (state) => state.isHost,

  lobbyPlayers: (state) => state.lobbyPlayers,
  timeSinceLock: (state) => state.timeSinceLock,
  lockTimeRemaining: (state) =>
    Math.floor(Math.max(0, 60 * 5 - state.timeSinceLock)),
};

const actions = {
  addMessage({ commit }, data) {
    commit("ADD_MESSAGE", data);
  },
  clearChat({ commit }) {
    commit("CLEAR_CHAT");
  },
  connectionOpened({ commit }) {
    commit("SET_CONNECTION", true);
    commit("SET_DISCONNECTED", false);
  },
  connectionClosed({ commit }) {
    commit("SET_CONNECTION", false);
  },
  connectionError({ commit }, error) {
    commit("SET_ERROR", error);
  },
  errorRecieved({ commit }) {
    commit("ERROR_RECIEVED");
  },
  sendMessage({ commit }, message) {
    commit("SEND_MESSAGE", message);
  },
  hostLobby({ commit }, message) {
    commit("HOST_LOBBY", message);
  },
  // this is for calling from the websocket plugin
  // to set inlobby state without side effects
  hostedLobby({ commit }) {
    commit("HOSTED_LOBBY");
  },
  joinLobby({ commit }, lobbyPlayers) {
    if (!state.inLobby) {
      commit("JOIN_LOBBY", lobbyPlayers);
    }
  },
  tryJoinLobby({ commit }, lobbyID) {
    commit("TRY_JOIN_LOBBY", lobbyID);
  },
  attemptLeave({ commit }) {
    commit("ATTEMPT_LEAVE_LOBBY");
  },
  leaveLobby({ commit }) {
    commit("LEAVE_LOBBY");
    commit("REFRESH_LOBBIES");
  },
  playerJoinedLobby({ commit }, lobbyPlayer) {
    commit("ADD_LOBBY_PLAYER", lobbyPlayer);
  },
  playerLeftLobby({ commit }, steamID) {
    commit("REMOVE_LOBBY_PLAYER", steamID);
  },
  updateLobbyPlayers({ commit }, lobbyPlayers) {
    commit("UPDATE_LOBBY_PLAYERS", lobbyPlayers);
  },
  refreshLobbies({ commit }) {
    commit("REFRESH_LOBBIES");
  },
  setLobbies({ commit }, lobbies) {
    commit("SET_LOBBIES", lobbies);
  },
  onConnected({ commit }, data) {
    commit("INIT_DATA", data);
  },
  refreshConnection({ commit }) {
    commit("REFRESH_CONNECTION");
  },
  setDisconnected({ commit }, disconnected) {
    commit("SET_DISCONNECTED", disconnected);
  },
  setLobbyLocked({ commit }, isLocked) {
    commit("SET_LOBBY_LOCKED", isLocked);
  },
  setPassword({ commit }, password) {
    commit("SET_PASSWORD", password);
  },
};

const mutations = {
  INIT_DATA(state, data) {
    // If we were already in a lobby, throw us in there
    // and initialize the data
    const { player, lobby_players, lobbyList, lobby } = data;
    if (player) {
      state.inLobby = true;
      state.lobbyPlayers = lobby_players;
      state.isHost = player.is_host;
      state.ready = player.ready;
      state.lobbyPassword = lobby.lobby_password;
      state.lobbyRegion = lobby.region;
      state.isLobbyLocked = lobby.locked;
      state.timeSinceLock = lobby.time_since_lock;
    }
    if (lobbyList) {
      state.inLobby = false;
      state.lobbies = lobbyList;
    }
    state.initialLoading = false;
    state.loadingLobbies = false;
  },
  // eslint-disable-next-line no-unused-vars
  REFRESH_CONNECTION(state) {},
  ADD_MESSAGE(state, message) {
    state.chatMessages.push(message);
  },
  CLEAR_CHAT() {
    state.chatMessages = [];
  },
  SET_CONNECTION(state, message) {
    state.connected = message;
  },
  SET_ERROR(state, error) {
    state.newError = true;
    state.error = error;
  },
  ERROR_RECIEVED(state) {
    state.newError = false;
  },
  // eslint-disable-next-line no-unused-vars
  SEND_MESSAGE(state, message) {},
  // eslint-disable-next-line no-unused-vars
  HOST_LOBBY(state, message) {},
  REFRESH_LOBBIES(state) {
    state.loadingLobbies = true;
  },
  SET_LOBBIES(state, lobbies) {
    state.loadingLobbies = false;
    state.lobbies = lobbies;
  },
  HOSTED_LOBBY(state) {
    state.inLobby = true;
    state.isHost = true;

    const player = getLocalPlayer(this.state);
    state.lobbyPlayers.push(player);
  },
  SET_PASSWORD(state, password) {
    state.lobbyPassword = password;
  },
  // eslint-disable-next-line no-unused-vars
  TRY_JOIN_LOBBY(state) {},
  JOIN_LOBBY(state, lobbyPlayers) {
    state.inLobby = true;
    state.lobbyPlayers = lobbyPlayers;
  },
  // eslint-disable-next-line no-unused-vars
  ATTEMPT_LEAVE_LOBBY(state) {},
  LEAVE_LOBBY(state) {
    state.inLobby = false;
    state.lobbyPlayers = [];
    state.chatMessages = [];
    state.lobbyPassword = null;
    state.lobbyRegion = "";
    state.isHost = false;
    state.isLobbyLocked = false;
    state.timeSinceLock = null;
  },
  ADD_LOBBY_PLAYER(state, lobbyPlayer) {
    state.lobbyPlayers.push(lobbyPlayer);
  },
  REMOVE_LOBBY_PLAYER(state, steamID) {
    state.lobbyPlayers = state.lobbyPlayers.filter(
      (p) => p.steamID !== steamID
    );
  },
  UPDATE_LOBBY_PLAYERS(state, lobbyPlayers) {
    if (state.inLobby) state.lobbyPlayers = lobbyPlayers;
  },
  SET_DISCONNECTED(state, disconnected) {
    state.disconnected = disconnected;
  },
  SET_LOBBY_LOCKED(state, locked) {
    state.isLobbyLocked = locked;
    if (locked) state.timeSinceLock = 0;
    else state.timeSinceLock = null;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
