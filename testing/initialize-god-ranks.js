const { query } = require("../db/index");
const { getMatchRatingChange } = require("../mmr/mmr");
const data = require("./games");

async function initializeGodRanks() {
  try {
    const { rows } = await query(`
      SELECT god, players.steam_id, place, games.game_id, game_players.mmr
        FROM games
        JOIN game_players USING (game_id)
        JOIN players USING (steam_id)
        WHERE ranked = TRUE and games.created_at > '2025-01-01'
        ORDER BY games.created_at ASC`);

    // rating for each player/god combo, initialized to 1000 mmr
    const godRatings = {};
    const games = rows.reduce((acc, row) => {
      if (!acc[row.game_id]) {
        acc[row.game_id] = [];
      }
      acc[row.game_id].push(row);
      return acc;
    }, {});

    for (const players of Object.values(games)) {
      for (const player of players) {
        const { god, steam_id, place } = player;
        const key = `${steam_id}_${god}`;
        if (!godRatings[key]) {
          godRatings[key] = 1000;
        }

        const winners = players.filter((p) => p.place < place);
        const losers = players.filter((p) => p.place > place);
        const ratingChange = getMatchRatingChange(
          godRatings[key],
          winners,
          losers
        );

        godRatings[key] += ratingChange;
      }
    }

    // update player_gods table with the new ratings
    for (const [key, rating] of Object.entries(godRatings)) {
      const [steam_id, god] = key.split("_");
      await query(
        `INSERT INTO player_gods (steam_id, god_name, mmr)
         VALUES ($1, $2, $3)
         ON CONFLICT (steam_id, god_name) DO UPDATE SET mmr = $3`,
        [steam_id, god, rating]
      );
    }

    // turn god ratings into an array and select the 100 highest results
    // const ratings = Object.entries(godRatings).map(([key, rating]) => {
    //   const [steam_id, god] = key.split("_");
    //   return { steam_id, god, rating };
    // });
    // const top100 = ratings
    //   .filter((r) => r.god === "lifestealer")
    //   .sort((a, b) => b.rating - a.rating)
    //   .slice(0, 1)
    //   .map((r, i) => ({ ...r, rank: i + 1 }));
    // console.log(top100);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

(async () => {
  await initializeGodRanks();
})();
