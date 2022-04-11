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

(async function () {
  await initializeCosmetics();
})();
