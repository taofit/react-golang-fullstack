import { Typography, Box } from '@mui/material'
import { useParams } from 'react-router-dom'

export default function GameDetails() {
  const { id } = useParams()
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'white' }}>
        Game Details: {id}
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        Details for game {id} will appear here.
      </Typography>
    </Box>
  )
}
