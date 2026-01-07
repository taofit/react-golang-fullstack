import { AppBar, Toolbar, Box } from '@mui/material'
import SearchBar from './SearchBar'
import CurrencySwitcher from './CurrencySwitcher'

export default function Header() {
  return (
    <AppBar position="static" sx={{ bgcolor: '#4a148c', mb: 4 }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <img src="/logo.png" alt="Logo" height={40} /> {/* Add your logo */}
        </Box>
        <SearchBar />
        <CurrencySwitcher />
      </Toolbar>
    </AppBar>
  )
}