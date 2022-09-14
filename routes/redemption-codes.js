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
    const { cosmeticIDs, coins, redemptionLimit } = req.body;
    const exists = await redemptionCodes.exists(code);
    if (exists) {
      return res.status(400).json({ error: "Code already exists" });
    }
    const result = await redemptionCodes.addRedemptionCode(
      code,
      redemptionLimit,
      cosmeticIDs,
      coins
    );
    res.status(201).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

router.delete("/:code", auth.adminAuth, async (req, res) => {
  try {
    const code = req.params.code;
    await redemptionCodes.deleteRedemptionCode(code);
    res.status(201).send("deleted");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

router.patch("/:code/active", auth.adminAuth, async (req, res) => {
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

router.patch("/:code/reward", auth.adminAuth, async (req, res) => {
  try {
    const code = req.params.code;
    const cosmeticIDs = req.body.cosmeticIDs;
    const result = await redemptionCodes.updateRedemptionCodeRewards(
      code,
      cosmeticIDs
    );
    res.status(201).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

router.patch("/:code/code", auth.adminAuth, async (req, res) => {
  try {
    const code = req.params.code;
    const name = req.body.name;
    await redemptionCodes.updateRedemptionCodeCode(code, name);
    res.status(201).send({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;
