const express = require("express");
const router = express.Router();
const abilities = require("../db/abilities");

router.get("/", async (req, res) => {
  try {
    const result = await abilities.getAbilities();
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

router.get("/:ability_name", async (req, res) => {
  try {
    const abilityName = req.params.ability_name;
    const result = await abilities.getAbility(abilityName);
    if (result.length === 0) {
      res.status(404).json({ error: "Ability not found" });
      return;
    }
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;
