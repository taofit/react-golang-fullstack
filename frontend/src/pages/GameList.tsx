import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import GameGrid from '../components/GameGrid';
import PaginationControls from '../components/Pagination';
import * as api from '../api/game';
import type { Game } from '../types';

// interface ApiResponse {
//   games: Game[];
//   pagination: {
//     page: number;
//     limit: number;
//     total: number;
//   };
// }
// const mockGames: Game[] = [
//   {
//     id: 1,
//     name: 'Split Fiction',
//     priceUsd: 49.99,
//     coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co7r3y.jpg',
//   },
//   {
//     id: 2,
//     name: 'FIFA 26',
//     priceUsd: 69.99,
//     coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6x9z.jpg',
//   },
//   {
//     id: 3,
//     name: 'GTA V',
//     priceUsd: 59.99,
//     coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6x9z.jpg',
//   },
//   {
//     id: 4,
//     name: 'Call of Duty',
//     priceUsd: 59.99,
//     coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6x9z.jpg',
//   },
//   {
//     id: 5,
//     name: 'Call of Duty',
//     priceUsd: 59.99,
//     coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6x9z.jpg',
//   },
//   {
//     id: 6,
//     name: 'Call of Duty',
//     priceUsd: 59.99,
//     coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6x9z.jpg',
//   },
//   {
//     id: 7,
//     name: 'Call of Duty',
//     priceUsd: 59.99,
//     coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6x9z.jpg',
//   },
//   {
//     id: 8,
//     name: 'Call of Duty',
//     priceUsd: 59.99,
//     coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6x9z.jpg',
//   },
//   {
//     id: 9,
//     name: 'Call of Duty',
//     priceUsd: 59.99,
//     coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6x9z.jpg',
//   },
//   {
//     id: 10,
//     name: 'Call of Duty',
//     priceUsd: 59.99,
//     coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6x9z.jpg',
//   },
//   {
//     id: 11,
//     name: 'Call of Duty',
//     priceUsd: 59.99,
//     coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6x9z.jpg',
//   },
//   {
//     id: 12,
//     name: 'Call of Duty',
//     priceUsd: 59.99,
//     coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6x9z.jpg',
//   },
//   {
//     id: 13,
//     name: 'Call of Duty',
//     priceUsd: 59.99,
//     coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6x9z.jpg',
//   },
//   {
//     id: 14,
//     name: 'Call of Duty',
//     priceUsd: 59.99,
//     coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6x9z.jpg',
//   },
//   {
//     id: 15,
//     name: 'Call of Duty',
//     priceUsd: 59.99,
//     coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6x9z.jpg',
//   },
//   {
//     id: 16,
//     name: 'Call of Duty',
//     priceUsd: 59.99,
//     coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6x9z.jpg',
//   },
//   {
//     id: 17,
//     name: 'Call of Duty',
//     priceUsd: 59.99,
//     coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6x9z.jpg',
//   },
//   {
//     id: 18,
//     name: 'Call of Duty',
//     priceUsd: 59.99,
//     coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6x9z.jpg',
//   },
//   {
//     id: 19,
//     name: 'Call of Duty',
//     priceUsd: 59.99,
//     coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6x9z.jpg',
//   },
//   {
//     id: 20,
//     name: 'Call of Duty',
//     priceUsd: 59.99,
//     coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6x9z.jpg',
//   },
//   {
//     id: 21,
//     name: 'Elden Ring',
//     priceUsd: 59.99,
//     coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg',
//   },
//   {
//     id: 22,
//     name: 'Cyberpunk 2077',
//     priceUsd: 29.99,
//     coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2mdf.jpg',
//   },
//   {
//     id: 23,
//     name: 'The Witcher 3: Wild Hunt',
//     priceUsd: 39.99,
//     coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg',
//   },
//   {
//     id: 24,
//     name: 'Red Dead Redemption 2',
//     priceUsd: 59.99,
//     coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1q1f.jpg',
//   },
//   {
//     id: 25,
//     name: 'God of War',
//     priceUsd: 19.99,
//     coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7h.jpg',
//   },
//   {
//     id: 26,
//     name: 'Horizon Forbidden West',
//     priceUsd: 69.99,
//     coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2v76.jpg',
//   },
//   {
//     id: 27,
//     name: "Marvel's Spider-Man",
//     priceUsd: 39.99,
//     coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r77.jpg',
//   },
//   {
//     id: 28,
//     name: 'Ghost of Tsushima',
//     priceUsd: 59.99,
//     coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co27v1.jpg',
//   },
//   {
//     id: 29,
//     name: 'Resident Evil Village',
//     priceUsd: 39.99,
//     coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2uk8.jpg',
//   },
//   {
//     id: 30,
//     name: 'Final Fantasy VII Remake',
//     priceUsd: 69.99,
//     coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1vcf.jpg',
//   },

// ];

export default function GameList() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get query params
  const search = searchParams.get('search') || '';
  const page = Number(searchParams.get('page')) || 1;
  const limit = 20; // Fixed limit, or make it configurable

  const [games, setGames] = useState<Game[]>([]);
  const [totalGames, setTotalGames] = useState(0);
  const [loading, setLoading] = useState(true);
  const [favourites, setFavourites] = useState<Set<number>>(new Set());

  const totalPages = Math.ceil(totalGames / limit);

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const res = await api.fetchGames(page, limit, search || undefined);
        setGames(res.games);
        setTotalGames(res.pagination.total);
        // setGames(mockGames);
        // setTotalGames(mockGames.length);
      } catch (err) {
        console.error('Failed to fetch games', err);
        setGames([]);
        setTotalGames(0);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [search, page]);

  const handlePageChange = (newPage: number) => {
    setSearchParams({ search, page: newPage.toString() }, { replace: true });
    window.scrollTo(0, 0); // Scroll to top on page change
  };

  const toggleFavourite = (gameId: number) => {
    setFavourites((prev) => {
      const newSet = new Set(prev);
      newSet.has(gameId) ? newSet.delete(gameId) : newSet.add(gameId);
      return newSet;
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress color="primary" size={60} />
      </Box>
    );
  }

  return (
    <>
      <GameGrid games={games} favourites={favourites} onToggleFavourite={toggleFavourite} />

      <PaginationControls
        page={page}
        totalPages={totalPages}
        totalGames={totalGames}
        onPageChange={handlePageChange}
      />
    </>
  );
}