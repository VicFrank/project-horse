const { query } = require("./index");
const games = require("./games");
const players = require("./players");

const getAbilityFreqs = async (hours, steamID) => {
  try {
    const args = [hours];
    if (steamID) args.push(steamID);
    const { rows } = await query(
      `
      WITH g AS (
        SELECT * FROM games
        WHERE games.created_at > NOW() - $1 * INTERVAL '1 HOUR' AND RANKED = TRUE        
      )
      SELECT ability_name, COUNT(*) AS freq
        FROM hero_abilities
        JOIN game_player_heroes USING (game_player_hero_id)
        JOIN game_players USING (game_player_id)
        JOIN g USING (game_id)
        ${steamID ? `WHERE game_players.steam_id = $2` : ""}
        GROUP BY ability_name
        ORDER BY freq DESC;
      `,
      args
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

const getWinnerAbilityFreqs = async (hours, steamID) => {
  try {
    const args = [hours];
    if (steamID) args.push(steamID);
    const { rows } = await query(
      `
      WITH g AS (
        SELECT * FROM games
        WHERE games.created_at > NOW() - $1 * INTERVAL '1 HOUR' AND RANKED = TRUE
      )
        SELECT ability_name, COUNT(*) AS freq
        FROM hero_abilities
        JOIN game_player_heroes USING (game_player_hero_id)
        JOIN game_players USING (game_player_id)
        JOIN g USING (game_id)
        WHERE game_players.place = 1
          ${steamID ? `AND game_players.steam_id = $2` : ""}
        GROUP BY ability_name
        ORDER BY freq DESC
      `,
      args
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

const getTopFourAbilityFreqs = async (hours, steamID) => {
  try {
    const args = [hours];
    if (steamID) args.push(steamID);
    const { rows } = await query(
      `
      WITH g AS (
        SELECT * FROM games
        WHERE games.created_at > NOW() - $1 * INTERVAL '1 HOUR' AND RANKED = TRUE
      )
        SELECT ability_name, COUNT(*) AS freq
        FROM hero_abilities
        JOIN game_player_heroes USING (game_player_hero_id)
        JOIN game_players USING (game_player_id)
        JOIN g USING (game_id)
        WHERE game_players.place <= 4
          ${steamID ? `AND game_players.steam_id = $2` : ""}
        GROUP BY ability_name
        ORDER BY freq DESC
      `,
      args
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

const getAbilities = async () => {
  try {
    const { rows } = await query(
      `SELECT * FROM abilities ORDER BY ability_name ASC`
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

const addAbilityIcons = async (list) => {
  try {
    const abilities = await getAbilities();
    for (const item of list) {
      const ability = abilities.find(
        (a) => a.ability_name === item.ability_name
      );
      item.icon = ability.icon;
    }
    return list;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  async getAbilities() {
    return getAbilities();
  },
  async getAbilityStats(hours = 24) {
    try {
      const abilityFreqs = await getAbilityFreqs(hours);
      const winnerAbilityFreqs = await getWinnerAbilityFreqs(hours);
      const topFourAbilityFreqs = await getTopFourAbilityFreqs(hours);
      const abilities = await this.getAbilities();
      const numGames = await games.getNumGames(hours);

      // combine the three arrays
      const combined = abilityFreqs.map((ability) => {
        const icon = abilities.find(
          (a) => a.ability_name === ability.ability_name
        ).icon;

        return {
          ability_name: ability.ability_name,
          icon,
          numGames,
          freq: Number(ability.freq),
          winner_freq: Number(
            winnerAbilityFreqs.find(
              (winnerAbility) =>
                winnerAbility.ability_name === ability.ability_name
            )?.freq ?? 0
          ),
          top_four_freq: Number(
            topFourAbilityFreqs.find(
              (topFourAbility) =>
                topFourAbility.ability_name === ability.ability_name
            )?.freq ?? 0
          ),
        };
      });

      return combined;
    } catch (error) {
      throw error;
    }
  },
  async getPlayerAbilityStats(steamID, hours = 720) {
    try {
      const abilityFreqs = await getAbilityFreqs(hours, steamID);
      const winnerAbilityFreqs = await getWinnerAbilityFreqs(hours, steamID);
      const topFourAbilityFreqs = await getTopFourAbilityFreqs(hours, steamID);
      const abilities = await this.getAbilities();
      const numGames = await players.getNumGames(steamID, hours);

      // combine the three arrays
      const combined = abilityFreqs.map((ability) => {
        const icon = abilities.find(
          (a) => a.ability_name === ability.ability_name
        ).icon;
        return {
          ability_name: ability.ability_name,
          icon,
          numGames,
          freq: Number(ability.freq),
          winner_freq: Number(
            winnerAbilityFreqs.find(
              (winnerAbility) =>
                winnerAbility.ability_name === ability.ability_name
            )?.freq ?? 0
          ),
          top_four_freq: Number(
            topFourAbilityFreqs.find(
              (topFourAbility) =>
                topFourAbility.ability_name === ability.ability_name
            )?.freq ?? 0
          ),
        };
      });

      return combined;
    } catch (error) {
      throw error;
    }
  },
  // Get a list of what level the ability was at the end of the game, for the winner
  async getWinnerLevelRates(hours) {
    try {
      const { rows } = await query(
        `
      WITH g AS (
        SELECT * FROM games
        WHERE games.created_at > NOW() - $1 * INTERVAL '1 HOUR' AND RANKED = TRUE
      )
      SELECT ability_name,
      count(*) AS ability_freq,
      count(case when ability_level = 1 then 1 end) as level_1,
      count(case when ability_level = 2 then 1 end) as level_2,
      count(case when ability_level = 3 then 1 end) as level_3,
      count(case when ability_level = 4 then 1 end) as level_4,
      count(case when ability_level = 5 then 1 end) as level_5,
      count(case when ability_level = 6 then 1 end) as level_6,
      count(case when ability_level = 7 then 1 end) as level_7,
      count(case when ability_level = 8 then 1 end) as level_8
      FROM hero_abilities
      JOIN game_player_heroes USING (game_player_hero_id)
      JOIN game_players USING (game_player_id)
      JOIN g USING (game_id)
      WHERE game_players.place = 1
      GROUP BY ability_name
      ORDER BY ability_name;
      `,
        [hours]
      );

      const withIcons = await addAbilityIcons(rows);
      const withPlacementArray = withIcons.map((item) => {
        const placementArray = [];
        for (let i = 1; i <= 8; i++) {
          placementArray.push(item[`level_${i}`] / item.ability_freq);
        }
        return {
          ability_name: item.ability_name,
          icon: item.icon,
          placements: placementArray,
        };
      });

      return withPlacementArray;
    } catch (error) {
      throw error;
    }
  },
  async getSuperWinStats() {
    try {
      const { rows } = await query(
        `
        WITH g AS (
          SELECT * FROM games
          WHERE games.created_at > NOW() - 24 * INTERVAL '1 HOUR' AND RANKED = TRUE
        )
        SELECT ability_name, count(*) :: int
        FROM g
        JOIN game_players USING (game_id)
        JOIN game_player_heroes USING (game_player_id)
        JOIN hero_abilities USING (game_player_hero_id)
        WHERE place = 1 and ability_level >= 6
        GROUP BY ability_name
        ORDER BY count(*) desc;
      `
      );

      return await addAbilityIcons(rows);
    } catch (error) {
      throw error;
    }
  },
  async getGabenWinStats() {
    try {
      const { rows } = await query(
        `
        WITH g AS (
          SELECT * FROM games
          WHERE games.created_at > NOW() - 24 * INTERVAL '1 HOUR' AND RANKED = TRUE
        )
        SELECT ability_name, count(*) :: int
        FROM g
        JOIN game_players USING (game_id)
        JOIN game_player_heroes USING (game_player_id)
        JOIN hero_abilities USING (game_player_hero_id)
        WHERE place = 1 and ability_level >= 9
        GROUP BY ability_name
        ORDER BY count(*) desc;
      `
      );

      return await addAbilityIcons(rows);
    } catch (error) {
      throw error;
    }
  },
  async getMostGabens() {
    try {
      const { rows } = await query(
        `
        SELECT game_id, steam_id, count(distinct ability_name)
        FROM hero_abilities
        JOIN game_player_heroes USING (game_player_hero_id)
        JOIN game_players USING (game_player_id)
        JOIN games USING (game_id)
        WHERE ability_level = 9 AND ranked = TRUE
        AND games.created_at > NOW() - INTERVAL '1 MONTH'
        GROUP BY game_id, steam_id
        ORDER BY count(ability_name) DESC
        LIMIT 100;
      `
      );

      return rows;
    } catch (error) {
      throw error;
    }
  },
};
