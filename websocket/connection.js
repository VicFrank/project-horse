const lobbies = require("../matchmaking/lobbies");
const lobbyPlayers = require("../matchmaking/lobby-players");
const connectionManager = require("./connectionManager");

const { LOBBY_LOCK_TIME } = require("../common/constants");

/*
  Handle the different websocket events
*/
async function sendInitialData(steamID) {
  const lobby = await lobbyPlayers.getLobby(steamID);
  const player = await lobbyPlayers.getPlayer(steamID);

  let lobby_players;
  if (lobby) {
    // If they're in a lobby, send them the lobby info
    lobby_players = await lobbies.getLobbyPlayers(lobby.lobby_id);

    const data = {
      event: "connected",
      data: {
        player,
        lobby_players,
        lobby,
      },
    };

    connectionManager.sendMessageToPlayer(steamID, data);
  } else {
    // Otherwise, send the list of lobbies
    const lobbyList = await lobbies.getAllLobbies();
    const data = {
      event: "connected",
      data: {
        lobbyList,
      },
    };

    connectionManager.sendMessageToPlayer(steamID, data);
  }
}

async function sendChatToLobby(steamID, message) {
  const lobby = await lobbyPlayers.getLobby(steamID);
  if (!lobby) return;
  const lobbyID = lobby.lobby_id;

  const player = await lobbyPlayers.getPlayer(steamID);

  const data = {
    event: "chat",
    data: {
      username: player.username,
      message,
    },
  };

  connectionManager.sendMessageFromPlayer(steamID, lobbyID, data);
}

async function sendLobbyList(steamID) {
  const lobbyList = await lobbies.getAllLobbies();
  const data = {
    event: "lobbies_list",
    data: lobbyList,
  };
  connectionManager.sendMessageToPlayer(steamID, data);
}

function sendError(steamID, errorMessage) {
  console.log(`${steamID}: ${errorMessage}`);

  const data = {
    event: "error",
    data: errorMessage,
  };
  connectionManager.sendMessageToPlayer(steamID, data);
}

async function makeLobby(steamID, avatar, region, minRank, maxRank) {
  // check to see if the player can make this lobby
  const isInMMRRange = await lobbyPlayers.isInMMRRange(
    steamID,
    minRank,
    maxRank
  );
  if (!isInMMRRange) return sendError(steamID, "failed_lobby_requirements");
  const inLobby = await lobbyPlayers.inLobby(steamID);
  if (inLobby) return sendError(steamID, "already_in_lobby");

  const lobbyID = await lobbies.makeLobby(
    steamID,
    avatar,
    region,
    minRank,
    maxRank
  );

  updateLobbyPlayers(lobbyID);
}

async function updateLobbyPlayers(lobbyID) {
  const lobby_players = await lobbies.getLobbyPlayers(lobbyID);

  const data = {
    event: "lobby_changed",
    data: lobby_players,
  };
  connectionManager.sendMessageToLobby(lobbyID, data);
}

async function joinLobby(steamID, lobbyID, avatar) {
  const lobby = await lobbies.getLobby(lobbyID);

  const inLobby = await lobbyPlayers.inLobby(steamID);
  if (inLobby) {
    sendError(steamID, "already_in_lobby");
    return;
  }

  if (!lobby) {
    sendError(steamID, "lobby_doesnt_exist");
    return;
  }

  const isFull = await lobbies.isFull(lobbyID);
  if (isFull) {
    sendError(steamID, "lobby_full");
    return;
  }

  const meetsRequirements = await lobbyPlayers.isInMMRRange(
    steamID,
    lobby.min_rank,
    lobby.max_rank
  );
  if (!meetsRequirements) {
    sendError(steamID, "failed_lobby_requirements");
    return;
  }

  const isLocked = await lobbies.isLobbyLocked(lobbyID);
  if (isLocked) {
    sendError(steamID, "lobby_locked");
    return;
  }

  await lobbyPlayers.joinLobby(steamID, lobbyID, avatar);

  // If the lobby is now full, send them the password
  if (await lobbies.isFull(lobbyID)) {
    onLobbyFull(lobbyID);
  }

  const lobby_players = await lobbies.getLobbyPlayers(lobbyID);

  const data = {
    event: "join_lobby",
    data: lobby_players,
  };
  connectionManager.sendMessageToPlayer(steamID, data);
  updateLobbyPlayers(lobbyID);
}

async function leaveLobby(steamID) {
  // Make sure the player is in the lobby
  const player = await lobbyPlayers.getPlayer(steamID);
  if (!player || !player.lobby_id) return;

  const lobbyID = player.lobby_id;

  // You can't leave if the lobby is locked
  const isLocked = await lobbies.isLobbyLocked(lobbyID);
  if (isLocked) {
    sendError(steamID, "lobby_locked");
    return;
  }

  const data = {
    event: "left_lobby",
    data: steamID,
  };

  await lobbyPlayers.leaveLobby(steamID);

  // Inform the lobby that a player left
  updateLobbyPlayers(lobbyID);
  // Confirm to the player that they left
  connectionManager.sendMessageToPlayer(steamID, data);

  // Destroy the lobby if it is now empty
  const lobbySize = await lobbies.getLobbySize(lobbyID);
  if (lobbySize == 0) {
    deleteLobby(lobbyID);
    return;
  }

  // If the host left, choose a new host
  if (player.is_host) {
    lobbies.updateHost(lobbyID);
  }

  updateLobbyPlayers(lobbyID);
}

