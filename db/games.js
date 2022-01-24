const { query } = require("./index");
const { getMatchRatingChange } = require("../mmr/mmr");
const Players = require("./players");

module.exports = {
  async createGamePlayer(event) {
    const { matchID, steamID, username, ranked, place, rounds, players } =
      event;

    try {
      await this.upsertGame(matchID, ranked);
      const player = await Players.upsertPlayer(steamID, username);
      const currentMMR = player.mmr;
      let mmrChange = 0;

      if (ranked) {
        const winners = players.filter((p) => !p.hasLost);
        const losers = players.filter(
          (p) => p.hasLost && p.steamID !== steamID
        );

        mmrChange = getMatchRatingChange(currentMMR, winners, losers);
      }

      await query(
        `INSERT INTO game_players(game_id, steam_id, rounds, place, mmr_change)
         values ($1, $2, $3, $4, $5)`,
        [matchID, steamID, rounds, place, mmrChange]
      );

      return { matchID, steamID, mmrChange };
    } catch (error) {
      throw error;
    }
  },

  async upsertGame(matchID, ranked) {
    try {
      const { rows } = await query(
        `INSERT INTO games(game_id, ranked)
         values ($1, $2)
         on conflict(game_id)
         do UPDATE SET ranked = $2
         RETURNING *`,
        [matchID, ranked]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },
};
