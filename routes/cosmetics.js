const express = require("express");
const router = express.Router();
const cosmetics = require("../db/cosmetics");
const auth = require("../auth/auth");

router.get("/", async (req, res) => {
  try {
    const cosmeticsList = await cosmetics.getAllCosmetics();
    res.status(201).send(cosmeticsList);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  // check if id is a number
  if (isNaN(id)) {
    res.status(400).json({ error: "ID must be a number" });
    return;
  }
  try {
    const cosmetic = await cosmetics.getCosmetic(id);
    res.status(201).send(cosmetic);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

router.post("/get_cosmetics", async (req, res) => {
  const ids = req.body.cosmeticIDs;
  try {
    const result = await cosmetics.getCosmetics(ids);
    res.status(201).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

router.get("/chests/odds", async (req, res) => {
  try {
    const result = await cosmetics.getOddsTables();
    res.status(201).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

router.get("/sale/current_sale", async (req, res) => {
  try {
    const result = await cosmetics.getSaleItem();
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

router.post("/sale/update_sale", auth.adminAuth, async (req, res) => {
  try {
    const { cosmetic_id, cost_coins } = req.body;
    await cosmetics.setSaleItem(cosmetic_id, cost_coins);
    res.status(201).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

router.post("/:id/update_price", auth.adminAuth, async (req, res) => {
  try {
    const { cosmeticID, costCoins } = req.params;
    await cosmetics.setCoinsPrice(cosmeticID, costCoins);
    res.status(201).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;
