import { useState } from 'react'
import { Autocomplete, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const mockSuggestions = ['FIFA 23', 'GTA V', 'Split Fiction', 'Call of Duty']

export default function SearchBar() {
  const [value, setValue] = useState<string | null>(null)
  const navigate = useNavigate()

  return (
    <Autocomplete
      freeSolo
      options={mockSuggestions}
      value={value}
      onChange={(_, newValue) => {
        if (newValue) navigate(`/list?search=${encodeURIComponent(newValue)}`)
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search games (e.g. fffa → fifa)"
          variant="outlined"
          fullWidth
          sx={{ mb: 4, bgcolor: 'background.paper' }}
        />
      )}
    />
  )
}