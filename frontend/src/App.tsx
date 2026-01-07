import { Container } from '@mui/material'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import GameList from './pages/GameList'
import GameDetails from './pages/GameDetails'

function App() {
  return (
    <>
      <Header />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Routes>
          <Route path="/" element={<GameList />} />
          <Route path="/list" element={<GameList />} />
          <Route path="/game/:id" element={<GameDetails />} />
        </Routes>
      </Container>
    </>
  )
}

export default App