package db

import (
	"log"

	"backend/internal/models"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

var DB *sqlx.DB

func Init(dbURL string) error {
	var err error
	DB, err = sqlx.Open("postgres", dbURL)
	if err != nil {
		return err
	}
	if err = DB.Ping(); err != nil {
		return err
	}
	log.Println("Database connected")
	return nil
}

func ListGames(page, limit int, search string) ([]models.Game, int, error) {
	if limit < 1 || limit > 100 {
		limit = 20
	}
	if page < 1 {
		page = 1
	}
	offset := (page - 1) * limit

	var games []models.Game
	var query string
	var countQuery string
	var count int
	var queryArgs []interface{}
	var getArgs []interface{}

	if search != "" {
		query = `
		SELECT id, name, summary, cover_url, price_usd, similarity(name, $1) AS sim
		FROM games 
		WHERE name % $1 AND similarity(name, $1) > 0.4 
		ORDER BY sim DESC
		LIMIT $2 OFFSET $3`
		countQuery = `SELECT COUNT(*) FROM games WHERE name % $1 AND similarity(name, $1) > 0.4`
		queryArgs = []interface{}{search, limit, offset}
		getArgs = []interface{}{search}
	} else {
		query = `SELECT id, name, summary, cover_url, price_usd FROM games LIMIT $1 OFFSET $2`
		countQuery = `SELECT COUNT(*) FROM games`
		queryArgs = []interface{}{limit, offset}
		getArgs = []interface{}{}
	}

	err := DB.Select(&games, query, queryArgs...)
	if err != nil {
		return nil, 0, err
	}

	err = DB.Get(&count, countQuery, getArgs...)
	if err != nil {
		return nil, 0, err
	}

	return games, count, nil
}
