import React, { useState } from 'react';
import { Box, Typography, Drawer, List, ListItem, ListItemText } from '@mui/material';
import ProfileMenu from './ProfileMenu'; // Import Profile Menu
import TeacherCourses from './TeacherCourses'; // Teacher Courses Component

const TeacherDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('Dashboard');

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Left Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' },
        }}
      >
        <Typography variant="h5" sx={{ padding: 2, textAlign: 'center' }}>
          Teacher Portal
        </Typography>
        <List>
          <ListItem button onClick={() => handleTabChange('Dashboard')}>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button onClick={() => handleTabChange('Courses')}>
            <ListItemText primary="Courses" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, padding: 3 }}>
        {/* Profile Menu */}
        <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
          <ProfileMenu />
        </Box>

        {/* Conditional Rendering for Tabs */}
        {selectedTab === 'Dashboard' && (
          <Typography variant="h4">Welcome to Teacher Dashboard</Typography>
        )}
        {selectedTab === 'Courses' && <TeacherCourses />}
      </Box>
    </Box>
  );
};

export default TeacherDashboard;
