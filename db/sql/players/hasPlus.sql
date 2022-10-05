SELECT plus_expiration IS NOT NULL AND plus_expiration > NOW() as has_plus
FROM players WHERE steam_id = $1