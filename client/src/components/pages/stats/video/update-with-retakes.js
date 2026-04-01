const fs = require("fs");
const path = require("path");

// Load both files
const fightReport = require("./fight-report.json");
const retakes = require("./fight-report-retakes.json");

// Camps to recalculate MMR for
const RECALCULATE_MMR_CAMPS = [
  "Harpy (Active)", // SMALL_HARPY
  "Froglet", // MEDIUM_FROGLET
  "Frog", // LARGE_FROG
  "Ancient Frog", // ANCIENT_ANCIENT_FROG
];

console.log("🔄 Updating fight-report.json with retakes data...\n");

// Parse record string "wins-losses-draws"
function parseRecord(record) {
  const [wins, losses, draws] = record.split("-").map(Number);
  return { wins, losses, draws };
}

// Format record object to string
function formatRecord(wins, losses, draws) {
  return `${wins}-${losses}-${draws}`;
}

// 1. Update the matrix with retakes data (overwrite, not add)
console.log("📊 Updating matchup matrix...");
const updatedMatrix = { ...fightReport.matrix };

for (const [campName, matchups] of Object.entries(retakes.matrix)) {
  if (!updatedMatrix[campName]) {
    updatedMatrix[campName] = {};
  }

  for (const [opponent, retakeRecord] of Object.entries(matchups)) {
    const retakeParsed = parseRecord(retakeRecord);

    // Only update if there are actual results in the retakes
    if (
      retakeParsed.wins > 0 ||
      retakeParsed.losses > 0 ||
      retakeParsed.draws > 0
    ) {
      const originalRecord = updatedMatrix[campName][opponent] || "0-0-0";
      updatedMatrix[campName][opponent] = retakeRecord;

      console.log(
        `  ✓ ${campName} vs ${opponent}: ${originalRecord} → ${retakeRecord}`,
      );
    }
  }
}

// 2. Recalculate standings for all camps based on updated matrix
console.log("\n📈 Recalculating standings...");
const updatedStandings = fightReport.standings.map((camp) => {
  const campMatchups = updatedMatrix[camp.name];
  let totalWins = 0;
  let totalLosses = 0;
  let totalDraws = 0;

  if (campMatchups) {
    for (const [, record] of Object.entries(campMatchups)) {
      const parsed = parseRecord(record);
      totalWins += parsed.wins;
      totalLosses += parsed.losses;
      totalDraws += parsed.draws;
    }
  }

  const newRecord = formatRecord(totalWins, totalLosses, totalDraws);
  const oldRecord = camp.record;

  if (newRecord !== oldRecord) {
    console.log(`  ✓ ${camp.name}: ${oldRecord} → ${newRecord}`);
  }

  return {
    ...camp,
    record: newRecord,
  };
});

// 3. Recalculate MMR for specified camps using iterative approach
console.log("\n🎯 Recalculating MMR for specified camps...");

const INITIAL_MMR = 1500;

function calculateExpectedScore(ratingA, ratingB) {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

// Calculate MMR by finding the rating that best explains observed results
function calculateOptimalMMR(matchups, mmrMap, maxIterations = 100) {
  let currentMMR = INITIAL_MMR;

  // Iterate to find equilibrium MMR
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    let totalExpectedScore = 0;
    let totalActualScore = 0;
    let totalGames = 0;

    for (const match of matchups) {
      const opponentMMR = mmrMap.get(match.opponent) || INITIAL_MMR;
      const games = match.wins + match.losses + match.draws;
      const actualScore = match.wins + match.draws * 0.5;
      const expectedScore =
        calculateExpectedScore(currentMMR, opponentMMR) * games;

      totalActualScore += actualScore;
      totalExpectedScore += expectedScore;
      totalGames += games;
    }

    if (totalGames === 0) return INITIAL_MMR;

    // Adjust MMR based on difference between actual and expected
    const difference = totalActualScore - totalExpectedScore;
    const adjustment = difference * 2; // Smaller adjustment factor for stability

    currentMMR += adjustment;

    // Stop if converged (adjustment is small)
    if (Math.abs(adjustment) < 0.1) {
      break;
    }
  }

  return currentMMR;
}

// Create a map of current MMRs
const mmrMap = new Map();
updatedStandings.forEach((camp) => {
  mmrMap.set(camp.name, camp.mmr);
});

// For each camp that needs MMR recalculation, process all their matches
for (const campName of RECALCULATE_MMR_CAMPS) {
  const campMatchups = updatedMatrix[campName];
  if (!campMatchups) {
    console.log(`  ⚠ ${campName}: No matchup data found`);
    continue;
  }

  const matches = [];

  // Collect all matches
  for (const [opponent, record] of Object.entries(campMatchups)) {
    if (opponent === campName) continue; // Skip self

    const parsed = parseRecord(record);
    const totalGames = parsed.wins + parsed.losses + parsed.draws;

    if (totalGames > 0) {
      matches.push({
        opponent,
        wins: parsed.wins,
        losses: parsed.losses,
        draws: parsed.draws,
        total: totalGames,
      });
    }
  }

  const newMMR = Math.round(calculateOptimalMMR(matches, mmrMap));

  // Update the MMR in standings
  const campIndex = updatedStandings.findIndex((c) => c.name === campName);
  if (campIndex !== -1) {
    const oldMMR = updatedStandings[campIndex].mmr;
    updatedStandings[campIndex].mmr = newMMR;

    // Calculate and show actual win rate for reference
    const totalWins = matches.reduce((sum, m) => sum + m.wins, 0);
    const totalGames = matches.reduce((sum, m) => sum + m.total, 0);
    const winRate = ((totalWins / totalGames) * 100).toFixed(1);

    console.log(
      `  ✓ ${campName}: ${oldMMR} → ${newMMR} (Δ${
        newMMR - oldMMR
      }) [Win rate: ${winRate}%]`,
    );
  }
}

// 4. Re-rank based on MMR
console.log("\n🏆 Re-ranking camps by MMR...");
updatedStandings.sort((a, b) => b.mmr - a.mmr);
updatedStandings.forEach((camp, index) => {
  const oldRank = camp.rank;
  camp.rank = index + 1;
  if (oldRank !== camp.rank) {
    console.log(`  ✓ ${camp.name}: Rank #${oldRank} → #${camp.rank}`);
  }
});

// 5. Create updated fight-report object
const updatedFightReport = {
  timestamp: Date.now() / 1000,
  standings: updatedStandings,
  matrix: updatedMatrix,
};

// 6. Write to file
const outputPath = path.join(__dirname, "fight-report.json");
fs.writeFileSync(outputPath, JSON.stringify(updatedFightReport, null, 2));

console.log("\n✅ Successfully updated fight-report.json!");
console.log(`   Timestamp: ${updatedFightReport.timestamp}`);
console.log(`   Total camps: ${updatedStandings.length}`);
console.log(`   Matrix entries: ${Object.keys(updatedMatrix).length}`);
console.log("");
