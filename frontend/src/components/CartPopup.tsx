import {
  Popover,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';

interface CartPopupProps {
  anchorEl: null | HTMLElement;
  onClose?: () => void;
}

export default function CartPopup({ anchorEl, onClose }: CartPopupProps) {
  const [items] = useState([
    { name: 'Split Fiction', price: 40.33 },
    { name: 'FIFA 26', price: 59.99 },
    { name: 'Call of Duty', price: 49.99 },
  ]);

  const total = items.reduce((sum, item) => sum + item.price, 0);

  const open = Boolean(anchorEl);

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      disableRestoreFocus
      sx={{
        pointerEvents: 'auto',
        mt: 1,
      }}
      PaperProps={{
        onMouseLeave: onClose,
        sx: { pointerEvents: 'auto' },
      }}
    >
      <Box sx={{ p: 2, minWidth: 240, position: 'relative' }}>
        {/* Close Button (X) */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'text.secondary',
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        {/* Title */}
        <Typography variant="h6" sx={{ mb: 2, pr: 4 }}>
          Cart ({items.length})
        </Typography>

        {/* Cart Items */}
        {items.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
            Your cart is empty
          </Typography>
        ) : (
          <>
            <List dense>
              {items.map((item, idx) => (
                <ListItem
                  key={idx}
                  secondaryAction={
                    <IconButton edge="end" size="small">
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  }
                  disablePadding
                >
                  <ListItemText
                    primary={item.name}
                    secondary={`€${item.price.toFixed(2)}`}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" sx={{ textAlign: 'right', mb: 2 }}>
              Total: €{total.toFixed(2)}
            </Typography>

            <Button variant="contained" color="primary" fullWidth>
              Checkout
            </Button>
          </>
        )}
      </Box>
    </Popover>
  );
}