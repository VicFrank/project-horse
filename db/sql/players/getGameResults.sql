SELECT 
  count(*) as games,
  count(*) FILTER (WHERE place = 1) AS first_place,
  count(*) FILTER (WHERE place = 2) AS second_place,
  count(*) FILTER (WHERE place = 3) AS third_place,
  count(*) FILTER (WHERE place = 4) AS fourth_place,
  count(*) FILTER (WHERE place = 5) AS fifth_place,
  count(*) FILTER (WHERE place = 6) AS sixth_place,
  count(*) FILTER (WHERE place = 7) AS seventh_place,
  count(*) FILTER (WHERE place = 8) AS eighth_place,
  TRUNC (SUM(place)::decimal / count(*)::decimal, 2) AS avg_place
FROM games JOIN game_players USING (game_id)
WHERE ranked = TRUE AND game_players.steam_id = $1