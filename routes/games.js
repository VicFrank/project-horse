const express = require("express");
const router = express.Router();
const games = require("../db/games");
const auth = require("../auth/auth");
const apicache = require("apicache");

const cache = apicache.middleware;

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    const pastHours = parseInt(req.query.hours);
    if (pastHours) {
      const gameInfo = await games.getGames(limit, offset, pastHours);
      res.status(200).json(gameInfo);
    } else {
      const gameInfo = await games.getGames(limit, offset);
      res.status(200).json(gameInfo);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.post("/players", auth.keyAuth, async (req, res) => {
  const { data } = req.body;
  try {
    const parsedData = JSON.parse(data);
    const gameID = parsedData.matchID;
    parsedData.isProd = auth.isProdClient(req);
    const created = await games.createGamePlayer(parsedData);
    apicache.clear(`game-${gameID}`);
    res.status(201).send({ message: `Recorded game`, ...created });
  } catch (error) {
    console.log(data);
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.post("/", auth.keyAuth, async (req, res) => {
  const { data } = req.body;
  try {
    const parsedData = JSON.parse(data);
    const gameID = parsedData.matchID;
    await games.addGameResults(parsedData);
    apicache.clear(`game-${gameID}`);
    res.status(201).send({ message: `Created game` });
  } catch (error) {
    console.log(JSON.stringify(req.body));
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:gameid", cache("1 hour"), async (req, res) => {
  try {
    const gameID = req.params.gameid;
    req.apicacheGroup = `game-${gameID}`;

    const game = await games.getGame(gameID);
    if (!game) return res.status(404).send({ message: "Game not found" });
    for (const player of game.players) {
      delete player.mmr_change;
      delete player.mmr;
    }

    res.status(200).json(game);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

module.exports = router;
