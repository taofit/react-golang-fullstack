package main

import (
	"backend/internal/db"
	"backend/internal/handlers"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL is not set")
	}
	if err := db.Init(dbURL); err != nil {
		log.Fatal("DB connection failed: ", err)
	}

	r := gin.Default()
	r.Use(func(c *gin.Context) {
		c.Header("Content-Type", "application/json")
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token")
		c.Header("Access-Control-Allow-Credentials", "true")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	r.GET("/api/list", handlers.ListGames)
	r.GET("/list", handlers.ListGames)
	r.GET("/list/*path", handlers.ListGames)

	r.GET("/api/game/:id", handlers.GetGame)
	r.GET("/game/:id", handlers.GetGame)

	r.GET("/api/autocomplete", handlers.Autocomplete)
	r.GET("/autocomplete", handlers.Autocomplete)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Starting server on port %s", port)
	r.Run(":" + port)
}
