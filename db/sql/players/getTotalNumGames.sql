SELECT COUNT(*) FROM
games JOIN game_players USING (game_id)
WHERE ranked = TRUE AND game_players.steam_id = $1