async function deleteLobby(lobbyID) {
  const data = {
    event: "left_lobby",
  };

  // inform all remaining players that they've left the lobby
  // await to make sure we get the lobby players before it's destroyed
  await connectionManager.sendMessageToLobby(lobbyID, data);
  lobbies.deleteLobby(lobbyID);
}

function generatePassword() {
  return (Math.random().toString(36) + "00000000000000000").slice(2, 7);
}

async function onLobbyFull(lobbyID) {
  // Make sure the lobby is full (this may be redundant)
  const isFull = await lobbies.isFull(lobbyID);
  if (!isFull) return;

  // Lock the lobby
  await lobbies.lockLobby(lobbyID);

  connectionManager.sendMessageToLobby(lobbyID, {
    event: "lobby_locked",
    data: true,
  });

  // Send the password
  const password = generatePassword();
  const data = {
    event: "password",
    data: password,
  };
  lobbies.setLobbyPassword(lobbyID, password);

  connectionManager.sendMessageToLobby(lobbyID, data);

  // TODO: After 5 minutes, unlock the lobby
  setTimeout(() => {
    unlockLobby(lobbyID);
  }, LOBBY_LOCK_TIME * 1000);
}

async function unlockLobby(lobbyID) {
  // Make sure the lobby still exists
  const lobby = await lobbies.getLobby(lobbyID);
  if (!lobby) return;

  await lobbies.unlockLobby(lobbyID);

  connectionManager.sendMessageToLobby(lobbyID, {
    event: "lobby_locked",
    data: false,
  });
}

module.exports = connection = (ws, user) => {
  ws.isAlive = true;

  const username = user.displayName;
  const steamID = user.id;
  let avatar;
  if (user.photos && user.photos[0]) avatar = user.photos[0].value;

  connectionManager.addConnection(steamID, ws);

  // console.log(`Web Socket Connect: ${username} ${steamID}`);

  ws.on("message", (message) => {
    // Send a message to the user's current chat channel
    let event;
    let data;
    try {
      const parsedMessage = JSON.parse(message);
      event = parsedMessage.event;
      data = parsedMessage.data;
    } catch (error) {
      console.log("Error parsing websocket data", message);
      return;
    }

    if (event !== "pong") {
      console.log(`Received event ${event} from user ${username}`);
    }

    switch (event) {
      case "connected":
        sendInitialData(steamID);
        break;
      case "pong":
        ws.isAlive = true;
        break;
      case "chat":
        // Send a message to the chat lobby
        const chatMessage = data.message;
        sendChatToLobby(steamID, chatMessage);
        break;
      case "refresh_lobbies":
        sendLobbyList(steamID);
        break;
      case "join_lobby":
        const lobbyID = data;
        joinLobby(steamID, lobbyID, avatar);
        break;
      case "leave_lobby":
        leaveLobby(steamID);
        break;
      case "quick_join_lobby":
        // Try to find a lobby that matches the user's preferences
        break;
      case "make_lobby":
        const { region, mmrMin, mmrMax } = data;
        makeLobby(steamID, avatar, region, mmrMin, mmrMax);
        break;
    }
  });

  ws.on("error", function (error) {
    console.log(`Websocket Error: ${error}`);
  });

  ws.on("close", function () {
    // TODO: Remove player from the lobby if they've been disconnected
    // long enough
    console.log(`Websocket Closed: ${username} ${steamID}`);

    connectionManager.removeConnection(steamID);
  });
};

(async function () {
  runTests();
})();

async function runTests() {
  // console.log("running tests");

  const steamIDs = [
    "76561197960956468",
    "76561198062147437",
    "76561198397146825",
    "76561198389696579",
    "76561198055012951",
    "76561197996590553",
    "76561198862719145",
    "76561198025862322",
  ];

  const player1 = steamIDs[0];
  const player2 = steamIDs[1];
  const player3 = steamIDs[2];
  const player4 = steamIDs[3];
  const player5 = steamIDs[4];
  const player6 = steamIDs[5];
  const player7 = steamIDs[6];
  const player8 = steamIDs[7];

  await leaveLobby(player1);
  // await leaveLobby(player2);
  // await leaveLobby(player3);
  // await leaveLobby(player4);
  // await leaveLobby(player5);
  // await leaveLobby(player6);

  // const lobbyID = await makeLobby(player1, null, "US West", 1100, 1300);

  await joinLobby(player1, 10, null);
  // await joinLobby(player3, lobbyID, null);
  // await joinLobby(player4, lobbyID, null);
  // await joinLobby(player5, lobbyID, null);

  // sendChatToLobby(player1, "hey");

  // console.log("run tests");
}
