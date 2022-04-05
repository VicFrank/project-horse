const express = require("express");
const router = express.Router();
const players = require("../db/players");
const quests = require("../db/quests");
const auth = require("../auth/auth");
const apicache = require("apicache");

const cache = apicache.middleware;

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    const playersData = await players.getAllPlayers(limit, offset);
    res.status(200).json(playersData);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:steamID", async (req, res) => {
  try {
    const steamID = req.params.steamID;
    const player = await players.getPlayer(steamID);
    if (!player) return res.status(404).send({ message: "Player not found" });
    if (!auth.isAuthenticatedUser(req)) delete player.mmr;
    res.status(200).json(player);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:steamID/stats", async (req, res) => {
  try {
    const steamID = req.params.steamID;
    const stats = await players.getStats(steamID);
    if (!stats) return res.status(404).send({ message: "Player not found" });
    if (!auth.isAuthenticatedUser(req)) delete stats.mmr;
    res.status(200).json(stats);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:steamID/games", async (req, res) => {
  try {
    const steamID = req.params.steamID;
    const limit = req.query.limit;
    const recentMatches = await players.getGames(steamID, limit);
    res.status(200).json(recentMatches);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:steamID/heroes", cache("5 minutes"), async (req, res) => {
  try {
    const steamID = req.params.steamID;
    throw new Error("Not implemented");
    const playerInfo = await players.getHeroStats(steamID);
    res.status(200).json(playerInfo);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:steamID/records", cache("5 minutes"), async (req, res) => {
  try {
    const steamID = req.params.steamID;
    throw new Error("Not implemented");
    const playerInfo = await players.getRecords(steamID);
    res.status(200).json(playerInfo);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:steamID/daily_quests", auth.userAuth, async (req, res) => {
  try {
    const steamID = req.params.steamID;
    const dailyQuests = await players.getDailyQuests(steamID);
    res.status(200).json(dailyQuests);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:steamID/weekly_quests", auth.userAuth, async (req, res) => {
  try {
    const steamID = req.params.steamID;
    const dailyQuests = await players.getWeeklyQuests(steamID);
    res.status(200).json(dailyQuests);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

// /api/players/:steamID/daily_quests/reroll?questID=:questid
router.post(
  "/:steamID/daily_quests/reroll",
  auth.userAuth,
  async (req, res) => {
    try {
      const steamID = req.params.steamID;
      const questID = req.query.questID;
      const dailyQuests = await players.rerollQuest(steamID, questID);
      res.status(200).json(dailyQuests);
    } catch (error) {
      console.log(error);
      res.status(500).json(error.toString());
    }
  }
);

// /api/players/:steamID/daily_quests/claim?questID=:questid
router.post("/:steamID/daily_quests/claim", auth.userAuth, async (req, res) => {
  try {
    const steamID = req.params.steamID;
    const questID = req.query.questID;
    const rewards = await players.claimQuestReward(steamID, questID);
    res.status(200).json(rewards);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

router.get("/:steamID/achievements", async (req, res) => {
  try {
    const steamID = req.params.steamID;
    const achievements = await quests.getActiveAchievementsForPlayer(steamID);
    res.status(200).json(achievements);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

// /api/players/:steamID/daily_quests/claim?questID=:questid
router.post("/:steamID/achievements/claim", auth.userAuth, async (req, res) => {
  try {
    const steamID = req.params.steamID;
    const questID = req.query.questID;
    const rewards = await players.claimQuestReward(steamID, questID);
    res.status(200).json(rewards);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.toString() });
  }
});

router.post("/:steamID/transaction", auth.adminAuth, async (req, res) => {
  try {
    const steamID = req.params.steamID;
    const { itemTransaction } = JSON.parse(JSON.stringify(req.body));
    const playerExists = await players.doesPlayerExist(steamID);
    if (!playerExists)
      return res.status(404).send({ message: "Player not found" });
    await players.itemTransaction(steamID, itemTransaction);
    res.status(200).send({ message: "Transaction Complete" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Transaction Failed", error: error.toString() });
  }
});

router.post(
  "/:steamID/buy_item/:cosmetic_id",
  auth.userAuth,
  async (req, res) => {
    try {
      const steamID = req.params.steamID;
      const cosmetic_id = req.params.cosmetic_id;
      const playerExists = await players.doesPlayerExist(steamID);
      if (!playerExists)
        return res.status(404).send({ message: "Player not found" });
      await players.buyCosmetic(steamID, cosmetic_id);
      res.status(200).send({ message: "Transaction Complete" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Transaction Failed", error: error.toString() });
    }
  }
);

router.get("/:steamID/cosmetics", async (req, res) => {
  try {
    const steamID = req.params.steamID;
    const filter = req.query.filter;
    const onlyEquipped = filter === "equipped";
    const playerInfo = await players.getAllCosmetics(steamID, onlyEquipped);
    res.status(200).json(playerInfo);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.post(
  "/:steamID/cosmetics/:cosmetic_id/equip",
  auth.userAuth,
  async (req, res) => {
    try {
      const steamID = req.params.steamID;
      const cosmetic_id = req.params.cosmetic_id;
      const equip = req.query.equip == "true";
      const playerInfo = await players.equipCosmetics(
        steamID,
        cosmetic_id,
        equip
      );
      res.status(200).json(playerInfo);
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: error.message });
    }
  }
);

router.put(
  "/:steamID/cosmetics/:cosmetic_id/equip",
  auth.userAuth,
  async (req, res) => {
    try {
      const cosmetic_id = req.params.cosmetic_id;
      const playerInfo = await players.equipCosmetics(cosmetic_id, true);
      res.status(200).json(playerInfo);
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: error.message });
    }
  }
);

router.delete(
  "/:steamID/cosmetics/:cosmetic_id/equip",
  auth.userAuth,
  async (req, res) => {
    try {
      const cosmetic_id = req.params.cosmetic_id;
      const playerInfo = await players.equipCosmetics(cosmetic_id, false);
      res.status(200).json(playerInfo);
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: error.message });
    }
  }
);

router.get("/:steamID/battle_pass", auth.userAuth, async (req, res) => {
  try {
    const steamID = req.params.steamID;
    const playerInfo = await players.getPlayerBattlePass(steamID);
    res.status(200).json(playerInfo);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.post(
  "/:steamID/open_chest/:chestid",
  auth.userAuth,
  async (req, res) => {
    try {
      const steamID = req.params.steamID;
      const chestid = req.params.chestid;
      const rows = await players.openChest(steamID, chestid);
      res.status(200).json(rows);
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: error.message });
    }
  }
);

router.post("/:steamID/use_item/:itemid", auth.userAuth, async (req, res) => {
  try {
    const steamID = req.params.steamID;
    const itemid = req.params.itemid;

    await players.consumeItem(steamID, itemid);
    res.status(200).send({ message: "used item" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

router.get("/leaderboard", auth.userAuth, async (req, res) => {
  try {
    const leaderboard = await players.getLeaderboard();
    res.status(200).json(leaderboard);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

module.exports = router;
