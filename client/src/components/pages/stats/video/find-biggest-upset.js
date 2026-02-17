const fightReport = require("./fight-report.json");

// Create a map of camp name to rank/MMR
const campStats = new Map();
fightReport.standings.forEach((camp) => {
  campStats.set(camp.name, {
    rank: camp.rank,
    mmr: camp.mmr,
    size: camp.size,
  });
});

// Parse record string "wins-losses-draws"
function parseRecord(record) {
  const [wins, losses, draws] = record.split("-").map(Number);
  return { wins, losses, draws };
}

// Find the biggest upset
let biggestUpset = null;
let maxRankDifference = 0;

// Go through each camp's matchups
for (const [campName, matchups] of Object.entries(fightReport.matrix)) {
  const campInfo = campStats.get(campName);
  if (!campInfo) continue;

  // Check each opponent
  for (const [opponentName, recordStr] of Object.entries(matchups)) {
    if (campName === opponentName) continue; // Skip mirror matches

    const opponentInfo = campStats.get(opponentName);
    if (!opponentInfo) continue;

    const record = parseRecord(recordStr);

    // An upset is when a lower-ranked (higher rank number) camp beats a higher-ranked (lower rank number) camp
    if (record.wins > 0 && campInfo.rank > opponentInfo.rank) {
      const rankDifference = campInfo.rank - opponentInfo.rank;
      const mmrDifference = opponentInfo.mmr - campInfo.mmr;

      if (rankDifference > maxRankDifference) {
        maxRankDifference = rankDifference;
        biggestUpset = {
          underdog: campName,
          underdogRank: campInfo.rank,
          underdogMMR: campInfo.mmr,
          underdogSize: campInfo.size,
          favorite: opponentName,
          favoriteRank: opponentInfo.rank,
          favoriteMMR: opponentInfo.mmr,
          favoriteSize: opponentInfo.size,
          rankDifference,
          mmrDifference,
          record: recordStr,
          wins: record.wins,
          losses: record.losses,
          winPercentage: (
            (record.wins / (record.wins + record.losses + record.draws)) *
            100
          ).toFixed(1),
        };
      }
    }
  }
}

// Display results
if (biggestUpset) {
  console.log("\n🔥 BIGGEST UPSET IN THE FIGHT REPORT 🔥\n");
  console.log(
    "═══════════════════════════════════════════════════════════════\n",
  );

  console.log(`🏆 UNDERDOG: ${biggestUpset.underdog}`);
  console.log(`   Rank: #${biggestUpset.underdogRank}`);
  console.log(`   MMR: ${biggestUpset.underdogMMR}`);
  console.log(`   Size: ${biggestUpset.underdogSize}`);

  console.log("");
  console.log(`   VS`);
  console.log("");

  console.log(`💀 FAVORITE: ${biggestUpset.favorite}`);
  console.log(`   Rank: #${biggestUpset.favoriteRank}`);
  console.log(`   MMR: ${biggestUpset.favoriteMMR}`);
  console.log(`   Size: ${biggestUpset.favoriteSize}`);

  console.log(
    "\n───────────────────────────────────────────────────────────────\n",
  );

  console.log(`📊 MATCHUP STATS:`);
  console.log(
    `   Record: ${biggestUpset.record} (${biggestUpset.winPercentage}% win rate)`,
  );
  console.log(`   Rank Difference: ${biggestUpset.rankDifference} ranks`);
  console.log(`   MMR Difference: ${biggestUpset.mmrDifference} MMR`);

  console.log(
    "\n═══════════════════════════════════════════════════════════════\n",
  );

  console.log(
    `📝 SUMMARY: Rank #${biggestUpset.underdogRank} ${biggestUpset.underdog} beat rank #${biggestUpset.favoriteRank} ${biggestUpset.favorite}`,
  );
  console.log(
    `   ${biggestUpset.wins} time(s), despite being ${biggestUpset.rankDifference} ranks lower!`,
  );
  console.log("");
} else {
  console.log("No upsets found in the data.");
}

// Also find the most unexpected win (biggest MMR difference)
let biggestMMRUpset = null;
let maxMMRDifference = 0;

for (const [campName, matchups] of Object.entries(fightReport.matrix)) {
  const campInfo = campStats.get(campName);
  if (!campInfo) continue;

  for (const [opponentName, recordStr] of Object.entries(matchups)) {
    if (campName === opponentName) continue;

    const opponentInfo = campStats.get(opponentName);
    if (!opponentInfo) continue;

    const record = parseRecord(recordStr);

    if (record.wins > 0 && campInfo.mmr < opponentInfo.mmr) {
      const mmrDifference = opponentInfo.mmr - campInfo.mmr;

      if (mmrDifference > maxMMRDifference) {
        maxMMRDifference = mmrDifference;
        biggestMMRUpset = {
          underdog: campName,
          underdogRank: campInfo.rank,
          underdogMMR: campInfo.mmr,
          favorite: opponentName,
          favoriteRank: opponentInfo.rank,
          favoriteMMR: opponentInfo.mmr,
          mmrDifference,
          record: recordStr,
          wins: record.wins,
        };
      }
    }
  }
}

if (
  biggestMMRUpset &&
  biggestMMRUpset.mmrDifference > biggestUpset.mmrDifference
) {
  console.log("\n🎯 BONUS: BIGGEST MMR UPSET\n");
  console.log(
    `   ${biggestMMRUpset.underdog} (MMR: ${biggestMMRUpset.underdogMMR}, Rank: #${biggestMMRUpset.underdogRank})`,
  );
  console.log(
    `   beat ${biggestMMRUpset.favorite} (MMR: ${biggestMMRUpset.favoriteMMR}, Rank: #${biggestMMRUpset.favoriteRank})`,
  );
  console.log(
    `   ${biggestMMRUpset.wins} time(s) despite a ${biggestMMRUpset.mmrDifference} MMR difference!`,
  );
  console.log("");
}
