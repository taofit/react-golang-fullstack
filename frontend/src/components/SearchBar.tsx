import { useState } from 'react';
import { InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
  const [value, setValue] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      navigate(`/list?search=${encodeURIComponent(value.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search games..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#999' }} />
            </InputAdornment>
          ),
          sx: {
            bgcolor: '#4618ac',           // Light gray background (matches Eneba)
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#fff',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#fff',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#fff',
              borderWidth: 2,
            },
          },
        }}
        sx={{
          '& .MuiInputBase-input': {
            py: 1.5,
            fontSize: '1rem',
          },
        }}
      />
    </form>
  );
}