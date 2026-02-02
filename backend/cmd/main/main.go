package main

import (
	"backend/cmd/seed"
	"backend/internal/handlers"
	"backend/internal/middleware"
	"backend/internal/repository"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()

	if _, err := repository.Init(); err != nil {
		log.Fatal("DB connection failed: ", err)
	}
	seed.RunSeeder()

	r := gin.New()
	r.Use(middleware.Logger())
	r.Use(middleware.CORS())
	r.Use(middleware.RateLimit(5, 10))

	r.GET("/health", handlers.HealthCheck)

	r.GET("/api/list", handlers.ListGames)
	r.GET("/list", handlers.ListGames)
	r.GET("/list/*path", handlers.ListGames)

	r.GET("/api/game/:id", handlers.GetGame)
	r.GET("/game/:id", handlers.GetGame)

	r.GET("/api/autocomplete", handlers.Autocomplete)
	r.GET("/autocomplete", handlers.Autocomplete)

	// Auth routes
	r.POST("/api/login", handlers.Login)
	r.POST("/api/register", handlers.Register)

	// Example of using real JWTAuth middleware for a specific route
	r.GET("/secure-ping", middleware.JWTAuth(), func(c *gin.Context) {
		userId := c.MustGet("user_id")
		username := c.MustGet("username")
		c.JSON(200, gin.H{
			"message":  "pong",
			"user_id":  userId,
			"username": username,
		})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Starting server on port %s", port)
	r.Run(":" + port)
}
