import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  useEffect(() => {
    // Fetch user data from localStorage or API to populate the form
    const userData = JSON.parse(localStorage.getItem('userData')); // Replace with actual API call if needed
    if (userData) {
      setUser({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
      });
    }
  }, []);

  const handleSubmit = () => {
    // Update the profile logic here (API call)
    localStorage.setItem('userData', JSON.stringify(user));
    navigate(-1); // Go back to the previous page (Dashboard)
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Edit Profile
      </Typography>
      <TextField
        label="First Name"
        variant="outlined"
        fullWidth
        value={user.firstName}
        onChange={(e) => setUser({ ...user, firstName: e.target.value })}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Last Name"
        variant="outlined"
        fullWidth
        value={user.lastName}
        onChange={(e) => setUser({ ...user, lastName: e.target.value })}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Email"
        type="email"
        variant="outlined"
        fullWidth
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        sx={{ marginBottom: 2 }}
        disabled
      />
      <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
        Save Changes
      </Button>
    </Box>
  );
};

export default EditProfile;
