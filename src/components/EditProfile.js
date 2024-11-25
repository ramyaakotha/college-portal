import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

const EditProfileModal = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    mobileNumber: '',
    email: '',
    password: '',
    userRole: '',
  });

  const userID = localStorage.getItem('userID'); // Replace with actual userId (from context or auth)
  const role = localStorage.getItem('userRole');
  // Fetch user data when modal opens
  useEffect(() => {
    if (open) {
      setLoading(true);
      axios.get(`http://127.0.0.1:8081/api/register/${userID}`) // Replace with your GET API
        .then((response) => setUserData(response.data))
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    }
  }, [open, userID]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value, userRole: role}));
  };
  console.log(userData,"user data");
  // Submit updates to the API
  const handleSave = () => {
    setLoading(true);
    axios
      .put(`http://127.0.0.1:8081/api/register/${userID}`, userData) // Replace with your PUT API
      .then(() => {
        alert('Profile updated successfully!');
        onClose();
      })
      .catch((error) => alert('Error updating profile. Please try again.'))
      .finally(() => setLoading(false));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <TextField
              label="First Name"
              name="firstName"
              value={userData.firstName}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={userData.lastName}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Gender"
              name="gender"
              value={userData.gender}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Mobile Number"
              name="mobileNumber"
              value={userData.mobileNumber}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={userData.password}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" disabled={loading}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileModal;
