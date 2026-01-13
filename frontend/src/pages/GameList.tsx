import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import GameGrid from '../components/GameGrid';
import PaginationControls from '../components/Pagination';
import * as api from '../api/game';
import type { Game } from '../types';

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
        setGames(res.games || []);
        setTotalGames(res.pagination.total);
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