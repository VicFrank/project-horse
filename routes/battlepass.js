const express = require("express");
const router = express.Router();
const battlePasses = require("../db/battlepass");
const apicache = require("apicache");

const cache = apicache.middleware;

router.get("/", cache("5 minutes"), async (req, res) => {
  try {
    const battlePass = await battlePasses.getActiveBattlePass();
    res.status(200).send(battlePass);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

router.get("/levels", cache("5 minutes"), async (req, res) => {
  try {
    const battlePass = await battlePasses.getActiveBattlePass();
    const levels = await battlePasses.getBattlePassLevelsAndRewards(
      battlePass.battle_pass_id
    );
    res.status(200).send(levels);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

router.get("/level_stats", cache("5 minutes"), async (req, res) => {
  try {
    const result = await battlePasses.getPlayerLevelFreqs();
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;
