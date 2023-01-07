const express = require("express");
const router = express.Router();
const gods = require("../db/gods");
const rollup = require("../db/rollup");
const abilities = require("../db/abilities");
const bodies = require("../db/bodies");
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

router.get("/gods/:god", statsManAuth, cache("1 hour"), async (req, res) => {
  try {
    const god = req.params.god;
    const hours = parseInt(req.query.hours) || 24;
    const minMMR = parseInt(req.query.minMMR) || 0;
    const stats = await abilities.getGodAbilityStats(god, hours, minMMR);
    res.status(200).json(stats);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/rollupOptions", statsManAuth, async (req, res) => {
  try {
    const stats = await rollup.getMmrOptions(startDate, endDate, ranks);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/godsRollup", async (req, res) => {
  try {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const mmrOption = req.query.mmrOption
    const stats = await gods.getGodsStatsRollup(startDate, endDate, mmrOption);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/godDaily", statsManAuth, async (req, res) => {
  try {
    const god = req.query.god;
    const mmrOption = req.query.mmrOption
    const stats = await gods.getGodDailyStats(god, mmrOption);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/godWeekly", statsManAuth, async (req, res) => {
  try {
    const god = req.query.god;
    const mmrOption = req.query.mmrOption
    const stats = await gods.getGodWeeklyStats(god, mmrOption);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/godMonthly", statsManAuth, async (req, res) => {
  try {
    const god = req.query.god;
    const mmrOption = req.query.mmrOption
    const stats = await gods.getGodMonthlyStats(god, mmrOption);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/godPerPatch", statsManAuth, async (req, res) => {
  try {
    const god = req.query.god;
    const mmrOption = req.query.mmrOption
    const stats = await gods.getGodPerPatchStats(god, mmrOption);
    res.status(200).json(stats);
  } catch (error) {
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
  "/abilities/:ability_name/stats",
  statsManAuth,
  cache("1 hour"),
  async (req, res) => {
    try {
      const abilityName = req.params.ability_name;
      const hours = parseInt(req.query.hours) || 24;
      const minMMR = parseInt(req.query.minMMR) || 0;
      const stats = await abilities.getAbilityComboStats(
        abilityName,
        hours,
        minMMR
      );
      res.status(200).json(stats);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Server Error" });
    }
  }
);

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

router.get("/bodies", statsManAuth, cache("1 hour"), async (req, res) => {
  try {
    const hours = parseInt(req.query.hours) || 24;
    const minMMR = parseInt(req.query.minMMR) || 0;
    const stats = await bodies.getBodyStats(hours, minMMR);
    res.status(200).json(stats);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

module.exports = router;
