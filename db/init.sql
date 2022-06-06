DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS game_players CASCADE;
DROP TABLE IF EXISTS game_player_heroes CASCADE;
DROP TABLE IF EXISTS abilities CASCADE;
DROP TABLE IF EXISTS hero_abilities CASCADE;
DROP TABLE IF EXISTS combat_results CASCADE;
DROP TABLE IF EXISTS combat_players CASCADE;

DROP TABLE IF EXISTS cosmetics CASCADE;
DROP TABLE IF EXISTS player_cosmetics CASCADE;
DROP TABLE IF EXISTS battle_pass CASCADE;
DROP TABLE IF EXISTS player_battle_pass CASCADE;
DROP TABLE IF EXISTS quests CASCADE;
DROP TABLE IF EXISTS player_quests CASCADE;

-- DROP TABLE IF EXISTS "session" CASCADE;
-- CREATE TABLE IF NOT EXISTS "session" (
--   "sid" varchar NOT NULL COLLATE "default",
--   "sess" json NOT NULL,
--   "expire" timestamp(6) NOT NULL
-- )
-- WITH (OIDS=FALSE);

-- ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
-- DROP INDEX IF EXISTS IDX_session_expire;
-- CREATE INDEX "IDX_session_expire" ON "session" ("expire");

CREATE TABLE IF NOT EXISTS players (
  steam_id TEXT PRIMARY KEY,
  username TEXT,
  profile_picture TEXT,
  mmr INTEGER DEFAULT 1000,
  ladder_mmr INTEGER DEFAULT 0,
  coins INTEGER DEFAULT 0 CHECK (coins >= 0),
  user_type TEXT DEFAULT 'USER',
  patreon_level INTEGER DEFAULT 0,

  plus_expiration TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT Now()
);
CREATE INDEX ix_players_mmr ON players (mmr);

--------------------------------------------------------------------------------
-- Games
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS games (
  game_id TEXT PRIMARY KEY,
  rounds INTEGER,
  ranked BOOLEAN,
  duration DOUBLE PRECISION,
  cheats_enabled BOOLEAN,

  created_at TIMESTAMPTZ DEFAULT Now(),
  end_time TIMESTAMPTZ
);
DROP INDEX IF EXISTS idx_games_created_at;
CREATE INDEX idx_games_created_at ON games (created_at);

