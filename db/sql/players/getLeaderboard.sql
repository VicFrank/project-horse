SELECT * from players
ORDER BY LEAST (ladder_mmr, 4500) DESC, mmr DESC
LIMIT 100