package repository

import (
	"log"

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
