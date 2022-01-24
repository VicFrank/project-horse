const express = require("express");
const router = express.Router();
const players = require("../db/players");

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    const playersData = await players.getAllPlayers(limit, offset);
    res.status(200).json(playersData);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:steamid", async (req, res) => {
  try {
    const steamid = req.params.steamid;
    const playerInfo = await players.getPlayer(steamid);
    if (!playerInfo) {
      res.status(404).send({ message: "Player not found" });
    }
    res.status(200).json(playerInfo);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

module.exports = router;
