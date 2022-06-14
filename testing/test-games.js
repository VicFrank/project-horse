const games = require("../db/games");

const { testPlayers, testGame } = require("./data/sample-game");

async function InsertSampleGame() {
  try {
    for (const player of testPlayers) {
      const parsedData = JSON.parse(player);
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
