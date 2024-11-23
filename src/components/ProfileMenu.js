import React, { useState } from 'react';
import { Menu, MenuItem, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditProfileModal from './EditProfile'; // Modal to handle profile editing

import { useNavigate } from 'react-router-dom';


const ProfileMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const navigate = useNavigate();
  const handleEditProfile = () => {
    setEditProfileOpen(true);
    handleMenuClose();
  };

  const handleLogout = () =>{
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId'); // Add any other user-related data if stored

    // Redirect to the login page
    navigate('/');
  }

  return (
    <>
      {/* Profile Icon */}
      <IconButton onClick={handleMenuOpen}>
        <AccountCircleIcon fontSize="large" color="gray" />
      </IconButton>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditProfile}>Edit Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>

      {/* Edit Profile Modal */}
      <EditProfileModal
        open={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
      />
    </>
  );
};

export default ProfileMenu;
