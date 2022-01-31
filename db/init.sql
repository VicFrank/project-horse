DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS game_players CASCADE;
DROP TABLE IF EXISTS game_player_heroes CASCADE;
DROP TABLE IF EXISTS hero_abilities CASCADE;
DROP TABLE IF EXISTS cosmetics CASCADE;
DROP TABLE IF EXISTS player_cosmetics CASCADE;
DROP TABLE IF EXISTS battle_pass CASCADE;
DROP TABLE IF EXISTS battle_pass_rewards CASCADE;
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
  mmr INTEGER DEFAULT 1000,
  coins INTEGER DEFAULT 0 CHECK (coins >= 0),
  user_type TEXT DEFAULT 'USER',
  patreon_level INTEGER DEFAULT 0,

  plus_expiration TIMESTAMPTZ,

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
  game_player_id SERIAL PRIMARY KEY,
  game_id INTEGER REFERENCES games (game_id) ON UPDATE CASCADE,
  steam_id TEXT REFERENCES players (steam_id) ON UPDATE CASCADE,

  rounds INTEGER,
  wins INTEGER,
  losses INTEGER,
  end_time INTEGER,
  place INTEGER,

  mmr_change INTEGER DEFAULT 0,
  coins INTEGER DEFAULT 0,
  xp INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS game_player_heroes (
  game_player_hero_id SERIAL PRIMARY KEY,
  game_player_id INTEGER REFERENCES game_players (game_player_id) ON UPDATE CASCADE,

  hero_name TEXT NOT NULL,
  hero_level INTEGER,
  total_damage_dealt INTEGER,
  total_physical_damage INTEGER,
  total_magical_damage INTEGER,
  total_damage_taken INTEGER,
  total_healing INTEGER,
  total_healed INTEGER
);
DROP INDEX IF EXISTS idx_game_player_heroes_hero_name;
CREATE INDEX idx_game_player_heroes_hero_name ON game_player_heroes (hero_name);

CREATE TABLE IF NOT EXISTS hero_abilities (
  hero_ability_id SERIAL PRIMARY KEY,
  game_player_hero_id INTEGER REFERENCES game_player_heroes (game_player_hero_id) ON UPDATE CASCADE,

  ability_name TEXT,
  ability_level INTEGER
);
DROP INDEX IF EXISTS idx_hero_abilities_ability_name;
CREATE INDEX idx_hero_abilities_ability_name ON hero_abilities (ability_name);

CREATE TABLE IF NOT EXISTS cosmetics (
  cosmetic_id SERIAL PRIMARY KEY,
  cosmetic_name TEXT UNIQUE,
  cosmetic_type TEXT,
  equip_group TEXT,
  cost_coins INTEGER,
  cost_usd INTEGER,
  rarity TEXT
);

CREATE TABLE IF NOT EXISTS player_cosmetics (
  cosmetic_id INTEGER REFERENCES cosmetics (cosmetic_id) ON UPDATE CASCADE,
  steam_id TEXT REFERENCES players (steam_id) ON UPDATE CASCADE,
  created TIMESTAMPTZ DEFAULT Now(),
  equipped BOOLEAN DEFAULT FALSE
);

DROP TABLE IF EXISTS battle_pass CASCADE;
CREATE TABLE IF NOT EXISTS battle_pass (
  battle_pass_id SERIAL PRIMARY KEY,
  bp_name TEXT,
  bp_start_date TIMESTAMPTZ,
  bp_end_date TIMESTAMPTZ
);

DROP TABLE IF EXISTS battle_pass_rewards CASCADE;
CREATE TABLE IF NOT EXISTS battle_pass_rewards (
  battle_pass_id INTEGER REFERENCES battle_pass (battle_pass_id) ON UPDATE CASCADE,
  level INTEGER NOT NULL,
  cosmetic_id INTEGER REFERENCES cosmetics (cosmetic_id) ON UPDATE CASCADE,
  coins INTEGER,
  misc TEXT
);

DROP TABLE IF EXISTS player_battle_pass CASCADE;
CREATE TABLE IF NOT EXISTS player_battle_pass (
  steam_id TEXT REFERENCES players (steam_id) ON UPDATE CASCADE,
  battlePass_id INTEGER REFERENCES battle_pass (battle_pass_id) ON UPDATE CASCADE,
  bp_level INTEGER DEFAULT 0,
  total_xp INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS quests (
  quest_id SERIAL PRIMARY KEY,
  quest_name TEXT NOT NULL,
  is_achievement BOOLEAN NOT NULL,
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

DROP TABLE IF EXISTS chest_item_rewards;
CREATE TABLE IF NOT EXISTS chest_item_rewards (
  cosmetic_id INTEGER REFERENCES cosmetics (cosmetic_id),
  reward_rarity TEXT NOT NULL,
  reward_odds INTEGER NOT NULL,

  CONSTRAINT chest_item_rewards_pkey PRIMARY KEY (cosmetic_id, reward_rarity)
);

DROP TABLE IF EXISTS chest_coin_rewards;
CREATE TABLE IF NOT EXISTS chest_coin_rewards (
  cosmetic_id INTEGER REFERENCES cosmetics (cosmetic_id),
  cum_sum INTEGER NOT NULL,
  coins INTEGER NOT NULL,

  CONSTRAINT chest_coin_rewards_pkey PRIMARY KEY (cosmetic_id, cum_sum)
);

DROP TABLE IF EXISTS chest_bonus_rewards;
CREATE TABLE IF NOT EXISTS chest_bonus_rewards (
  cosmetic_id INTEGER REFERENCES cosmetics (cosmetic_id),
  cum_sum INTEGER NOT NULL,
  reward_id INTEGER REFERENCES cosmetics (cosmetic_id),

  CONSTRAINT chest_bonus_rewards_pkey PRIMARY KEY (cosmetic_id, cum_sum)
);

DROP TABLE IF EXISTS player_logs;
CREATE TABLE IF NOT EXISTS player_logs (
  steam_id TEXT REFERENCES players (steam_id) ON UPDATE CASCADE,
  log_event TEXT NOT NULL,
  log_data JSON,
  log_time TIMESTAMPTZ DEFAULT NOW()
);

DROP TABLE IF EXISTS polls;
CREATE TABLE IF NOT EXISTS polls (
  poll_id SERIAL PRIMARY KEY,
  poll_name TEXT,
  poll_description TEXT
);

DROP TABLE IF EXISTS poll_options;
CREATE TABLE IF NOT EXISTS poll_options (
  option_id SERIAL UNIQUE NOT NULL,
  poll_id INTEGER REFERENCES polls (poll_id),
  option_text TEXT NOT NULL,
  votes INTEGER default 0,

  CONSTRAINT poll_options_pkey PRIMARY KEY (poll_id, option_id)
);

DROP TABLE IF EXISTS votes;
CREATE TABLE IF NOT EXISTS votes (
  poll_id INTEGER REFERENCES polls (poll_id),
  steam_id TEXT REFERENCES players (steam_id),
  vote INTEGER REFERENCES poll_options (option_id),

  CONSTRAINT vote_pkey PRIMARY KEY (poll_id, steam_id)
);