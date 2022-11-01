const scheme = window.location.protocol === "https:" ? "wss" : "ws";
const hostname = window.location.hostname;
const port = hostname === "localhost" ? ":4000" : "";

let connection;

function heartbeat(connection) {
  clearTimeout(connection.pingTimeout);

  const msg = JSON.stringify({ event: "pong" });
  connection.send(msg);

  // Delay should be equal to the interval at which your server
  // sends out pings plus a conservative assumption of the latency.
  connection.pingTimeout = setTimeout(() => {
    // console.log("heartbeat failed, killing");
    connection.terminate();
  }, 30000 + 1000);
}

function connect(store) {
  connection = new WebSocket(`${scheme}://${hostname}${port}`);

  connection.onopen = () => {
    // console.log("Successfully connected", e);
    store.dispatch("connectionOpened");

    const msg = JSON.stringify({ event: "connected" });
    connection.send(msg);

    heartbeat(connection);
  };

  connection.onmessage = (e) => {
    try {
      const { event, data } = JSON.parse(e.data);

      // console.log(e.data);
      // console.log(event, data);

      switch (event) {
        case "ping":
          heartbeat(connection);
          break;
        case "join_lobby":
          store.dispatch("joinLobby", data);
          break;
        case "left_lobby":
          store.dispatch("leaveLobby", data);
          break;
        case "lobby_changed":
          store.dispatch("updateLobbyPlayers", data);
          break;
        case "lobby_locked":
          store.dispatch("setLobbyLocked", data);
          break;
        case "connected":
          store.dispatch("onConnected", data);
          break;
        case "password":
          store.dispatch("setPassword", data);
          break;
        case "chat":
          store.dispatch("addMessage", data);
          break;
        case "lobbies_list":
          store.dispatch("setLobbies", data);
          break;
        case "error":
          store.dispatch("connectionError", data);
          break;
      }
    } catch (error) {
      console.error(error);
    }
  };

  connection.onclose = () => {
    // console.log(`websocket closed ${e}`);
    clearTimeout(connection.pingTimeout);
    store.dispatch("setDisconnected", true);
  };
}

function isClosed() {
  return connection.readyState === connection.CLOSED;
}

export default function createWebSocketPlugin() {
  // only connect to the websocket if we're on the matchmaking page
  if (window.location.pathname !== "/matchmaking") {
    return () => {};
  }

  return (store) => {
    if (!store.getters.loggedIn) return;

    connect(store);

    store.subscribe((mutation, state) => {
      if (isClosed()) {
        if (mutation.type === "REFRESH_CONNECTION") {
          connect(store);
        }
        return;
      }
      if (!state.matchmaking.connected) {
        console.log("Not connected");
        return;
      }

      const inLobby = state.matchmaking.inLobby;
      const data = mutation.payload;

      // console.log(mutation);

      // Refresh the websocket connection
      if (mutation.type === "REFRESH_CONNECTION") {
        connect(store);
      }

      // Send a chat message
      if (inLobby && mutation.type === "SEND_MESSAGE") {
        const msg = JSON.stringify({ event: "chat", data });
        connection.send(msg);
      }

      // Make and join a new lobby
      if (!inLobby && mutation.type === "HOST_LOBBY") {
        const msg = JSON.stringify({ event: "make_lobby", data });
        connection.send(msg);

        store.dispatch("hostedLobby");
      }

      if (!inLobby && mutation.type === "TRY_JOIN_LOBBY") {
        const msg = JSON.stringify({ event: "join_lobby", data });
        connection.send(msg);
      }

      if (inLobby && mutation.type === "ATTEMPT_LEAVE_LOBBY") {
        const msg = JSON.stringify({ event: "leave_lobby", data });
        connection.send(msg);
      }

      if (mutation.type === "REFRESH_LOBBIES") {
        const msg = JSON.stringify({ event: "refresh_lobbies" });
        connection.send(msg);
      }
    });
  };
}
