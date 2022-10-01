const quests = require("../db/quests");
const players = require("../db/players");
const cosmetics = require("../db/cosmetics");

const achievements = require("./data/quests/achievements");
const dailyQuests = require("./data/quests/daily_quests");
const loginQuests = require("./data/quests/login_quests");
const welcomeQuests = require("./data/quests/welcome_quests");

async function InitializeQuests() {
  try {
    const parsedAchievements = achievements.map((achievement) => ({
      ...achievement,
      isAchievement: true,
    }));
    await quests.bulkCreateQuests(parsedAchievements);
    await quests.bulkCreateQuests(dailyQuests);
    console.log("Quests initialized");
  } catch (error) {
    throw error;
  }
}

async function InitializeDailyQuests() {
  try {
    // delete all existing daily quests
    await quests.deleteAllDailyQuests();
    // create the new ones
    await quests.bulkCreateQuests(dailyQuests);
    // assign quests to all players
    for (const steamID of await players.getAllSteamIDs()) {
      await players.createInitialDailyQuests(steamID, 3);
    }
    console.log("Quests initialized");
  } catch (error) {
    throw error;
  }
}

async function InitializeLoginQuests() {
  try {
    await quests.clearLoginQuests();
    for (const quest of loginQuests) {
      const { day, coins, xp, cosmetic_name } = quest;
      const cosmetic = cosmetic_name
        ? await cosmetics.getCosmeticByName(cosmetic_name)
        : null;
      await quests.createLoginQuest(day, coins, xp, cosmetic?.cosmetic_id);
    }
    const steamIDs = await players.getAllSteamIDs();
    for (const steamID of steamIDs) {
      await players.resetLoginQuests(steamID);
    }
    console.log("Login quests initialized");
  } catch (error) {
    throw error;
  }
}

async function InitializeWelcomeQuests() {
  try {
    await quests.clearWelcomeQuests();
    for (const quest of welcomeQuests) {
      const { day, coins, xp, cosmetic_name } = quest;
      const cosmetic = cosmetic_name
        ? await cosmetics.getCosmeticByName(cosmetic_name)
        : null;
      await quests.createWelcomeQuest(day, coins, xp, cosmetic?.cosmetic_id);
    }
    const steamIDs = await players.getAllSteamIDs();
    for (const steamID of steamIDs) {
      await players.resetWelcomeQuests(steamID);
    }
    console.log("Welcome quests initialized");
  } catch (error) {
    throw error;
  }
}

(async function () {
  await InitializeQuests();
  await InitializeLoginQuests();
  await InitializeWelcomeQuests();
  await InitializeDailyQuests();
})();
