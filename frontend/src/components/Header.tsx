import { AppBar, Toolbar, Box, IconButton, Badge, Typography, Container } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import SearchBar from './SearchBar';
import SettingsDialog from './SettingsDialog';
import { useState } from 'react';
import CartPopup from './CartPopup';

export default function Header() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cartAnchor, setCartAnchor] = useState<null | HTMLElement>(null);

  const handleCartHover = (e: React.MouseEvent<HTMLElement> | React.FocusEvent<HTMLElement>) => {
    setCartAnchor(e.currentTarget);
  };

  const handleCartLeave = () => {
    setCartAnchor(null);
  };
  return (
    <>
    <AppBar position="static" sx={{ bgcolor: '#4618ac', py: 1 }}>
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', gap: 2 }} disableGutters>
          {/* Logo */}
          <Box component="a" href="/" sx={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="https://static.eneba.games/branding/v2/logoFull.svg"
              alt="Eneba Logo"
              height={36}
              style={{ height: '36px', width: 'auto' }}
            />
          </Box>

          {/* Search Bar */}
          <Box sx={{ flexGrow: 1, maxWidth: 720 }}>
            <SearchBar />
          </Box>

          {/* Right Side */}
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            {/* Language/Currency Text Link */}
            <Typography
              variant="body1"
              onClick={() => setDialogOpen(true)}
              sx={{
                color: 'white',
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 },
                whiteSpace: 'nowrap',
              }}
            >
              🇸🇪 English | SEK kr
            </Typography>

            {/* Favourites */}
            <IconButton color="inherit">
              <Badge badgeContent={2} color="secondary">
                <FavoriteBorderIcon sx={{ color: 'white' }} />
              </Badge>
            </IconButton>

            {/* Cart */}
            <IconButton 
              color="inherit"
              onClick={handleCartHover}
              onFocus={handleCartHover}
            >
              <Badge badgeContent={3} color="secondary">
                <ShoppingCartOutlinedIcon sx={{ color: 'white' }} />
              </Badge>
            </IconButton>
            <CartPopup anchorEl={cartAnchor} onClose={handleCartLeave} />

            {/* Profile */}
            <IconButton color="inherit">
              <AccountCircleOutlinedIcon sx={{ color: 'white' }} />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>

    {/* Settings Dialog */}
    <SettingsDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  );
}