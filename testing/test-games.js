const games = require("../db/games");

const { testPlayers, testGame } = require("./data/sample-game");

async function InsertSampleGame() {
  try {
    const matchID = Math.floor(Math.random() * 100000000000) + 1;
    for (const player of testPlayers) {
      const parsedData = JSON.parse(player);
      // generate a random number between 1 and 100
      parsedData.matchID = matchID;
      await games.createGamePlayer(parsedData);
    }
    console.log("Game players inserted");
  } catch (error) {
    throw error;
  }
}

(async function () {
  await InsertSampleGame();
})();
