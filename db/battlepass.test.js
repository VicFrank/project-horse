const { getNumClaimableRewardsAtLevel } = require("./battlepass");

describe("Unlocked battle pass rewards < 80", () => {
  const testVals = Array.from({ length: 80 }).map((e, i) => ({
    level: i + 1,
    expectedTotalRewards: i + 1,
  }));
  test.each(testVals)(
    "Level $level has $expectedTotalRewards total rewards",
    ({ level, expectedTotalRewards }) => {
      expect(
        getNumClaimableRewardsAtLevel(level, expectedTotalRewards, true)
      ).toBe(expectedTotalRewards);
    }
  );
});
