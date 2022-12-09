const express = require("express");
const router = express.Router();
const gods = require("../db/gods");
const abilities = require("../db/abilities");
const apicache = require("apicache");
const { statsManAuth } = require("../auth/auth");

const cache = apicache.middleware;

router.get("/gods", statsManAuth, cache("1 hour"), async (req, res) => {
  try {
    const hours = parseInt(req.query.hours) || 24;
    const minMMR = parseInt(req.query.minMMR) || 0;
    const stats = await gods.getGodsStats(hours, minMMR);
    res.status(200).json(stats);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/abilities", statsManAuth, cache("1 hour"), async (req, res) => {
  try {
    const hours = parseInt(req.query.hours) || 24;
    const minMMR = parseInt(req.query.minMMR) || 0;
    const stats = await abilities.getAbilityStats(hours, minMMR);
    res.status(200).json(stats);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get(
  "/abilities/supers",
  statsManAuth,
  cache("1 hour"),
  async (req, res) => {
    try {
      const hours = parseInt(req.query.hours) || 24;
      const stats = await abilities.getSuperWinStats(hours);
      res.status(200).json(stats);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Server Error" });
    }
  }
);

router.get(
  "/abilities/gabens",
  statsManAuth,
  cache("1 hour"),
  async (req, res) => {
    try {
      const hours = parseInt(req.query.hours) || 24;
      const stats = await abilities.getGabenWinStats(hours);
      res.status(200).json(stats);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Server Error" });
    }
  }
);

router.get(
  "/abilities/winner_levels",
  statsManAuth,
  cache("1 hour"),
  async (req, res) => {
    try {
      const hours = parseInt(req.query.hours) || 24;
      const stats = await abilities.getWinnerLevelRates(hours);
      res.status(200).json(stats);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Server Error" });
    }
  }
);

module.exports = router;
