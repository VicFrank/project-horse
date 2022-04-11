const quests = require("../db/quests");

const achievements = require("./data/quests/achievements");
const dailyQuests = require("./data/quests/daily_quests");
// const weeklyQuests = require("./data/quests/weekly_quests");

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

(async function () {
  await InitializeQuests();
})();
