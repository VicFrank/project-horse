SELECT p.*, count(*) as games
FROM players as p
JOIN game_players as gp
USING (steam_id)
GROUP BY p.steam_id
ORDER BY games DESC
LIMIT $1 OFFSET $2