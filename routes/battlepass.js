const express = require("express");
const router = express.Router();
const battlePasses = require("../db/battlepass");

router.get("/", async (req, res) => {
  try {
    const battlePass = await battlePasses.getActiveBattlePass();
    res.status(201).send(battlePass);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

router.get("/levels", async (req, res) => {
  try {
    const battlePass = await battlePasses.getActiveBattlePass();
    const levels = await battlePasses.getBattlePassLevelsAndRewards();
    res.status(201).send(levels);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;
