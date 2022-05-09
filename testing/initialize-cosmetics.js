const cosmetics = require("../db/cosmetics");
const comseticsList = require("./data/cosmetics-list");

async function initializeCosmetics() {
  try {
    console.log("Initializing cosmetics...");
    await cosmetics.bulkCreateCosmetics(comseticsList);
    console.log("Cosmetics initialized");
  } catch (error) {
    throw error;
  }
}

async function clearCosmetics() {
  try {
    console.log("Deleting all cosmetics...");
    await cosmetics.deleteAllCosmetics();
    console.log("Cosmetics Deleted");
  } catch (error) {
    throw error;
  }
}

(async function () {
  await clearCosmetics();
  await initializeCosmetics();
})();
