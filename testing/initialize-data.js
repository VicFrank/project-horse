const { setActiveBattlePass } = require("../db/battlepass");
const battlepasses = require("../db/battlepass");
const cosmetics = require("../db/cosmetics");

const bpLevels = require("./battle-pass-rewards");

async function loadCosmetics() {
  try {
    const loadedCosmetics = await cosmetics.getAllCosmetics();

    if (loadedCosmetics.length > 0) {
      console.log("Cosmetics are already loaded");
      return;
    } else {
      console.log("Adding cosmetics...");
    }

    let promises = [];
    for (let cosmeticData of cosmeticsList) {
      promises.push(
        cosmetics.createCosmetic(
          cosmeticData.cosmetic_name,
          cosmeticData.cosmetic_type,
          cosmeticData.equip_group,
          cosmeticData.cost_coins,
          cosmeticData.cost_usd,
          cosmeticData.rarity
        )
      );
    }

    await Promise.all(promises);
  } catch (error) {
    throw error;
  }
}

async function initializeBattlePass() {
  console.log("Create battle pass levels and rewards");
  // add the totalXp to each level
  let totalXp = 0;
  for (const level of bpLevels) {
    level.totalXp = totalXp;
    totalXp += level.nextLevelXp;
  }

  try {
    const battlePass = await battlepasses.createBattlePass(bpLevels);
    await setActiveBattlePass(battlePass.battle_pass_id);
  } catch (error) {
    throw error;
  }
}

(async function () {
  //   await loadCosmetics();
  //   await initializeBattlePass();
})();
