const { query } = require("./index");

module.exports = {
  async getGodsStats(hours = 3600) {
    try {
      const gamesQuery = await query(`SELECT COUNT(*) FROM games`);
      const numGames = gamesQuery.rows[0].count;
      // const numGames = await query(
      //   `SELECT COUNT(*) FROM games WHERE end_time > NOW() - INTERVAL '${hours} hours'`
      // )

      const { rows } = await query(`
        SELECT
          count(*) AS god_freq,
          god,
          count(*) FILTER (WHERE place = 1) AS first_place,
          count(*) FILTER (WHERE place = 2) AS second_place,
          count(*) FILTER (WHERE place = 3) AS third_place,
          count(*) FILTER (WHERE place = 4) AS fourth_place,
          count(*) FILTER (WHERE place = 5) AS fifth_place,
          count(*) FILTER (WHERE place = 6) AS sixth_place,
          count(*) FILTER (WHERE place = 7) AS seventh_place,
          count(*) FILTER (WHERE place = 8) AS eighth_place,
          TRUNC (SUM(place)::decimal / count(*)::decimal, 2) AS avg_place
        FROM game_players
        JOIN games
        USING (game_id)
        WHERE games.ranked = true
        -- AND games.end_time > NOW() - INTERVAL '${hours} hours'
        GROUP BY god
        ORDER BY avg_place ASC
      `);
      const gods = rows.map((row) => ({
        ...row,
        pick_rate: row.god_freq / numGames,
      }));
      return gods;
    } catch (error) {
      throw error;
    }
  },
};
