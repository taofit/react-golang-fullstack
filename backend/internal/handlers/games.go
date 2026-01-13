package handlers

import (
	"backend/internal/db"
	"backend/internal/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func ListGames(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	search := c.DefaultQuery("search", "")

	games, total, err := db.ListGames(page, limit, search)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, models.GameListResponse{
		Games: games,
		Pagination: models.Pagination{
			Total: total,
			Page:  page,
			Limit: limit,
		},
	})
}

func GetGame(c *gin.Context) {
	id := c.Param("id")
	idInt, _ := strconv.Atoi(id)
	game, err := db.GetGame(idInt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, game)
}

func Autocomplete(c *gin.Context) {
	query := c.Query("q")
	if len(query) < 2 { //no point querying the short query
		c.JSON(http.StatusOK, []string{"Stub 1", "Stub 2"})
		return
	}
	suggestions := []string{}
	err := db.DB.Select(&suggestions, `
		SELECT name
		FROM games
		LEFT JOIN game_synonyms ON games.id = game_synonyms.game_id
		WHERE (name % $1 AND similarity(name, $1) > 0.3) 
		OR (synonym % $1 AND similarity(synonym, $1) > 0.3)
		GROUP BY name
		ORDER BY MAX(GREATEST(
			CASE WHEN name % $1 THEN similarity(name, $1) ELSE 0 END,
			CASE WHEN synonym % $1 THEN similarity(synonym, $1) ELSE 0 END
		)) DESC
		LIMIT 10`, query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, suggestions)
}
