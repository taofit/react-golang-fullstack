import { useState, useEffect } from 'react';
import { CircularProgress, Box } from '@mui/material';
import GameGrid from '../components/GameGrid';
import type { Game } from '../types';
// import api from '../api/games'; // later

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
  // Add 12–20 more for testing...
];

export default function GameList() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [favourites, setFavourites] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Simulate API delay
    const timer = setTimeout(() => {
      setGames(mockGames);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const toggleFavourite = (id: number) => {
    setFavourites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  return (
    <>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress color="secondary" />
        </Box>
      ) : (
        <GameGrid games={games} favourites={favourites} onToggleFavourite={toggleFavourite} />
      )}
      {/* Pagination component here later */}
    </>
  );
}