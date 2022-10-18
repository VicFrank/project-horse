const { query } = require("../db/index");
const { LOBBY_LOCK_TIME } = require("../common/constants");
const Players = require("../db/players");

module.exports = {
  async getLobby(steamID) {
    try {
      const { rows } = await query(
        `
        SELECT lobby_id, region, min_rank, max_rank, lobby_password,
          lock_time > (NOW() - INTERVAL '${LOBBY_LOCK_TIME} SECONDS') as locked,
          EXTRACT(EPOCH FROM NOW()) - EXTRACT(EPOCH FROM lock_time) as time_since_lock
        FROM lobbies JOIN lobby_players USING (lobby_id)
        WHERE steam_id = $1
      `,
        [steamID]
      );

      const lobby = rows[0];
      if (lobby && lobby.locked == null) {
        lobby.locked = false;
      }

      return lobby;
    } catch (error) {
      throw error;
    }
  },

  async getPlayer(steamID) {
    const { rows } = await query(
      `
      SELECT steam_id, username, mmr, ladder_mmr, lobby_id, ready, avatar, is_host
      FROM players JOIN lobby_players USING (steam_id)
      WHERE steam_id = $1
    `,
      [steamID]
    );
    return rows[0];
  },

  async joinLobby(steamID, lobbyID, avatar) {
    const rank = await Players.getLeaderboardPositionForPlayer(steamID);
    await query(
      `
      INSERT INTO lobby_players
      (steam_id, lobby_id, avatar, leaderboard_rank)
      VALUES ($1, $2, $3, $4)
    `,
      [steamID, lobbyID, avatar, rank]
    );
  },

  async leaveLobby(steamID) {
    await query(`DELETE FROM lobby_players WHERE steam_id = $1`, [steamID]);
  },

  async setIsHost(steamID, isHost) {
    await query(`UPDATE lobby_players SET is_host = $2 WHERE steam_id = $1`, [
      steamID,
      isHost,
    ]);
  },

  async inLobby(steamID) {
    const player = await this.getPlayer(steamID);
    if (!player) return false;
    if (!player.lobby_id) return false;
    return true;
  },

  async getPlayerMMR(steamID) {
    const { rows } = await query(
      `SELECT mmr, ladder_mmr
      FROM players
      WHERE steam_id = $1
    `,
      [steamID]
    );
    return rows[0].mmr;
  },

  async isInMMRRange(steamID, minRank, maxRank) {
    const mmr = await this.getPlayerMMR(steamID);
    if (!mmr) return false;
    if (mmr < minRank || mmr > maxRank) return false;
    return true;
  },
};
