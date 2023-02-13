const express = require("express");
const router = express.Router();
const abilities = require("../db/abilities");

router.get("/", async (req, res) => {
  try {
    const { game_list } = req.query;
    if (game_list) {
      const result = await abilities.getActiveAbilties();
      res.status(200).send(result);
      return;
    }
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

router.post("/:ability_name", async (req, res) => {
  try {
    const { ability_name, icon, is_ultimate } = req.body;
    const result = await abilities.addAbility(ability_name, icon, is_ultimate);
    res.status(200).send(result);
  } catch (error) {
    if (error.code === "23505") {
      res.status(409).json({ error: "Ability already exists" });
      return;
    }
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

router.put("/:ability_name", async (req, res) => {
  try {
    const { active, deprecated } = req.body;
    const abilityName = req.params.ability_name;
    const result = await abilities.updateAbility(
      abilityName,
      active,
      deprecated
    );
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
