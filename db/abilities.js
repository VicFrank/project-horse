const { query } = require("./index");
const games = require("./games");
const players = require("./players");

const getAbilityFreqs = async (hours, steamID) => {
  try {
    const args = [hours];
    if (steamID) args.push(steamID);
    const { rows } = await query(
      `
        SELECT ability_name, COUNT(*) AS freq
        FROM hero_abilities
        JOIN game_player_heroes USING (game_player_hero_id)
        JOIN game_players USING (game_player_id)
        JOIN games USING (game_id)
        WHERE games.created_at > NOW() - $1 * INTERVAL '1 HOUR'
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

const getWinnerAbilityFreqs = async (hours, steamID) => {
  try {
    const args = [hours];
    if (steamID) args.push(steamID);
    const { rows } = await query(
      `
        SELECT ability_name, COUNT(*) AS freq
        FROM hero_abilities
        JOIN game_player_heroes USING (game_player_hero_id)
        JOIN game_players USING (game_player_id)
        JOIN games USING (game_id)
        WHERE games.created_at > NOW() - $1 * INTERVAL '1 HOUR'
          AND game_players.place = 1
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
        SELECT ability_name, COUNT(*) AS freq
        FROM hero_abilities
        JOIN game_player_heroes USING (game_player_hero_id)
        JOIN game_players USING (game_player_id)
        JOIN games USING (game_id)
        WHERE games.created_at > NOW() - $1 * INTERVAL '1 HOUR'
          AND game_players.place <= 4
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

// Get a list of what level the ability was at the end of the game, for the winner
const getWinnerLevelRates = async (hours) => {
  try {
    const { rows } = await query(
      `
      SELECT ability_name,
      count(case when ability_level = 1 then 1 end) as level_1,
      count(case when ability_level = 2 then 1 end) as level_2,
      count(case when ability_level = 3 then 1 end) as level_3,
      count(case when ability_level = 4 then 1 end) as level_4,
      count(case when ability_level = 5 then 1 end) as level_5,
      count(case when ability_level = 5 then 1 end) as level_6,
      count(case when ability_level = 5 then 1 end) as level_7,
      count(case when ability_level = 5 then 1 end) as level_8
      FROM hero_abilities
      JOIN game_player_heroes USING (game_player_hero_id)
      JOIN game_players USING (game_player_id)
      JOIN games USING (game_id)
      WHERE games.created_at > NOW() - $1 * INTERVAL '1 HOUR'
        AND game_players.place = 1
      GROUP BY ability_name
      ORDER BY ability_name
      `,
      [hours]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  async getAbilities() {
    try {
      const { rows } = await query(
        `SELECT * FROM abilities ORDER BY ability_name ASC`
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async getAbilityStats(hours = 720) {
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
      const abilityFreqs = await getAbilityFreqs(hours);
      const winnerAbilityFreqs = await getWinnerAbilityFreqs(hours);
      const topFourAbilityFreqs = await getTopFourAbilityFreqs(hours);
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
};
