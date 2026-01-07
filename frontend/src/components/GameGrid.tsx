import { Grid, Box, Typography } from '@mui/material';
import GameCard from './GameCard';
import type { Game } from '../types';

interface GameGridProps {
  games: Game[];
  favourites?: Set<number>;
  onToggleFavourite?: (gameId: number) => void;
}

export default function GameGrid({ games, favourites = new Set(), onToggleFavourite }: GameGridProps) {
  if (games.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" color="white">
          No games found
        </Typography>
        <Typography variant="body1" color="gray" mt={1}>
          Try adjusting your search
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={4}>
      {games.map((game) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }} key={game.id}>
          <GameCard
            game={game}
            isFavourite={favourites.has(game.id)}
            onToggleFavourite={onToggleFavourite}
          />
        </Grid>
      ))}
    </Grid>
  );
}