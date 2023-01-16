const getEloProbability = (winnerRating, loserRating) => {
  probability = 1.0 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
  return probability;
};

const getEloRatingChange = (winnerRank, loserRank, K = 20) => {
  const Pa = getEloProbability(winnerRank, loserRank);
  const ratingChange = Math.floor(K * (1 - Pa), 1);

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
      return -10;
    case 6:
      return -30;
    case 7:
      return -55;
    case 8:
      return -80;
    default:
      return 0;
  }
};

const getHeraldLadderRatingPoints = (place) => {
  switch (place) {
    case 1:
      return 200;
    case 2:
      return 150;
    case 3:
      return 100;
    case 4:
      return 75;
    case 5:
      return 50;
    case 6:
      return 25;
    case 7:
      return 10;
    case 8:
      return 0;
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

const getRankBadge = (mmr) => {
  if (mmr < 500) return "Herald";
  if (mmr < 1000) return "Guardian";
  if (mmr < 1500) return "Crusader";
  if (mmr < 2000) return "Archon";
  if (mmr < 2500) return "Legend";
  if (mmr < 3500) return "Ancient";
  if (mmr < 4500) return "Divine";
  else return "Immortal";
};

const getRankPips = (mmr) => {
  if (mmr < 100) return 1;
  if (mmr < 200) return 2;
  if (mmr < 300) return 3;
  if (mmr < 400) return 4;
  if (mmr < 500) return 5;
  if (mmr < 600) return 1;
  if (mmr < 700) return 2;
  if (mmr < 800) return 3;
  if (mmr < 900) return 4;
  if (mmr < 1000) return 5;
  if (mmr < 1100) return 1;
  if (mmr < 1200) return 2;
  if (mmr < 1300) return 3;
  if (mmr < 1400) return 4;
  if (mmr < 1500) return 5;
  if (mmr < 1600) return 1;
  if (mmr < 1700) return 2;
  if (mmr < 1800) return 3;
  if (mmr < 1900) return 4;
  if (mmr < 2000) return 5;
  if (mmr < 2100) return 1;
  if (mmr < 2200) return 2;
  if (mmr < 2300) return 3;
  if (mmr < 2400) return 4;
  if (mmr < 2500) return 5;
  if (mmr < 2700) return 1;
  if (mmr < 2900) return 2;
  if (mmr < 3100) return 3;
  if (mmr < 3300) return 4;
  if (mmr < 3500) return 5;
  if (mmr < 3700) return 1;
  if (mmr < 3900) return 2;
  if (mmr < 4100) return 3;
  if (mmr < 4300) return 4;
  if (mmr < 4500) return 5;
  return 0;
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
  const shouldUseHeraldMMR = currentMMR < 1000;
  const baseRatingChange = shouldUseHeraldMMR
    ? getHeraldLadderRatingPoints(place)
    : getLadderRatingPoints(place);
  // there are certain rank thresholds you cannot fall below
  const currentRankFloor = getCurrentRankFloor(currentMMR);
  const newRating = Math.max(currentMMR + baseRatingChange, currentRankFloor);
  return newRating - currentMMR;
};

module.exports = {
  getMatchRatingChange,
  getMatchLadderRatingChange,
  getRankBadge,
  getRankPips,
  getCurrentRankFloor,
};
