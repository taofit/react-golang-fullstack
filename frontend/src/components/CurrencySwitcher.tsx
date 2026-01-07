import { Select, MenuItem } from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import { useState } from 'react'

export default function CurrencySwitcher() {
  const [currency, setCurrency] = useState('EUR')

  const handleChange = (event: SelectChangeEvent) => {
    setCurrency(event.target.value)
  }

  return (
    <Select
      value={currency}
      onChange={handleChange}
      variant="standard"
      sx={{ 
        color: 'white',
        '.MuiSelect-icon': { color: 'white' },
        minWidth: 80
      }}
    >
      <MenuItem value="EUR">€ EUR</MenuItem>
      <MenuItem value="USD">$ USD</MenuItem>
      <MenuItem value="GBP">£ GBP</MenuItem>
    </Select>
  )
}
