import { useState } from 'react';
import { Autocomplete, TextField, InputAdornment, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { fetchAutocompleteSuggestions } from '../api/game';
import debounce from 'lodash/debounce';

export default function SearchBar() {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Debounced fetch — only call API after user stops typing for 300ms
  const debouncedFetch = debounce(async (query: string) => {
    if (query.length < 2) {
      setOptions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const suggestions = await fetchAutocompleteSuggestions(query);
      setOptions(suggestions);
    } catch (err) {
      console.error('Autocomplete failed', err);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, 300);

  const handleInputChange = (_event: any, newInputValue: string) => {
    setInputValue(newInputValue);
    debouncedFetch(newInputValue);
  };

  const handleSubmit = (_event: any, value: string | null) => {
    const searchTerm = value || inputValue;
    if (searchTerm.trim()) {
      navigate(`/list?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/list');
    }
  };

  return (
    <Autocomplete
      freeSolo // Allows typing custom value
      options={options}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onChange={handleSubmit} // Submit on select
      loading={loading}
      filterOptions={(x) => x} // Critical: Disable client-side filtering for server-side search
      noOptionsText="Type to search games..."
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          placeholder="Search games (e.g. fffa → FIFA)"
          variant="outlined"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit(e, null);
            }
          }}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#999' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {loading && <CircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
              </>
            ),
            sx: {
              bgcolor: '#4618ac',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#fff' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#fff' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#fff',
                borderWidth: 2,
              },
            },
          }}
          sx={{
            '& .MuiInputBase-input': { py: 1.5, fontSize: '1rem' },
          }}
        />
      )}
    />
  );
}