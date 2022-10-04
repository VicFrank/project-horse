const { QueryFile } = require("pg-promise");
const { join: joinPath } = require("path");

///////////////////////////////////////////////////////////////////////////////////////////////
// Criteria for deciding whether to place a particular query into an external SQL file or to
// keep it in-line (hard-coded):
//
// - Size / complexity of the query, because having it in a separate file will let you develop
//   the query and see the immediate updates without having to restart your application.
//
// - The necessity to document your query, and possibly keeping its multiple versions commented
//   out in the query file.
//
// In fact, the only reason one might want to keep a query in-line within the code is to be able
// to easily see the relation between the query logic and its formatting parameters. However, this
// is very easy to overcome by using only Named Parameters for your query formatting.
////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = {
  players: {
    create: sql("players/create.sql"),
    addLog: sql("players/addLog.sql"),
    exists: sql("players/exists.sql"),
    get: sql("players/get.sql"),
    getAll: sql("players/getAll.sql"),
    getCoins: sql("players/getCoins.sql"),
    getGameResults: sql("players/getGameResults.sql"),
    getLeaderboard: sql("players/getLeaderboard.sql"),
    getNumRecentGames: sql("players/getNumGames.sql"),
    getNumTopsWithGod: sql("players/getNumTopsWithGod.sql"),
    getTotalNumGames: sql("players/getTotalNumGames.sql"),
    getXpEarnedToday: sql("players/getXpEarnedToday.sql"),
    hasPlus: sql("players/hasPlus.sql"),
    updateCoins: sql("players/updateCoins.sql"),
    updateMMR: sql("players/updateMMR.sql"),
    updateUsername: sql("players/updateUsername.sql"),
    updateUserType: sql("players/updateUserType.sql"),
  },

  playerLoginQuests: {
    getAll: sql("playerLoginQuests/getAll.sql"),
    get: sql("playerLoginQuests/get.sql"),
    getDaysSinceClaimed: sql("playerLoginQuests/getDaysSinceClaimed.sql"),
    setClaimed: sql("playerLoginQuests/setClaimed.sql"),
  },
};

///////////////////////////////////////////////
// Helper for linking to external query files;
function sql(file) {
  const fullPath = joinPath(__dirname, file); // generating full path;

  const options = {
    minify: true,
  };

  const qf = new QueryFile(fullPath, options);

  if (qf.error) {
    console.error(qf.error);
  }

  return qf;
}
