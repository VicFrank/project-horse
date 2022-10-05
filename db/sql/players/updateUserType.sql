UPDATE players
SET userType = $2
WHERE steam_id = $1
RETURNING *