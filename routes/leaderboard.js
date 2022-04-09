const express = require("express");
const router = express.Router();
const players = require("../db/players");
const apicache = require("apicache");

const cache = apicache.middleware;

router.get("/", cache("1 minutes"), async (req, res) => {
  try {
    const leaderboard = await players.getLeaderboard();
    res.status(200).json(leaderboard);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

module.exports = router;
