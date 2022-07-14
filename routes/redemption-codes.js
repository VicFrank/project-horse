const express = require("express");
const router = express.Router();
const auth = require("../auth/auth");
const redemptionCodes = require("../db/redemption-codes");

router.get("/", auth.adminAuth, async (req, res) => {
  try {
    const codes = await redemptionCodes.getAllCodes();
    res.status(201).send(codes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

router.get("/:code/players", auth.adminAuth, async (req, res) => {
  try {
    const code = req.params.code;
    const players = await redemptionCodes.getCodePlayers(code);
    res.status(201).send(players);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

router.post("/:code", auth.adminAuth, async (req, res) => {
  try {
    const code = req.params.code;
    const cosmeticID = req.body.cosmeticID;
    await redemptionCodes.addRedemptionCode(code, cosmeticID);
    res.status(201).send({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

router.post("/:code/active", auth.adminAuth, async (req, res) => {
  try {
    const code = req.params.code;
    const active = req.body.active;
    await redemptionCodes.setRedemptionCodeActive(code, active);
    res.status(201).send({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

router.post("/:code/reward", auth.adminAuth, async (req, res) => {
  try {
    const code = req.params.code;
    const cosmeticID = req.body.cosmeticID;
    await redemptionCodes.changeRedemptionCodeReward(code, cosmeticID);
    res.status(201).send({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

router.post("/:code/code", auth.adminAuth, async (req, res) => {
  try {
    const code = req.params.code;
    const name = req.body.name;
    await redemptionCodes.changeRedemptionCodeCode(code, name);
    res.status(201).send({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;