CREATE TABLE IF NOT EXISTS game_players (
  game_player_id SERIAL PRIMARY KEY,
  game_id TEXT REFERENCES games (game_id) ON UPDATE CASCADE,
  steam_id TEXT REFERENCES players (steam_id) ON UPDATE CASCADE,

  rounds INTEGER,
  wins INTEGER,
  losses INTEGER,
  end_time DOUBLE PRECISION,
  place INTEGER,
  team INTEGER,
  god TEXT,
  total_level INTEGER,

  mmr INTEGER,
  mmr_change INTEGER DEFAULT 0,
  coins_change INTEGER DEFAULT 0,
  xp_change INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS game_player_heroes (
  game_player_hero_id SERIAL PRIMARY KEY,
  game_player_id INTEGER REFERENCES game_players (game_player_id) ON UPDATE CASCADE,

  hero_name TEXT NOT NULL,
  tier INTEGER NOT NULL,
  total_damage_dealt INTEGER,
  total_physical_damage INTEGER,
  total_magical_damage INTEGER,
  total_damage_taken INTEGER,
  total_healing INTEGER,
  total_healed INTEGER
);
DROP INDEX IF EXISTS idx_game_player_heroes_hero_name;
CREATE INDEX idx_game_player_heroes_hero_name ON game_player_heroes (hero_name);

CREATE TABLE IF NOT EXISTS abilities (
  ability_name TEXT PRIMARY KEY,
  icon TEXT,
  is_ultimate BOOLEAN
);

CREATE TABLE IF NOT EXISTS hero_abilities (
  hero_ability_id SERIAL PRIMARY KEY,
  game_player_hero_id INTEGER REFERENCES game_player_heroes (game_player_hero_id) ON UPDATE CASCADE,
  ability_name TEXT REFERENCES abilities (ability_name) ON UPDATE CASCADE,

  ability_level INTEGER,
  slot_index INTEGER
);
DROP INDEX IF EXISTS idx_hero_abilities_ability_name;
CREATE INDEX idx_hero_abilities_ability_name ON hero_abilities (ability_name);

CREATE TABLE IF NOT EXISTS combat_results (
  combat_results_id SERIAL PRIMARY KEY,
  game_id TEXT REFERENCES games (game_id) ON UPDATE CASCADE,

  duration DOUBLE PRECISION NOT NULL,
  round_number INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS combat_players (
  combat_results_id INTEGER REFERENCES combat_results (combat_results_id) ON UPDATE CASCADE,
  steam_id TEXT REFERENCES players (steam_id) ON UPDATE CASCADE,

  damage_taken INTEGER,
  ghost BOOLEAN
);

--------------------------------------------------------------------------------
-- Cosmetics
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cosmetics (
  cosmetic_id SERIAL PRIMARY KEY,
  cosmetic_name TEXT UNIQUE,
  cosmetic_type TEXT,
  equip_group TEXT,
  cost_coins INTEGER,
  cost_usd DOUBLE PRECISION,
  rarity TEXT
);

CREATE TABLE IF NOT EXISTS player_cosmetics (
  cosmetic_id INTEGER REFERENCES cosmetics (cosmetic_id) ON UPDATE CASCADE,
  steam_id TEXT REFERENCES players (steam_id) ON UPDATE CASCADE,
  created TIMESTAMPTZ DEFAULT NOW(),
  equipped BOOLEAN DEFAULT FALSE
);

DROP TABLE IF EXISTS battle_pass CASCADE;
CREATE TABLE IF NOT EXISTS battle_pass (
  battle_pass_id SERIAL PRIMARY KEY,
  is_active BOOLEAN DEFAULT FALSE,
  created TIMESTAMPTZ DEFAULT NOW()
);

DROP TABLE IF EXISTS battle_pass_levels CASCADE;
CREATE TABLE IF NOT EXISTS battle_pass_levels (
  battle_pass_id INTEGER REFERENCES battle_pass (battle_pass_id) ON UPDATE CASCADE,
  bp_level INTEGER NOT NULL,
  next_level_xp INTEGER NOT NULL,
  total_xp INTEGER NOT NULL,
  coins_reward INTEGER,

  CONSTRAINT battle_pass_levels_pkey PRIMARY KEY (battle_pass_id, bp_level)
);

DROP TABLE IF EXISTS battle_pass_cosmetic_rewards CASCADE;
CREATE TABLE IF NOT EXISTS battle_pass_cosmetic_rewards (
  battle_pass_id INTEGER REFERENCES battle_pass (battle_pass_id) ON UPDATE CASCADE,
  bp_level INTEGER NOT NULL,
  cosmetic_id INTEGER REFERENCES cosmetics (cosmetic_id) ON UPDATE CASCADE,
  amount INTEGER DEFAULT 1
);

DROP TABLE IF EXISTS player_battle_pass CASCADE;
CREATE TABLE IF NOT EXISTS player_battle_pass (
  steam_id TEXT REFERENCES players (steam_id) ON UPDATE CASCADE,
  battle_pass_id INTEGER REFERENCES battle_pass (battle_pass_id) ON UPDATE CASCADE,
  unlocked BOOLEAN DEFAULT FALSE,
  bp_level INTEGER DEFAULT 1,
  total_xp INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS quests (
  quest_id SERIAL PRIMARY KEY,
  quest_name TEXT NOT NULL,
  is_achievement BOOLEAN NOT NULL,
  is_hidden BOOLEAN DEFAULT FALSE,
  is_weekly BOOLEAN DEFAULT FALSE,
  quest_description TEXT,
  coin_reward INTEGER DEFAULT 0,
  xp_reward INTEGER DEFAULT 0,
  stat TEXT NOT NULL,
  auto_claim BOOLEAN DEFAULT FALSE,
  required_amount INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS player_quests (
  steam_id TEXT REFERENCES players (steam_id) ON UPDATE CASCADE,
  quest_id INTEGER REFERENCES quests (quest_id) ON UPDATE CASCADE,
  quest_progress INTEGER DEFAULT 0,
  created TIMESTAMPTZ DEFAULT NOW(),
  claimed BOOLEAN DEFAULT FALSE,
  quest_index INTEGER,

  CONSTRAINT player_quests_pkey PRIMARY KEY (steam_id, quest_id)
);

DROP TABLE IF EXISTS drop_type_rewards;
CREATE TABLE IF NOT EXISTS drop_type_rewards (
  drop_type TEXT NOT NULL,
  reward_cosmetic_id INTEGER REFERENCES cosmetics (cosmetic_id),
  cum_sum_odds DOUBLE PRECISION NOT NULL,

  CONSTRAINT drop_type_rewards_pkey PRIMARY KEY (drop_type, reward_cosmetic_id)
);

DROP TABLE IF EXISTS chest_drop_types;
CREATE TABLE IF NOT EXISTS chest_drop_types (
  chest_cosmetic_id INTEGER REFERENCES cosmetics (cosmetic_id),
  drop_type TEXT NOT NULL,
  cum_sum_odds DOUBLE PRECISION NOT NULL,

  CONSTRAINT chest_drop_types_pkey PRIMARY KEY (chest_cosmetic_id, drop_type, cum_sum_odds)
);


--------------------------------------------------------------------------------
-- Polls
--------------------------------------------------------------------------------

DROP TABLE IF EXISTS votes;
DROP TABLE IF EXISTS poll_options;
DROP TABLE IF EXISTS polls;
CREATE TABLE IF NOT EXISTS polls (
  poll_id SERIAL PRIMARY KEY,
  poll_name TEXT,
  poll_description TEXT
);

CREATE TABLE IF NOT EXISTS poll_options (
  option_id SERIAL UNIQUE NOT NULL,
  poll_id INTEGER REFERENCES polls (poll_id),
  option_text TEXT NOT NULL,
  votes INTEGER default 0,

  CONSTRAINT poll_options_pkey PRIMARY KEY (poll_id, option_id)
);

CREATE TABLE IF NOT EXISTS votes (
  poll_id INTEGER REFERENCES polls (poll_id),
  steam_id TEXT REFERENCES players (steam_id),
  vote INTEGER REFERENCES poll_options (option_id),

  CONSTRAINT vote_pkey PRIMARY KEY (poll_id, steam_id)
);

--------------------------------------------------------------------------------
-- Misc
--------------------------------------------------------------------------------

DROP TABLE IF EXISTS player_logs;
CREATE TABLE IF NOT EXISTS player_logs (
  steam_id TEXT REFERENCES players (steam_id) ON UPDATE CASCADE,
  log_event TEXT NOT NULL,
  log_data JSON,
  log_time TIMESTAMPTZ DEFAULT NOW()
);