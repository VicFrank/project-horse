SELECT COUNT(*) FROM
games JOIN game_players USING (game_id)
WHERE ranked = true AND steam_id = $1 AND god = $2 AND place <= 4