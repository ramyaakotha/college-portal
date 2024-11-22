import React from 'react';
import { Box, Typography } from '@mui/material';
import ProfileMenu from './ProfileMenu'; // Import ProfileMenu

const AdminDashboard = () => {
  return (
    <Box sx={{ position: 'relative', padding: 3 }}>
      {/* Profile Menu at the top-right corner */}
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <ProfileMenu />
      </Box>

      <Typography variant="h4">Admin Dashboard</Typography>
      {/* Admin-specific content goes here */}
    </Box>
  );
};

export default AdminDashboard;
