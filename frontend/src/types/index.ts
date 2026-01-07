export interface Game {
  id: number
  name: string
  summary?: string
  coverUrl?: string
  priceUsd: number
}

export interface PaginationResponse {
  games: Game[]
  total: number
  page: number
  limit: number
}