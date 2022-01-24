DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS game_players CASCADE;

DROP TABLE IF EXISTS "session" CASCADE;
CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
DROP INDEX IF EXISTS IDX_session_expire;
CREATE INDEX "IDX_session_expire" ON "session" ("expire");

CREATE TABLE IF NOT EXISTS players (
  steam_id TEXT PRIMARY KEY,
  username TEXT,
  mmr INTEGER DEFAULT 1000,
  user_type TEXT DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT Now()
);
CREATE INDEX ix_players_mmr ON players (mmr);

CREATE TABLE IF NOT EXISTS games (
  game_id SERIAL PRIMARY KEY,
  rounds INTEGER,
  ranked BOOLEAN,
  duration INTEGER,
  cheats_enabled BOOLEAN,

  created_at TIMESTAMPTZ DEFAULT Now()
);
DROP INDEX IF EXISTS idx_games_created_at;
CREATE INDEX idx_games_created_at ON games (created_at);

CREATE TABLE IF NOT EXISTS game_players (
  game_id INTEGER REFERENCES games (game_id) ON UPDATE CASCADE,
  steam_id TEXT REFERENCES players (steam_id) ON UPDATE CASCADE,
  CONSTRAINT game_players_pkey PRIMARY KEY (game_id, steam_id),

  rounds INTEGER,
  end_time INTEGER,
  place INTEGER,
  mmr_change INTEGER DEFAULT 0
);