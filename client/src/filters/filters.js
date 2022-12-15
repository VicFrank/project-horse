import dayjs from "dayjs";
const duration = require("dayjs/plugin/duration");
const relativeTime = require("dayjs/plugin/relativeTime");
const utc = require("dayjs/plugin/utc");
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(utc);

// export function duration(secs) {
//   dayjs.duration(secs * 1000).humanize();
// }
export function hhmmss(secs) {
  if (secs > 3600) {
    return dayjs.utc(secs * 1000).format("H:mm:ss");
  } else return dayjs.utc(secs * 1000).format("mm:ss");
}
export function dateFromNow(value) {
  if (value) {
    return dayjs(String(value)).fromNow();
  }
}
export function getExpiration(seconds) {
  if (seconds) {
    return dayjs().add(seconds, "seconds").fromNow();
  }
}
export function localizeNumber(value) {
  if (value) {
    return value.toLocaleString();
  }
}
export function getRankString(rank) {
  switch (rank) {
    case 1:
      return "1st";
    case 2:
      return "2nd";
    case 3:
      return "3rd";
    default:
      return `${rank}th`;
  }
}
export function mmrToRank(mmr) {
  if (mmr < 500) return "Herald";
  if (mmr < 1000) return "Guardian";
  if (mmr < 1500) return "Crusader";
  if (mmr < 2000) return "Archon";
  if (mmr < 2500) return "Legend";
  if (mmr < 3500) return "Ancient";
  if (mmr < 4500) return "Divine";
  else return "Immortal";
}
export function round(value, decimals) {
  {
    if (!value) {
      value = 0;
    }

    if (!decimals) {
      decimals = 0;
    }

    value = Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
    return value;
  }
}
export function percentage(value, decimals) {
  if (!value) {
    value = 0;
  }

  if (!decimals) {
    decimals = 0;
  }

  value = value * 100;
  value = Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  value = value + "%";
  return value;
}
