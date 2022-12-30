const battlePasses = require("../db/battlepass");
const cosmetics = require("../db/cosmetics");
const players = require("../db/players");
const battlePassLevels = require("./data/battle-pass-rewards");
const { query } = require("../db/index");

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
    const steamIDs = await players.getAllSteamIDs();
    for (const steamID of steamIDs) {
      await players.createBattlePass(steamID, battlePass.battle_pass_id);
    }

    console.log("Battle Pass initialized");
  } catch (error) {
    throw error;
  }
}

async function deleteBattlePasses() {
  // Deletes all battlepass data
  try {
    await battlePasses.deleteBattlePasses();
    console.log("Battle Pass cleared");
  } catch (error) {
    throw error;
  }
}

async function claimRewardsForAllPlayers() {
  const getUpgradedBattlePasses = async () => {
    const { rows } = await query(
      `SELECT steam_id, count(*), player_battle_pass.bp_level
      FROM player_battle_pass
      LEFT JOIN player_claimed_battle_pass_rewards USING (steam_id)
      WHERE player_battle_pass.bp_level <= 40 AND unlocked = TRUE
      GROUP BY steam_id, player_battle_pass.bp_level
      HAVING COUNT(*) < player_battle_pass.bp_level`
    );
    return rows;
  };

  const getUnupgradedBattlePasses = async () => {
    const { rows } = await query(
      `SELECT steam_id, count(*), player_battle_pass.bp_level, CEIL(player_battle_pass.bp_level / 5)
        FROM player_battle_pass
        LEFT JOIN player_claimed_battle_pass_rewards USING (steam_id)
        WHERE player_battle_pass.bp_level <= 40 AND player_battle_pass.bp_level > 1 AND unlocked = FALSE
        GROUP BY steam_id, player_battle_pass.bp_level
        HAVING COUNT(*) < CEIL(player_battle_pass.bp_level / 5)`
    );
    return rows;
  };

  const getBattlePassesAbove40 = async () => {
    const { rows } = await query(
      `SELECT steam_id
        FROM player_battle_pass
        WHERE player_battle_pass.bp_level >= 40`
    );
    return rows;
  };

  try {
    const upgradedPlayers = await getUpgradedBattlePasses();
    console.log(
      `Found ${upgradedPlayers.length} upgraded players with unclaimed rewards`
    );
    let count = 1;
    for (const player of upgradedPlayers) {
      const { steam_id } = player;
      await players.claimAllBattlePassRewards(steam_id);
      console.log(`${count++} Claimed rewards for ${steam_id}`);
    }
    count = 1;
    const unupgradedPlayers = await getUnupgradedBattlePasses();
    console.log(
      `Found ${unupgradedPlayers.length} unupgraded players with unclaimed rewards`
    );
    for (const player of unupgradedPlayers) {
      const { steam_id } = player;
      await players.claimAllBattlePassRewards(steam_id);
      console.log(`${count++} Claimed rewards for ${steam_id}`);
    }
    const above40Players = await getBattlePassesAbove40();
    console.log(
      `Found ${above40Players.length} players with battle pass level above 40`
    );
    count = 1;
    for (const player of above40Players) {
      const { steam_id } = player;
      await players.claimAllBattlePassRewards(steam_id);
      console.log(`${count++} Claimed rewards for ${steam_id}`);
    }
  } catch (error) {
    console.log(error);
  }
}

async function fixUninitializedPlayers() {
  try {
    console.log("fixing uninitialized players");
    const { rows: unitializedPlayers } = await query(`
      SELECT * FROM players 
      LEFT JOIN player_battle_pass USING (steam_id)
      WHERE battle_pass_id IS NULL`);

    console.log(
      `Found ${unitializedPlayers.length} uninitialized battle passes`
    );
    const battlePass = await battlePasses.getActiveBattlePass();
    let count = 1;
    for (const player of unitializedPlayers) {
      const { steam_id } = player;
      await players.createBattlePass(steam_id, battlePass.battle_pass_id);
      console.log(count);
      count += 1;
    }

    const { rows: unitializedDailyQuests } = await query(`
    SELECT * FROM players
    LEFT JOIN player_quests USING (steam_id)
    WHERE quest_id IS NULL LIMIT 100;`);

    console.log(
      `Fixed ${unitializedDailyQuests.length} uninitialized daily quests`
    );
    for (const player of unitializedDailyQuests) {
      const { steam_id } = player;
      await players.createInitialDailyQuests(steam_id);
    }

    const { rows: unitializedWeeklyQuests } = await query(`
      SELECT * FROM players
      LEFT JOIN player_welcome_quests USING (steam_id)
      WHERE welcome_quest_id IS NULL LIMIT 100;`);

    console.log(
      `Fixed ${unitializedWeeklyQuests.length} uninitialized weekly quests`
    );
    for (const player of unitializedWeeklyQuests) {
      const { steam_id } = player;
      await players.resetWelcomeQuests(steam_id);
    }

    const { rows: unitializedLoginQuests } = await query(`
      SELECT * FROM players
      LEFT JOIN player_login_quests USING (steam_id)
      WHERE login_quest_id IS NULL LIMIT 100;`);

    console.log(
      `Fixed ${unitializedLoginQuests.length} uninitialized login quests`
    );
    for (const player of unitializedLoginQuests) {
      const { steam_id } = player;
      await players.resetLoginQuests(steam_id);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

(async () => {
  await fixUninitializedPlayers();
  await claimRewardsForAllPlayers();

  await deleteBattlePasses();
  await initializeBattlePass();

  await fixUninitializedPlayers();
})();
