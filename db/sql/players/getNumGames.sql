SELECT COUNT(*)
FROM games
JOIN game_players USING (game_id)
WHERE created_at > NOW() - $1 * INTERVAL '1 HOUR'
AND game_players.steam_id = $2