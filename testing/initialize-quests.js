const quests = require("../db/quests");
const players = require("../db/players");

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
    // await quests.bulkCreateQuests(weeklyQuests);
    console.log("Quests initialized");
  } catch (error) {
    throw error;
  }
}

async function InitializeLoginQuests() {
  try {
    for (const quest of loginQuests) {
      const { day, coins, xp } = quest;
      await quests.createLoginQuest(day, coins, xp);
    }
    const steamIDs = await players.getAllSteamIds();
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
      const { day, coins, xp } = quest;
      await quests.createWelcomeQuest(day, coins, xp);
    }
    const steamIDs = await players.getAllSteamIds();
    for (const steamID of steamIDs) {
      await players.resetWelcomeQuests(steamID);
    }
    console.log("Welcome quests initialized");
  } catch (error) {
    throw error;
  }
}

(async function () {
  // await InitializeQuests();
  // await InitializeLoginQuests();
  await InitializeWelcomeQuests();
})();
