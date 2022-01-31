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
    const player = await players.getPlayer(steamid);
    if (!player) {
      res.status(404).send({ message: "Player not found" });
    }
    res.status(200).json(player);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:steamid/stats", async (req, res) => {
  try {
    const steamid = req.params.steamid;
    const stats = await players.getStats(steamid);
    if (!stats) return res.status(404).send({ message: "Player not found" });
    res.status(200).json(stats);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:steamid/daily_quests", async (req, res) => {
  try {
    const steamid = req.params.steamid;
    // const playerInfo = await players.getPlayer(steamid);
    // if (!playerInfo) {
    //   res.status(404).send({ message: "Player not found" });
    // }
    // res.status(200).json(playerInfo);
    res.status(200).json([]);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

module.exports = router;
