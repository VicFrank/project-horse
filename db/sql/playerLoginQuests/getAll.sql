SELECT * FROM player_login_quests
JOIN login_quests
USING (login_quest_id)
LEFT JOIN cosmetics
USING (cosmetic_id)
WHERE steam_id = $1
ORDER BY day