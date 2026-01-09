import { Box, Pagination, Typography } from '@mui/material';

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  totalGames: number;
  onPageChange: (newPage: number) => void;
}

export default function PaginationControls({
  page,
  totalPages,
  totalGames,
  onPageChange,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  return (
    <Box sx={{ mt: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Typography variant="body2" color="text.secondary">
        Showing page {page} of {totalPages} ({totalGames} games total)
      </Typography>

      <Pagination
        count={totalPages}
        page={page}
        onChange={(_, value) => onPageChange(value)}
        color="primary"
        size="large"
        showFirstButton
        showLastButton
        sx={{
          '& .MuiPaginationItem-root': {
            color: 'white',
          },
          '& .Mui-selected': {
            bgcolor: '#ab47bc',
          },
        }}
      />
    </Box>
  );
}