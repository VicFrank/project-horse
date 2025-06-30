const redis = require("redis");

const lobbies = require("../matchmaking/lobbies");

let connections = {};

if (process.env.no_redis) {
  console.log("Redis disabled, some functionality will not work");
  return;
}
/*
  Handle sending websocket messages to all connected node clients
*/
const client = redis.createClient();
const subscriber = client.duplicate();

(async function () {
  await client.connect();
  await subscriber.connect();

  await subscriber.subscribe("ws_broadcast", (message) => {
    const { steamID, payload } = JSON.parse(message);
    // console.log(`Sending payload ${JSON.stringify(payload)} to ${steamID}`);

    // Send the message to the player, if they exist on this cluster
    if (connections[steamID]) {
      const ws = connections[steamID];
      ws.send(JSON.stringify(payload));
    }
  });
})();

async function broadcastMessage(steamID, payload) {
  const message = JSON.stringify({
    steamID,
    payload,
  });
  await client.publish("ws_broadcast", message);
}

module.exports = {
  addConnection(steamID, ws) {
    connections[steamID] = ws;
  },

  removeConnection(steamID) {
    delete connections[steamID];
  },

  async sendMessageToPlayer(steamID, message) {
    await broadcastMessage(steamID, message);
  },

  async sendMessageToLobby(lobbyID, message) {
    const players = await lobbies.getLobbyPlayers(lobbyID);

    for (const player of players) {
      const steamID = player.steam_id;
      broadcastMessage(steamID, message);
    }
  },

  async sendMessageFromPlayer(steamID, lobbyID, message) {
    const players = await lobbies.getLobbyPlayers(lobbyID);

    for (const player of players) {
      if (steamID !== player.steam_id) {
        broadcastMessage(player.steam_id, message);
      }
    }
  },
};
