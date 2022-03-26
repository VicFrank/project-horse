const getEloProbability = (winnerRating, loserRating) => {
  probability = 1.0 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
  return probability;
};

const getEloRatingChange = (winnerRank, loserRank, K = 50) => {
  const Pa = getEloProbability(winnerRank, loserRank);
  const ratingChange = Math.floor(K * (1 - Pa), 1);

  // Always return at least some mmr change
  if (ratingChange === 0) return 1;

  return ratingChange;
};

const getMatchRatingChange = (currentMMR, winners, losers) => {
  // Calculate rating by saying that we "beat" all players lower than us, and
  // "lost" to all players higher than us.
  let ratingChange = 0;
  for (const winner of winners) {
    ratingChange += getEloRatingChange(winner.mmr, currentMMR);
  }
  for (const loser of losers) {
    ratingChange += getEloRatingChange(currentMMR, loser.mmr);
  }

  if (ratingChange === 0) return 1;
  return ratingChange;
};

module.exports = {
  getMatchRatingChange,
};
