const express = require("express");
const router = express.Router();
const players = require("../db/players");
const abilities = require("../db/abilities");
const cosmetics = require("../db/cosmetics");
const gods = require("../db/gods");
const quests = require("../db/quests");
const auth = require("../auth/auth");
const apicache = require("apicache");

const cache = apicache.middleware;

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 1;
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
    let player = await players.getPlayer(steamID);
    // If an admin gets a player that doesn't exist, create it
    if (!player && auth.isAuthenticatedUser(req)) {
      await players.upsertPlayer(steamID, "placeholder");
      player = await players.getPlayer(steamID);
    }
    if (!auth.isAuthenticatedUser(req)) delete player.mmr;
    res.status(200).json(player);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.post("/:steamID", auth.adminAuth, async (req, res) => {
  try {
    const steamID = req.params.steamID;
    const username = req.body.username;
    const player = await players.upsertPlayer(steamID, username);
    res.status(200).json(player);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:steamID/plus_benefits", async (req, res) => {
  try {
    const steamID = req.params.steamID;
    const hasWeeklyDoubleDown = await players.canUseWeeklyDoubleDown(steamID);
    const canClaimGold = await players.canClaimDailyPlusGold(steamID);
    res.status(200).json({
      hasWeeklyDoubleDown,
      canClaimGold,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.post("/:steamID/claim_daily_gold", auth.userAuth, async (req, res) => {
  try {
    const steamID = req.params.steamID;
    const hasPlus = await players.hasPlus(steamID);
    if (!hasPlus)
      return res.status(400).send({ message: "You do not have plus" });
    const claimed = await players.claimDailyPlusGold(steamID);
    if (!claimed)
      return res
        .status(400)
        .send({ message: "You have already claimed today's daily plus gold" });
    res.status(200).json(claimed);
  } catch (error) {
    if (error.message === "Daily gold already claimed")
      return res.status(400).send({ message: error.message });
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.post("/:steamID/use_doubledown", auth.userAuth, async (req, res) => {
  try {
    const steamID = req.params.steamID;
    const hasWeeklyDoubleDown = await players.canUseWeeklyDoubleDown(steamID);
    if (hasWeeklyDoubleDown) {
      await players.useWeeklyDoubleDown(steamID);
      return res.status(200).send({ message: "Weekly Double Down used" });
    } else {
      await players.consumeDoubledown(steamID);
      return res.status(200).send({ message: "Double Down used" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: error.message });
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

router.get("/:steamID/ability_stats", cache("1 hour"), async (req, res) => {
  try {
    const steamID = req.params.steamID;
    const stats = await abilities.getPlayerAbilityStats(steamID, 9999);
    if (!stats) return res.status(404).send({ message: "Player not found" });
    res.status(200).json(stats);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:steamID/god_stats", cache("1 hour"), async (req, res) => {
  try {
    const steamID = req.params.steamID;
    const stats = await gods.getPlayerGodsStats(steamID, 9999);
    if (!stats) return res.status(404).send({ message: "Player not found" });
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
    // check if limit is a number
    if (limit && isNaN(limit)) {
      console.log("stop");
      return res.status(400).send({ message: "Fuck off" });
    }
    const recentMatches = await players.getGames(steamID, limit);
    for (const match of recentMatches) {
      delete match.mmr_change;
      delete match.mmr;
    }
    res.status(200).json(recentMatches);
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

// /api/players/:steamID/achievements/claim?questID=:questid
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

router.get("/:steamID/welcome_quests", async (req, res) => {
  try {
    const steamID = req.params.steamID;
    const quests = await players.getWelcomeQuests(steamID);
    // if all quests are completed, return an empty array
    const allCompleted = !quests.find((quest) => !quest.claimed);
    if (allCompleted) return res.status(200).json([]);
    else res.status(200).json(quests);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

// /api/players/:steamID/welcome_quests/claim?questID=:questid
router.post("/:steamID/welcome_quests/claim", async (req, res) => {
  try {
    const steamID = req.params.steamID;
    const questID = req.query.questID;
    const quests = await players.claimWelcomeQuests(steamID, questID);
    res.status(200).json(quests);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:steamID/login_quests", async (req, res) => {
  try {
    const steamID = req.params.steamID;
    const quests = await players.getLoginQuests(steamID);
    res.status(200).json(quests);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.post(
  "/:steamID/login_quests/try_complete",
  auth.userAuth,
  async (req, res) => {
    try {
      const steamID = req.params.steamID;
      const completed = await players.tryCompleteLoginQuest(steamID);
      res.status(200).json(completed);
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: error.toString() });
    }
  }
);

// /api/players/:steamID/login_quests/claim?questID=:questid
router.post("/:steamID/login_quests/claim", auth.userAuth, async (req, res) => {
  try {
    const steamID = req.params.steamID;
    const questID = req.query.questID;
    const completed = await players.claimLoginQuest(steamID, questID);
    res.status(200).json(completed);
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
    await players.doItemTransaction(steamID, itemTransaction);
    res.status(200).send({ message: "Transaction Complete" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Transaction Failed", error: error.toString() });
  }
});

router.post(
  "/:steamID/buy_item/:cosmeticID",
  auth.userAuth,
  async (req, res) => {
    try {
      const { steamID, cosmeticID } = req.params;
      const playerExists = await players.doesPlayerExist(steamID);
      if (!playerExists)
        return res.status(404).send({ message: "Player not found" });
      await players.buyCosmetic(steamID, cosmeticID);
      res.status(200).send({ message: "Transaction Complete" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Transaction Failed", error: error.toString() });
    }
  }
);

router.post("/:steamID/redeem_code/:code", auth.userAuth, async (req, res) => {
  try {
    const { steamID, code } = req.params;
    const success = await players.redeemCode(steamID, code);
    res.status(200).json({ success });
  } catch (error) {
    // these return 200s to play nicely with rpcCalls in dota
    if (error.message === "Code not found")
      return res.status(200).json({ message: "Invalid Code" });
    else if (error.message === "Code already redeemed")
      return res.status(200).json({ message: "Code already redeemed" });
    else if (error.message === "Code expired")
      return res.status(200).json({ message: "Code expired" });
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:steamID/cosmetics", async (req, res) => {
  try {
    const steamID = req.params.steamID;
    const filter = req.query.filter;
    const onlyEquipped = filter === "equipped";
    const playerInfo = await players.getCosmetics(steamID, onlyEquipped);
    res.status(200).json(playerInfo);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:steamID/cosmetics/unviewed_types", async (req, res) => {
  try {
    const steamID = req.params.steamID;
    const types = await players.getUnviewedCosmeticTypes(steamID);
    res.status(200).json(types);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.post("/:steamID/cosmetics/view_type", async (req, res) => {
  try {
    const steamID = req.params.steamID;
    const type = req.query.type;
    const parsedType = type.replace(/_/g, " ");
    await players.setCosmeticTypeViewed(steamID, parsedType);
    res.status(200).json({ message: "Cosmetic Type Viewed" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:steamID/gods", async (req, res) => {
  try {
    const steamID = req.params.steamID;
    const gods = await players.getGods(steamID);
    res.status(200).json(gods);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:steamID/gods_with_rewards", async (req, res) => {
  try {
    const steamID = req.params.steamID;
    const gods = await players.getGodsWithRewards(steamID);
    res.status(200).json(gods);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.post("/:steamID/gods/:name/ban", auth.userAuth, async (req, res) => {
  try {
    const { steamID, name } = req.params;
    const { banned } = req.query;
    const god = await players.setGodBanned(steamID, name, banned);
    res.status(200).json(god);
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
      const playerInfo = await players.equipCosmetic(
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
      const playerInfo = await players.equipCosmetic(cosmetic_id, true);
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
      const playerInfo = await players.equipCosmetic(cosmetic_id, false);
      res.status(200).json(playerInfo);
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: error.message });
    }
  }
);

router.get("/:steamID/battle_pass", async (req, res) => {
  try {
    const steamID = req.params.steamID;
    const battlePass = await players.getActiveBattlePass(steamID);
    res.status(200).json(battlePass);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:steamID/battle_pass/levels", async (req, res) => {
  try {
    const steamID = req.params.steamID;
    const levels = await players.getBattlePassLevels(steamID);
    res.status(200).json(levels);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:steamID/battle_pass/items_to_hit_level", async (req, res) => {
  try {
    const steamID = req.params.steamID;
    const targetLevel = req.query.level;
    const cosmeticIDs = await players.getXpItemsToTargetLevel(
      steamID,
      targetLevel
    );
    res.status(200).json(cosmeticIDs);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

// /api/players/:steamID/battle_pass/claim?level=:level
router.post("/:steamID/battle_pass/claim", auth.userAuth, async (req, res) => {
  try {
    const steamID = req.params.steamID;
    const level = req.query.level;
    const claimed = await players.claimBattlePassReward(steamID, level);
    res.status(200).json(claimed);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.post(
  "/:steamID/battle_pass/claim_all",
  auth.userAuth,
  async (req, res) => {
    try {
      const steamID = req.params.steamID;
      const claimedRewards = await players.claimAllBattlePassRewards(steamID);
      res.status(200).json(claimedRewards);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Server Error" });
    }
  }
);

router.post(
  "/:steamID/open_chest/:chestid",
  auth.userAuth,
  async (req, res) => {
    try {
      const steamID = req.params.steamID;
      const chestid = req.params.chestid;
      const cosmetic = await cosmetics.getCosmetic(chestid);
      if (!cosmetic)
        return res.status(404).send({ message: "No chest found with this ID" });
      if (cosmetic.cosmetic_name.includes("unique")) {
        const reward = await players.openUniqueChest(steamID, chestid);
        return res.status(200).json(reward);
      } else {
        const reward = await players.openChest(steamID, chestid);
        return res.status(200).json(reward);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: error.message });
    }
  }
);

router.get(
  "/:steamID/chest_drops/:chestid",
  auth.userAuth,
  async (req, res) => {
    try {
      const steamID = req.params.steamID;
      const chestID = req.params.chestid;
      const rewards = await players.getUniqueChestDrops(steamID, chestID);
      res.status(200).json(rewards);
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

    const result = await players.consumeItem(steamID, itemid);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

router.get(
  "/leaderboard",
  cache("5 minutes"),
  auth.userAuth,
  async (req, res) => {
    try {
      const leaderboard = await players.getLeaderboard();
      res.status(200).json(leaderboard);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Server Error" });
    }
  }
);

module.exports = router;
