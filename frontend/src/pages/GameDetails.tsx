import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Container,
  Paper,
  Chip,
  Stack,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { fetchGameById, type Game } from '../api/game';

export default function GameDetails() {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadGame = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(false);
        const data = await fetchGameById(Number(id));
        console.log('game data: ',data);
        setGame(data || null);
      } catch (err) {
        console.error('Failed to load game', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadGame();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !game) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="error">
          Game not found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          The game you're looking for doesn't exist or couldn't be loaded.
        </Typography>
      </Container>
    );
  }

  return (
    <Box>
      <Container maxWidth="xl">
        <Paper
          sx={{
            bgcolor: '#2a004a',
            p: { xs: 3, md: 6 },
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={6} alignItems="start">
            <Box sx={{ flexShrink: 0, textAlign: 'center' }}>
              <Box
                component="img"
                src={game.coverUrl || 'https://via.placeholder.com/300x450'}
                alt={game.name}
                sx={{
                  width: '100%',
                  maxWidth: 300,
                  borderRadius: 2,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                }}
              />

              <Box sx={{ mt: 3 }}>
                <Typography variant="h4" color="#ab47bc" fontWeight="bold">
                  €{game.priceUsd.toFixed(2)}
                </Typography>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<AddShoppingCartIcon />}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    bgcolor: '#ffd600',
                    color: 'black',
                    fontWeight: 'bold',
                    '&:hover': { bgcolor: '#e6c200' },
                  }}
                >
                  Add to Cart
                </Button>
              </Box>

              <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 3 }}>
                <Chip label="Digital Key" color="primary" />
                <Chip label="Instant Delivery" color="secondary" />
              </Stack>
            </Box>

            {/* Right: Description */}
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" color="white" gutterBottom>
                About {game.name}
              </Typography>

              <Typography variant="body1" color="text.secondary" paragraph>
                {game.summary ||
                  `Experience the ultimate gaming adventure with ${game.name}. Featuring stunning graphics, immersive gameplay, and hours of entertainment, this title has received critical acclaim worldwide.`}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                • Release Date: January 2026  
                <br />• Developer: AAA Studios  
                <br />• Platform: PC, PlayStation, Xbox
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}