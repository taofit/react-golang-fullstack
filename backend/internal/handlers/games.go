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
	c.JSON(http.StatusOK, gin.H{"id": id, "title": "Stub Game"})
}

func Autocomplete(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"suggestions": []string{"Stub 1", "Stub 2"}})
}
