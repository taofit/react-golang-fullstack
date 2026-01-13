-- init-db.sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create tables here or run via migration in Go
CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    igdb_id BIGINT UNIQUE,
    name TEXT NOT NULL,
    summary TEXT,
    cover_url TEXT,
    price_usd DECIMAL(10,2)
);
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS favourites (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, game_id)
);

CREATE TABLE IF NOT EXISTS game_synonyms (
    game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
    synonym TEXT NOT NULL,
    UNIQUE (game_id, synonym)
);