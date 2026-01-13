package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math/rand"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

type IGDBGame struct {
	ID      int    `json:"id"`
	Name    string `json:"name"`
	Summary string `json:"summary"`
	Cover   struct {
		URL     string `json:"url"`
		ImageID string `json:"image_id"`
	} `json:"cover"`
	PriceUsd float64 `json:"price_usd"`
}

type AccessToken struct {
	AccessToken string `json:"access_token"`
}

func main() {
	godotenv.Load()
	rand.Seed(time.Now().UnixNano())
	clientID := os.Getenv("IGDB_CLIENT_ID")
	clientSecret := os.Getenv("IGDB_CLIENT_SECRET")
	dbURL := os.Getenv("DATABASE_URL")

	if clientID == "" || clientSecret == "" || dbURL == "" {
		log.Fatal("Missing env variables:IGDB_CLIENT_ID, IGDB_CLIENT_SECRET, and DATABASE_URL")
	}
	db, err := sqlx.Open("postgres", dbURL)
	if err != nil {
		log.Fatal("DB connection failed: ", err)
	}
	defer db.Close()

	accessToken, err := getIGDBAccessToken(clientID, clientSecret)
	if err != nil {
		log.Fatal("Failed to get access token: ", err)
	}

	err = initSchema(db)
	if err != nil {
		log.Fatal("Failed to initialize schema: ", err)
	}

	if os.Getenv("TRUNCATE_DB") == "true" {
		log.Println("TRUNCATE_DB=true detected. Wiping games table...")
		_, err = db.Exec("TRUNCATE games CASCADE;")
		if err != nil {
			log.Printf("Warning: Failed to truncate games: %v", err)
		}
	}

	err = fetchAndInsertGames(db, accessToken.AccessToken, clientID)
	if err != nil {
		log.Fatal("Failed to fetch and insert games: ", err)
	}
	log.Println("Successfully fetched and inserted games")
}

func getIGDBAccessToken(clientID string, clientSecret string) (AccessToken, error) {
	tokenURL := "https://id.twitch.tv/oauth2/token"
	data := url.Values{}
	data.Set("client_id", clientID)
	data.Set("client_secret", clientSecret)
	data.Set("grant_type", "client_credentials")

	resp, err := http.Post(tokenURL, "application/x-www-form-urlencoded", strings.NewReader(data.Encode()))
	if err != nil {
		return AccessToken{}, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return AccessToken{}, err
	}
	var token AccessToken
	json.Unmarshal(body, &token)

	return token, nil
}

func fetchAndInsertGames(db *sqlx.DB, accessToken string, clientID string) error {
	apiURL := "https://api.igdb.com/v4/games"

	// IGDB v4 expects a text-based query body
	query := "fields name, summary, cover.url, cover.image_id; sort total_rating_count desc; limit 100;"

	req, err := http.NewRequest("POST", apiURL, strings.NewReader(query))
	if err != nil {
		return err
	}

	req.Header.Set("Client-ID", clientID)
	req.Header.Set("Authorization", "Bearer "+accessToken)
	req.Header.Set("Content-Type", "text/plain")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("IGDB API error (status %d): %s", resp.StatusCode, string(body))
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	var games []IGDBGame
	if err := json.Unmarshal(body, &games); err != nil {
		return fmt.Errorf("failed to unmarshal games: %v", err)
	}

	// Load synonyms from JSON
	synonymsFile, err := os.Open("data/synonyms.json")
	if err != nil {
		log.Printf("Warning: could not open synonyms.json: %v", err)
	} else {
		defer synonymsFile.Close()
		var synonymsMap map[string][]string
		json.NewDecoder(synonymsFile).Decode(&synonymsMap)

		for _, game := range games {
			game.PriceUsd = 9.99 + rand.Float64()*(59.99-9.99)

			if strings.HasPrefix(game.Cover.URL, "//") {
				game.Cover.URL = "https:" + game.Cover.URL
				if game.Cover.ImageID != "" {
					game.Cover.URL = "https://images.igdb.com/igdb/image/upload/t_cover_big/" + game.Cover.ImageID + ".jpg"
				}
			}

			var gameID int
			err := db.QueryRow(`
				INSERT INTO games (igdb_id, name, summary, cover_url, price_usd) 
				VALUES ($1, $2, $3, $4, $5)
				ON CONFLICT (igdb_id) DO UPDATE SET
					name = EXCLUDED.name,
					summary = EXCLUDED.summary,
					cover_url = EXCLUDED.cover_url,
					price_usd = EXCLUDED.price_usd
				RETURNING id`,
				game.ID, game.Name, game.Summary, game.Cover.URL, game.PriceUsd).Scan(&gameID)

			if err != nil {
				log.Printf("Failed to insert game %s: %v", game.Name, err)
				continue
			}

			// Insert synonyms if any
			if syns, ok := synonymsMap[game.Name]; ok {
				for _, syn := range syns {
					_, err := db.Exec("INSERT INTO game_synonyms (game_id, synonym) VALUES ($1, $2) ON CONFLICT(game_id, synonym) DO NOTHING", gameID, syn)
					if err != nil {
						log.Printf("Failed to insert synonym %s for game %s: %v", syn, game.Name, err)
					}
				}
			}
		}
	}

	return nil
}

func initSchema(db *sqlx.DB) error {
	schema, err := os.ReadFile("init-db.sql")
	if err != nil {
		return fmt.Errorf("failed to read init-db.sql: %v", err)
	}

	_, err = db.Exec(string(schema))
	if err != nil {
		return fmt.Errorf("failed to execute schema: %v", err)
	}
	log.Println("Database schema initialized successfully")
	return nil
}
