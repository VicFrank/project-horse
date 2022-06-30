const battlePasses = require("../db/battlepass");
const cosmetics = require("../db/cosmetics");
const players = require("../db/players");
const battlePassLevels = require("./data/battle-pass-rewards");

async function initializeBattlePass() {
  try {
    const existingBattlePass = await battlePasses.getActiveBattlePass();

    if (existingBattlePass) {
      console.log("Battle Pass already exists");
      return;
    }

    // Get all unique cosmetic ids from battle pass levels
    const uniqueCosmeticNames = battlePassLevels.reduce((acc, level) => {
      const { cosmetics } = level;
      for (const id of cosmetics) {
        if (!acc.includes(id)) {
          acc.push(id);
        }
      }
      return acc;
    }, []);

    for (const name of uniqueCosmeticNames) {
      if (!(await cosmetics.exists(name))) {
        console.log(`Cosmetic ${name} does not exist`);
        return;
      }
    }

    // derive the totalXp for each level
    let totalXp = 0;
    for (const level of battlePassLevels) {
      level.totalXp = totalXp;
      totalXp += level.nextLevelXp;
    }

    console.log("Initializing Battle Pass...");

    const battlePass = await battlePasses.createBattlePass(battlePassLevels);
    await battlePasses.setActiveBattlePass(battlePass.battle_pass_id);

    console.log("Adding battle passes to existing players...");
    const steamIDs = await players.getAllSteamIds();
    for (const steamID of steamIDs) {
      await players.createBattlePass(steamID, battlePass.battle_pass_id);
    }

    console.log("Battle Pass initialized");
  } catch (error) {
    throw error;
  }
}

// Deletes all battlepass data
async function deleteBattlePasses() {
  try {
    await battlePasses.deleteBattlePasses();
    console.log("Battle Pass cleared");
  } catch (error) {
    throw error;
  }
}

(async () => {
  await deleteBattlePasses();
  await initializeBattlePass();
})();
