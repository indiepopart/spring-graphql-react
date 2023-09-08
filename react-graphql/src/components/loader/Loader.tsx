import { Box, CircularProgress, Skeleton } from '@mui/material';

const Loader = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
      <CircularProgress />
    </Box>
  );
}

export default Loader;
