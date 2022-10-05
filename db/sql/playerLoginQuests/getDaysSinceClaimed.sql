SELECT
(NOW()::date - last_login_quest_claimed::date) as days_since_last_claim
FROM players
WHERE steam_id = $1