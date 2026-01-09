import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
} from '@mui/material';
import { useState } from 'react';

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

const regions = [
  { label: 'Sweden', flag: '🇸🇪' },
  { label: 'Germany', flag: '🇩🇪' },
  { label: 'Spain', flag: '🇪🇸' },
  { label: 'France', flag: '🇫🇷' },
  { label: 'Italy', flag: '🇮🇹' },
  { label: 'United Kingdom', flag: '🇬🇧' },
];
const languages = ['English EU', 'Deutsch EU', 'Español EU', 'Français EU', 'Italiano EU'];
const currencies = ['Swedish Krona (SEK)', 'Euro (€)', 'US Dollar ($)', 'British Pound (£)'];

export default function SettingsDialog({ open, onClose }: SettingsDialogProps) {
  const [region, setRegion] = useState('Sweden');
  const [language, setLanguage] = useState('English EU');
  const [currency, setCurrency] = useState('Swedish Krona (SEK)');

  const handleSave = () => {
    // Here you would save to context/localStorage
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: '#4a148c', color: 'white', py: 3 }}>
        <Typography variant="h5" align="center">
          Update your settings
        </Typography>
        <Typography variant="body2" align="center" sx={{ mt: 1, opacity: 0.9 }}>
          Set your preferred region, language, and the currency.
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 4 }}>
        {/* Region */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Region</InputLabel>
          <Select value={region} onChange={(e) => setRegion(e.target.value)} label="Region">
            {regions.map((region) => (
              <MenuItem key={region.label} value={region.label}>
                {region.flag} {region.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Language */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Language</InputLabel>
          <Select value={language} onChange={(e) => setLanguage(e.target.value)} label="Language">
            {languages.map((l) => (
              <MenuItem key={l} value={l}>
                {l}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Currency */}
        <FormControl fullWidth>
          <InputLabel>Currency</InputLabel>
          <Select value={currency} onChange={(e) => setCurrency(e.target.value)} label="Currency">
            {currencies.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ color: 'white', borderColor: 'white' }}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#ffd600', color: 'black', '&:hover': { bgcolor: '#e6c200' } }}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}