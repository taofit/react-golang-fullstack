package repository

import (
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

var DB *sqlx.DB

type DBSecret struct {
	Host     string `json:"host"`
	Port     int    `json:"port"`
	Username string `json:"username"`
	Password string `json:"password"`
	DBName   string `json:"dbname"`
}

func Init() (*sqlx.DB, error) {
	var dbURL string
	secretJSON := os.Getenv("DB_SECRET")

	if secretJSON != "" {
		var dbSecret DBSecret
		if err := json.Unmarshal([]byte(secretJSON), &dbSecret); err != nil {
			log.Fatal("Failed to parse DB_SECRET: ", err)
		}
		dbURL = fmt.Sprintf("postgres://%s:%s@%s:%d/%s",
			dbSecret.Username, dbSecret.Password, dbSecret.Host, dbSecret.Port, dbSecret.DBName)
		dbURL += "?sslmode=verify-full&sslrootcert=/app/rds-ca.pem"
		log.Println("Deteced AWS environment: SSL verrification enabled")
	} else {
		dbURL = os.Getenv("DATABASE_URL")
	}

	if dbURL == "" {
		log.Fatal("No database connection string is found")
	}

	return connect(dbURL)
}

func connect(dbURL string) (*sqlx.DB, error) {
	var err error
	DB, err = sqlx.Open("postgres", dbURL)
	if err != nil {
		return nil, err
	}
	if err = DB.Ping(); err != nil {
		return nil, err
	}
	log.Println("Database connected")

	return DB, nil
}
