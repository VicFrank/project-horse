SELECT * FROM player_login_quests
JOIN login_quests
USING (login_quest_id)
WHERE steam_id = $1 AND login_quest_id = $2