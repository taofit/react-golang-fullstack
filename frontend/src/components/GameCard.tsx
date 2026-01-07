import { Card, CardMedia, CardContent, Typography, Box, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useState } from 'react';
import type { Game } from '../types';
import { Link } from 'react-router-dom';

interface GameCardProps {
  game: Game;
  isFavourite?: boolean;
  onToggleFavourite?: (gameId: number) => void;
}

export default function GameCard({ game, isFavourite = false, onToggleFavourite }: GameCardProps) {
  const [favourited, setFavourited] = useState(isFavourite);

  const handleFavourite = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking heart
    e.stopPropagation();
    setFavourited(!favourited);
    onToggleFavourite?.(game.id);
  };

  // Default fallback if no cover
  const coverUrl = game.coverUrl || 'https://via.placeholder.com/300x450/2a004a/ffffff?text=No+Image';

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#2a004a',
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.5)',
        },
      }}
      component={Link}
      to={`/game/${game.id}`}
      style={{ textDecoration: 'none' }}
    >
      <CardMedia
        component="img"
        image={coverUrl}
        alt={game.name}
        sx={{ height: 450, objectFit: 'cover' }}
      />

      <CardContent sx={{ flexGrow: 1, pb: 2 }}>
        <Typography variant="h6" color="white" noWrap>
          {game.name}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <Typography variant="h6" color="#ab47bc" fontWeight="bold">
            ${game.priceUsd.toFixed(2)}
          </Typography>

          <IconButton onClick={handleFavourite} sx={{ color: favourited ? '#ff4081' : '#666' }}>
            {favourited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}