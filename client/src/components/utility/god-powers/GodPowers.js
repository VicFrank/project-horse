const gods = {
  dazzle: ["shallowGrave", "cheatingDeath"],
  runeGod: [],
  legionCommander: ["stonehallPike"],
  brewmaster: [],
  spiritBreaker: [],
  sorlaKhan: ["warmonger"],
  pudge: ["beefyBoy"],
  rix: ["oathed", "assault"],
  shopkeeper: ["letsMakeADeal"],
  rubick: [],
  lifestealer: ["feast"],
  ogreMagi: ["multicast"],
  aghanim: ["sorceryForDummies"],
  ladyAnshu: ["hymnOfStCrella"],
  donkeyAghanim: ["sorceryVolumeTwo"],
  gambler: ["allIn"],
  phantomAssassin: ["veiledPact"],
  alchemist: ["greevilsGreed", "unstableConcotion"],
  kanna: ["preyOnTheWeak"],
  crystalMaiden: [],
  tinker: ["rearm"],
  bloodseeker: ["bloodrage"],
  centaur: ["retaliate"],
  tomeGod: [],
  jmuy: ["wisdomOfTheElders"],
  selemene: ["darkMoonBlessing"],
  boomer: ["bileExplosion"],
  toyPudge: [],
  counterStrike: [],
  glados: [],
  bonelessAghanim: ["sorceryVolumeThree"],
  chaosGod: [],
  towerGod: [],
  icefrog: [],
};

const getGodPowers = (god) => {
  return gods[god];
};

export default getGodPowers;
