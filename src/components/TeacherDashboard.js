// TeacherDashboard.js
import React from 'react';
import { Box, Typography } from '@mui/material';
import ProfileMenu from './ProfileMenu'; // Import ProfileMenu

const TeacherDashboard = () => {
  return (
    <Box sx={{ position: 'relative', padding: 3 }}>
      {/* Profile Menu at the top-right corner */}
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <ProfileMenu />
      </Box>

      <Typography variant="h4">Teacher Dashboard</Typography>
      {/* Teacher-specific content goes here */}
    </Box>
  );
};

export default TeacherDashboard;
