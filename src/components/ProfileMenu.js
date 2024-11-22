import React, { useState } from 'react';
import { Avatar, IconButton, Menu, MenuItem, Divider } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ProfileMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null); // State to manage the Menu
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Clear user data and redirect to login page
    // localStorage.removeItem('userRole');
    // localStorage.removeItem('userData'); // if you store user data
    navigate('/login');
  };

  const handleEditProfile = () => {
    // Redirect to the Edit Profile page (create this page as per your requirements)
    navigate('/edit-profile');
  };

  return (
    <div>
      <IconButton onClick={handleMenuOpen} size="large">
        <Avatar>
          <AccountCircle />
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{ mt: 1 }}
      >
        <MenuItem onClick={handleEditProfile}>Edit Profile</MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

export default ProfileMenu;
