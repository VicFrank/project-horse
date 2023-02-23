const { getNumClaimableRewardsAtLevel } = require("./battlepass");

describe("Unlocked battle pass rewards <= 80", () => {
  const unlockedRewards = Array.from({ length: 80 }).map((e, i) => ({
    level: i + 1,
    expectedTotalRewards: i + 1,
  }));
  test.each(unlockedRewards)(
    "Level $level has $expectedTotalRewards total rewards",
    ({ level, expectedTotalRewards }) => {
      expect(
        getNumClaimableRewardsAtLevel(level, true)
      ).toBe(expectedTotalRewards);
    }
  );
});

describe("Free battle pass rewards <= 80", () => {
  // Every 5 levels you get a reward and a reward at level 1
  let totalRewards = 1;
  const freeRewards = Array.from({ length: 80 }).map((e, i) => {
    if ((i + 1) % 5 == 0)
      totalRewards++;
    return { level: i + 1, expectedTotalRewards: totalRewards }
  });
  test.each(freeRewards)(
    "Level $level has $expectedTotalRewards total rewards",
    ({ level, expectedTotalRewards }) => {
      expect(
        getNumClaimableRewardsAtLevel(level, false)
      ).toBe(expectedTotalRewards);
    }
  );
});

test("Battle pass rewards past level 80", () => {
  let expectedFree = 17;
  let expectedUnlocked = 80;
  for (let level = 81; level <= 1000; level++) {
    if (level % 5 == 0) {
      expectedFree++;
      expectedUnlocked++;
    }
    expect(getNumClaimableRewardsAtLevel(level, true)).toBe(expectedUnlocked);
    expect(getNumClaimableRewardsAtLevel(level, false)).toBe(expectedFree);
  }
});