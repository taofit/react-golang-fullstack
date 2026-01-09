package models

type Pagination struct {
	Total int `json:"total"`
	Page  int `json:"page"`
	Limit int `json:"limit"`
}

type GameListResponse struct {
	Games      []Game     `json:"games"`
	Pagination Pagination `json:"pagination"`
}
