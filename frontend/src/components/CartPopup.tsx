import { Popover, Typography, List, ListItem, ListItemText, ListItemIcon, Button, Divider, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';

interface CartPopupProps {
  anchorEl: null | HTMLElement;
}

export default function CartPopup({ anchorEl }: CartPopupProps) {
  const [items] = useState([
    { name: 'Split Fiction', price: 40.33 },
    { name: 'FIFA 26', price: 59.99 },
    { name: 'Call of Duty', price: 49.99 },
  ]);

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <Popover
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      onClose={() => {}} // No close on click away, since hover-based
      disableRestoreFocus
      sx={{ pointerEvents: 'none' }} // Hover only, no clicks inside except buttons
    >
      <Box sx={{ p: 2, minWidth: 300 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Cart
        </Typography>
        <List dense>
          {items.map((item, idx) => (
            <ListItem key={idx}>
              <ListItemText primary={item.name} secondary={`€${item.price.toFixed(2)}`} />
              <ListItemIcon>
                <IconButton size="small">
                  <CloseIcon fontSize="small" />
                </IconButton>
              </ListItemIcon>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 1 }} />
        <Typography variant="subtitle1" sx={{ textAlign: 'right' }}>
          Total: €{total.toFixed(2)}
        </Typography>
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 1 }}>
          Checkout
        </Button>
      </Box>
    </Popover>
  );
}