package repository

import "backend/internal/models"

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
		SELECT id, name, summary, cover_url, price_usd
		FROM games 
		WHERE similarity(name, $1) > 0.1 
		ORDER BY similarity(name, $1) DESC
		LIMIT $2 OFFSET $3`
		countQuery = `SELECT COUNT(*) FROM games WHERE similarity(name, $1) > 0.1`
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

func GetGame(id int) (models.Game, error) {
	var game models.Game
	err := DB.Get(&game, "SELECT id, name, summary, cover_url, price_usd FROM games WHERE id = $1", id)
	if err != nil {
		return game, err
	}
	return game, nil
}

func GetGameSuggestions(query string) ([]string, error) {
	suggestions := []string{}
	err := DB.Select(&suggestions, `
		SELECT name
		FROM games
		LEFT JOIN game_synonyms ON games.id = game_synonyms.game_id
		WHERE (similarity(name, $1) > 0.1) 
		OR (similarity(synonym, $1) > 0.1)
		GROUP BY name
		ORDER BY MAX(GREATEST(
			similarity(name, $1),
			similarity(synonym, $1)
		)) DESC
		LIMIT 10`, query)

	if err != nil {
		return nil, err
	}
	return suggestions, nil
}
