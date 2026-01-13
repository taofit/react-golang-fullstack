package models

type Game struct {
	ID       int     `json:"id" db:"id"`
	Name     string  `json:"name" db:"name"`
	Summary  string  `json:"summary" db:"summary"`
	CoverUrl string  `json:"coverUrl" db:"cover_url"`
	PriceUsd float64 `json:"priceUsd" db:"price_usd"`
}
