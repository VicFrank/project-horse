SELECT sum(xp) as daily_xp
FROM games
JOIN game_players gp
USING (game_id)
JOIN players
USING (steam_id)
WHERE steam_id = $1
AND created_at >= NOW()::date