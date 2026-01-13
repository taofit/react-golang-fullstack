import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const mockGames: Game[] = [
  {
    id: 1,
    name: 'Split Fiction',
    priceUsd: 49.99,
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co7r3y.jpg',
  },
  {
    id: 2,
    name: 'FIFA 26',
    priceUsd: 69.99,
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6x9z.jpg',
  },
  {
    id: 3,
    name: 'GTA V',
    priceUsd: 59.99,
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6x9z.jpg',
  },
  {
    id: 4,
    name: 'Call of Duty',
    priceUsd: 59.99,
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6x9z.jpg',
  },
  {
    id: 5,
    name: 'Call of Duty',
    priceUsd: 59.99,
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6x9z.jpg',
  },
  {
    id: 6,
    name: 'Call of Duty',
    priceUsd: 59.99,
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6x9z.jpg',
  },
  {
    id: 7,
    name: 'Call of Duty',
    priceUsd: 59.99,
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6x9z.jpg',
  },
  {
    id: 8,
    name: 'Call of Duty',
    priceUsd: 59.99,
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6x9z.jpg',
  },
  {
    id: 9,
    name: 'Call of Duty',
    priceUsd: 59.99,
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6x9z.jpg',
  },
  {
    id: 10,
    name: 'Call of Duty',
    priceUsd: 59.99,
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6x9z.jpg',
  },
  {
    id: 11,
    name: 'Call of Duty',
    priceUsd: 59.99,
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6x9z.jpg',
  },
  {
    id: 12,
    name: 'Call of Duty',
    priceUsd: 59.99,
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6x9z.jpg',
  },
  {
    id: 13,
    name: 'Call of Duty',
    priceUsd: 59.99,
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6x9z.jpg',
  },
  {
    id: 14,
    name: 'Call of Duty',
    priceUsd: 59.99,
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6x9z.jpg',
  },
  {
    id: 15,
    name: 'Call of Duty',
    priceUsd: 59.99,
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6x9z.jpg',
  },
  {
    id: 16,
    name: 'Call of Duty',
    priceUsd: 59.99,
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6x9z.jpg',
  },
  {
    id: 17,
    name: 'Call of Duty',
    priceUsd: 59.99,
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6x9z.jpg',
  },
  {
    id: 18,
    name: 'Call of Duty',
    priceUsd: 59.99,
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6x9z.jpg',
  },
  {
    id: 19,
    name: 'Call of Duty',
    priceUsd: 59.99,
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6x9z.jpg',
  },
  {
    id: 20,
    name: 'Call of Duty',
    priceUsd: 59.99,
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6x9z.jpg',
  },
  {
    id: 21,
    name: 'Elden Ring',
    priceUsd: 59.99,
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg',
  },
  {
    id: 22,
    name: 'Cyberpunk 2077',
    priceUsd: 29.99,
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2mdf.jpg',
  },
  {
    id: 23,
    name: 'The Witcher 3: Wild Hunt',
    priceUsd: 39.99,
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg',
  },
  {
    id: 24,
    name: 'Red Dead Redemption 2',
    priceUsd: 59.99,
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1q1f.jpg',
  },
  {
    id: 25,
    name: 'God of War',
    priceUsd: 19.99,
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7h.jpg',
  },
  {
    id: 26,
    name: 'Horizon Forbidden West',
    priceUsd: 69.99,
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2v76.jpg',
  },
  {
    id: 27,
    name: "Marvel's Spider-Man",
    priceUsd: 39.99,
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r77.jpg',
  },
  {
    id: 28,
    name: 'Ghost of Tsushima',
    priceUsd: 59.99,
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co27v1.jpg',
  },
  {
    id: 29,
    name: 'Resident Evil Village',
    priceUsd: 39.99,
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2uk8.jpg',
  },
  {
    id: 30,
    name: 'Final Fantasy VII Remake',
    priceUsd: 69.99,
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1vcf.jpg',
  },

];

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
    // return mockGames.find((game) => game.id === id);
};

export const fetchAutocompleteSuggestions = async (query: string): Promise<string[]> => {
  if (!query.trim()) return [];
  
  const response = await api.get<string[]>('/api/autocomplete', {
    params: { q: query },
  });
  return response.data;
};

export default api;