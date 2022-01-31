const express = require("express");
const router = express.Router();
const quests = require("../db/quests");
const auth = require("../auth/auth");

router.get("/", async (req, res) => {
  try {
    const rows = await quests.getAllQuests();
    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.post("/", auth.adminAuth, async (req, res) => {
  try {
    const parsedData = JSON.parse(JSON.stringify(req.body));
    const rows = await quests.addNewQuest(parsedData);
    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/daily_quests", async (req, res) => {
  try {
    const rows = await quests.getAllDailyQuests();
    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/achievements", async (req, res) => {
  try {
    const rows = await quests.getAllAchievements();
    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

module.exports = router;
