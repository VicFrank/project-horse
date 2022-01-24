import dayjs from "dayjs";
const duration = require("dayjs/plugin/duration");
const relativeTime = require("dayjs/plugin/relativeTime");
const utc = require("dayjs/plugin/utc");
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(utc);

export default {
  filters: {
    duration: function (secs) {
      return dayjs.duration(secs * 1000).humanize();
    },
    hhmmss: function (secs) {
      if (secs > 3600) {
        return dayjs.utc(secs * 1000).format("H:mm:ss");
      } else return dayjs.utc(secs * 1000).format("mm:ss");
    },
    dateFromNow: function (value) {
      if (value) {
        return dayjs(String(value)).fromNow();
      }
    },
    getExpiration: function (seconds) {
      if (seconds) {
        return dayjs().add(seconds, "seconds").fromNow();
      }
    },
    localizeNumber: function (value) {
      if (value) {
        return value.toLocaleString();
      }
    },
    round: function (value, decimals) {
      {
        if (!value) {
          value = 0;
        }

        if (!decimals) {
          decimals = 0;
        }

        value =
          Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
        return value;
      }
    },
    percentage: function (value, decimals) {
      if (!value) {
        value = 0;
      }

      if (!decimals) {
        decimals = 0;
      }

      value = value * 100;
      value =
        Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
      value = value + "%";
      return value;
    },
  },
  create: function (Vue) {
    Object.keys(this.filters).forEach(
      function (filter) {
        Vue.filter(filter, this.filters[filter]);
      }.bind(this)
    );
  },
};
