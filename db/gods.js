const { query } = require("./index");
const games = require("./games");
const players = require("./players");
const { MAJOR_PATCHES } = require("../common/patches")

module.exports = {
  async getGodsStats(hours = 720, minMMR = 0) {
    try {
      let numGames = await games.getNumGames(hours);
      const { rows } = await query(
        `
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
        AND games.created_at > NOW() - $1 * INTERVAL '1 HOUR'
        AND game_players.mmr > $2
        GROUP BY god
        ORDER BY avg_place ASC
      `,
        [hours, minMMR]
      );

      if (minMMR > 0)
        numGames = rows.reduce((acc, row) => acc + Number(row.god_freq), 0);

      const gods = rows.map((row) => ({
        ...row,
        pick_rate: row.god_freq / numGames,
        placements: [
          row.first_place / row.god_freq,
          row.second_place / row.god_freq,
          row.third_place / row.god_freq,
          row.fourth_place / row.god_freq,
          row.fifth_place / row.god_freq,
          row.sixth_place / row.god_freq,
          row.seventh_place / row.god_freq,
          row.eighth_place / row.god_freq,
        ],
      }));
      return gods;
    } catch (error) {
      throw error;
    }
  },

  async getPlayerGodsStats(steamID, hours = 720) {
    try {
      const numGames = await players.getNumGames(steamID, hours);

      const { rows } = await query(
        `
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
          AND games.created_at > NOW() - $1 * INTERVAL '1 HOUR'
          AND steam_id = $2
        GROUP BY god
        ORDER BY avg_place ASC
      `,
        [hours, steamID]
      );
      const gods = rows.map((row) => ({
        ...row,
        pick_rate: row.god_freq / numGames,
        placements: [
          row.first_place / row.god_freq,
          row.second_place / row.god_freq,
          row.third_place / row.god_freq,
          row.fourth_place / row.god_freq,
          row.fifth_place / row.god_freq,
          row.sixth_place / row.god_freq,
          row.seventh_place / row.god_freq,
          row.eighth_place / row.god_freq,
        ],
      }));
      return gods;
    } catch (error) {
      throw error;
    }
  },

  async getGodsStatsRollup(startDate, endDate, mmrOption) {
    try {
      const { rows } = await query(
        `
        SELECT 
          god_name,
          sum(picks)         AS picks,
          sum(first_place)   AS first_place,
          sum(second_place)  AS second_place,
          sum(third_place)   AS third_place,
          sum(fourth_place)  AS fourth_place,
          sum(fifth_place)   AS fifth_place,
          sum(sixth_place)   AS sixth_place,
          sum(seventh_place) AS seventh_place,
          sum(eighth_place)  AS eighth_place,
          sum(place_sum)     AS place_sum,
          sum(first_place)
            + sum(second_place)
            + sum(third_place)
            + sum(fourth_place) AS top_four_sum

        FROM stats_gods_rollup join rollup_types using (type_id)
        WHERE type_id = $1
        AND day between $2 and $3
        GROUP BY god_name
        ORDER BY picks DESC;
      `,
        [mmrOption, startDate, endDate]
      );
      numGames = rows.reduce((acc, row) => acc + Number(row.picks), 0);

      const gods = rows.map((row) => ({
        ...row,
        god: row.god_name,
        pick_rate: row.picks / numGames,
        win_rate: row.first_place / row.picks,
        top_four_rate: row.top_four_sum / row.picks,
        avg_place: row.place_sum / row.picks,
        placements: [
          row.first_place / row.picks,
          row.second_place / row.picks,
          row.third_place / row.picks,
          row.fourth_place / row.picks,
          row.fifth_place / row.picks,
          row.sixth_place / row.picks,
          row.seventh_place / row.picks,
          row.eighth_place / row.picks,
        ],
      }));
      return gods;
    } catch (error) {
      throw error;
    }
  },

  async getGodDailyStats(godName, mmrOption, limit = 7) {
    try {
      const { rows } = await query(
        `
        SELECT day::date,
          sum(picks)         AS picks,
          sum(first_place)   AS first_place,
          sum(place_sum)     AS place_sum,
          sum(first_place)
            + sum(second_place)
            + sum(third_place)
            + sum(fourth_place) AS top_four_sum
        FROM stats_gods_rollup join rollup_types using (type_id)
        WHERE god_name = $1
          AND type_id = $2
        GROUP BY day
        ORDER BY day DESC
        LIMIT $3;
        `,
        [godName, mmrOption, limit]
      );
      const dailyStats = rows.map((row) => ({
        ...row,
        label: row.day.toLocaleDateString(),
        win_rate: row.first_place / row.picks,
        top_four_rate: row.top_four_sum / row.picks,
      }));
      return dailyStats;
    } catch (error) {
      throw error;
    }
  },

  async getGodWeeklyStats(godName, mmrOption, limit = 10) {
    try {
      const { rows } = await query(
        `
        SELECT date_trunc('week', day)::date as start_of_week,
          sum(picks)         AS picks,
          sum(first_place)   AS first_place,
          sum(place_sum)     AS place_sum,
          sum(first_place)
            + sum(second_place)
            + sum(third_place)
            + sum(fourth_place) AS top_four_sum

        FROM stats_gods_rollup join rollup_types using (type_id)
        WHERE god_name = $1
          AND type_id = $2
        GROUP BY start_of_week
        ORDER BY start_of_week DESC
        LIMIT $3;
        `,
        [godName, mmrOption, limit]
      );

      const weeklyStats = rows.map((row) => ({
        ...row,
        label: `Week of ${row.start_of_week.toLocaleDateString()}`,
        win_rate: row.first_place / row.picks,
        top_four_rate: row.top_four_sum / row.picks,
      }));
      return weeklyStats;
    } catch (error) {
      throw error;
    }
  },

  async getGodMonthlyStats(godName, mmrOption, limit = 6) {
    try {
      const { rows } = await query(
        `
        SELECT date_trunc('month', day)::date as start_of_month,
          sum(picks)         AS picks,
          sum(first_place)   AS first_place,
          sum(place_sum)     AS place_sum,
          sum(first_place)
            + sum(second_place)
            + sum(third_place)
            + sum(fourth_place) AS top_four_sum

        FROM stats_gods_rollup join rollup_types using (type_id)
        WHERE god_name = $1
          AND type_id = $2
        GROUP BY start_of_month
        ORDER BY start_of_month DESC
        LIMIT $3;
        `,
        [godName, mmrOption, limit]
      );
      const monthlyStats = rows.map((row) => ({
        ...row,
        label: new Date(row.start_of_month).toLocaleString("en-us", {
          month: "short",
          year: "numeric",
        }),
        win_rate: row.first_place / row.picks,
        top_four_rate: row.top_four_sum / row.picks,
      }));
      return monthlyStats;
    } catch (error) {
      throw error;
    }
  },

  async getGodPerPatchStats(godName, mmrOption) {
    try {
      const reversePatches = [...MAJOR_PATCHES].reverse();
      const allPatchPromises = reversePatches.map(patch =>
        query(
          `
        SELECT $1            AS patch,
          sum(picks)         AS picks,
          sum(first_place)   AS first_place,
          sum(place_sum)     AS place_sum,
          sum(first_place)
            + sum(second_place)
            + sum(third_place)
            + sum(fourth_place) AS top_four_sum

        FROM stats_gods_rollup join rollup_types using (type_id)
        WHERE god_name = $2
          AND type_id = $3
          AND day between $4 and $5
        `,
          [patch.text, godName, mmrOption, patch.startDate, patch.endDate]
        )
      );

      const perPatchStats = (await Promise.all(allPatchPromises)).map(
        ({ rows }) => ({
          ...rows[0],
          label: rows[0].patch,
          win_rate: rows[0].first_place / rows[0].picks,
          top_four_rate: rows[0].top_four_sum / rows[0].picks,
        })
      );
      return perPatchStats;
    } catch (error) {
      throw error;
    }
  },

  async getAllGods() {
    try {
      const { rows } = await query(`SELECT * FROM gods ORDER BY god_name`);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async delete(name) {
    try {
      const { rows } = await query(`DELETE FROM gods WHERE god_name = $1`, [
        name,
      ]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async setEnabled(name, enabled) {
    try {
      const { rows } = await query(
        `UPDATE gods SET god_enabled = $2 WHERE god_name = $1 returning *`,
        [name, enabled]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async setIsFree(name, isFree) {
    try {
      const { rows } = await query(
        `UPDATE gods SET free = $1 WHERE god_name = $2 returning *`,
        [isFree, name]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async setPlusExclusive(name, isPlus) {
    try {
      const { rows } = await query(
        `UPDATE gods SET plus_exclusive = $1 WHERE god_name = $2 returning *`,
        [isPlus, name]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },
};
