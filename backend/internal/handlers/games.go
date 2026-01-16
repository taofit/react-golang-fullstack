package handlers

import (
	"backend/internal/models"
	"backend/internal/repository"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func ListGames(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	search := c.DefaultQuery("search", "")

	games, total, err := repository.ListGames(page, limit, search)
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
	game, err := repository.GetGame(idInt)
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
	suggestions, err := repository.GetGameSuggestions(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, suggestions)
}
