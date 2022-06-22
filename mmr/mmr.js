const getEloProbability = (winnerRating, loserRating) => {
  probability = 1.0 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
  return probability;
};

const getEloRatingChange = (winnerRank, loserRank, K = 25) => {
  const Pa = getEloProbability(winnerRank, loserRank);
  const ratingChange = Math.floor(K * (1 - Pa), 1);

  // Always return at least some mmr change
  if (ratingChange === 0) return 1;

  return ratingChange;
};

const getLadderRatingPoints = (place) => {
  switch (place) {
    case 1:
      return 100;
    case 2:
      return 75;
    case 3:
      return 50;
    case 4:
      return 15;
    case 5:
      return -15;
    case 6:
      return -50;
    case 7:
      return -75;
    case 8:
      return -100;
    default:
      return 0;
  }
};

const getCurrentRankFloor = (currentMMR) => {
  if (currentMMR < 500) return 0; // herald
  if (currentMMR < 1000) return 500; // guardian
  if (currentMMR < 1500) return 1000; // crusader
  if (currentMMR < 2000) return 1500; // archon
  if (currentMMR < 2500) return 2000; // legend
  if (currentMMR < 3500) return 2500; // ancient
  if (currentMMR < 4500) return 3500; // divine
  else return 4500; // immortal
};

const getCurrentRank = (mmr) => {
  if (mmr < 500) return "Herald";
  if (mmr < 1000) return "Guardian";
  if (mmr < 1500) return "Crusader";
  if (mmr < 2000) return "Archon";
  if (mmr < 2500) return "Legend";
  if (mmr < 3500) return "Ancient";
  if (mmr < 4500) return "Divine";
  else return "Immortal";
};

const getMatchRatingChange = (currentMMR, winners, losers) => {
  // Calculate rating by saying that we "beat" all players lower than us, and
  // "lost" to all players higher than us.
  let ratingChange = 0;
  for (const winner of winners) {
    ratingChange -= getEloRatingChange(winner.mmr, currentMMR);
  }
  for (const loser of losers) {
    ratingChange += getEloRatingChange(currentMMR, loser.mmr);
  }

  if (ratingChange === 0) return 1;
  return ratingChange;
};

const getMatchLadderRatingChange = (currentMMR, place) => {
  const baseRatingChange = getLadderRatingPoints(place);
  // there are certain rank thresholds you cannot fall below
  const currentRankFloor = getCurrentRankFloor(currentMMR);
  const newRating = Math.max(currentMMR + baseRatingChange, currentRankFloor);
  return newRating - currentMMR;
};

module.exports = {
  getMatchRatingChange,
  getMatchLadderRatingChange,
};
