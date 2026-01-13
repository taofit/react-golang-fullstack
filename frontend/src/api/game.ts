import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Game {
  id: number;
  name: string;
  summary?: string;
  coverUrl?: string;
  priceUsd: number;
}

export interface PaginationResponse {
  games: Game[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export const fetchGames = async (
  page: number = 1,
  limit: number = 20,
  search?: string
): Promise<PaginationResponse> => {
  const endpoint = '/api/list';
  const params: Record<string, any> = { page, limit };
  
  if (search) {
    params.search = search;
  }

  const response = await api.get<PaginationResponse>(endpoint, { params });
  return response.data;
};

export const fetchGameById = async (id: number): Promise<Game | undefined> => {
  const response = await api.get<Game>(`/api/game/${id}`);
  return response.data;
};

export const fetchAutocompleteSuggestions = async (query: string): Promise<string[]> => {
  if (!query.trim()) return [];
  
  const response = await api.get<string[]>('/api/autocomplete', {
    params: { q: query },
  });
  return response.data;
};

export default api;