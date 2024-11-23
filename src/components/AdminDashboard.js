import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, Grid, CircularProgress, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // for navigation
import axios from 'axios'; // Assuming axios is used for API calls
import ProfileMenu from './ProfileMenu'; // Import ProfileMenu
import OnboardTeacherModal from './OnboardTeacherModal'; // Import modal for onboarding teachers

const AdminDashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [teachers, setTeachers] = useState([{
    "id": 1,
    "firstname": "John",
    "lastname": "Doe",
    "gender": "Male",
    "mobilenumber": "1234567890",
    "email": "john.doe@example.com",
    "password": "hashedpassword",
    "userRole": "teacher",
    "otp": "123456",
    "otpExpirationTime": "2024-12-31T23:59:59"
  },
  {
    "id": 2,
    "firstname": "Jane",
    "lastname": "Smith",
    "gender": "Female",
    "mobilenumber": "0987654321",
    "email": "jane.smith@example.com",
    "password": "hashedpassword",
    "userRole": "teacher",
    "otp": "654321",
    "otpExpirationTime": "2024-12-31T23:59:59"
  }]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showStaff, setShowStaff] = useState(true); // State to toggle between staff view and other views
  const navigate = useNavigate(); // Hook for navigation

  // Fetching teachers list when the component mounts
  useEffect(() => {
    const fetchTeachers = async () => {
      setIsLoading(true);
      setErrorMessage(''); // Reset error message
      try {
        const response = await axios.get('/api/teachers'); // Replace with your teacher GET API
        const filteredTeachers=  response.data.filter(user=>user.userRole === "teacher")
        setTeachers(filteredTeachers); // Set teachers data
      } catch (error) {
        setErrorMessage('Failed to load teacher data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeachers(); // Call the fetchTeachers function
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);
  
  const handleOnboardingSuccess = () => {
    alert("Teacher onboarded successfully!");
    // Perform additional actions if needed, like refreshing data
  };

  const handleStaffToggle = () => {
    setShowStaff(!showStaff); // Toggle the showStaff state
  };

  return (
    <Box sx={{ position: 'relative', padding: 3 }}>
      {/* Profile Menu at the top-right corner */}
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <ProfileMenu />
      </Box>

      <Typography variant="h4">Admin Dashboard</Typography>

      {/* Flexbox Container for Buttons */}
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 3 }}>
        {/* Onboard Teacher Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleModalOpen}
          sx={{ flex: 1 }}
        >
          Onboard Teacher
        </Button>

        {/* Show/Hide Staff Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleStaffToggle}
          sx={{ flex: 1 }}
        >
          {showStaff ? 'Hide Staff' : 'Show Staff'}
        </Button>
      </Box>

      {/* Loading Spinner */}
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          {/* Error Message */}
          {errorMessage && (
            <Typography variant="body2" color="error" sx={{ marginBottom: 2 }}>
              {errorMessage}
            </Typography>
          )}

          {/* Display Teacher Cards */}
          {showStaff && (
            <Grid container spacing={2}>
              {teachers.map((teacher) => (
                <Grid item xs={12} sm={6} md={4} key={teacher.id}>
                  <Card sx={{ maxWidth: 345 }}>
                    <CardContent>
                      {/* Avatar Icon */}
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          marginBottom: 2,
                          backgroundColor: '#3f51b5', // Color of avatar, can be dynamic
                        }}
                      >
                        {/* Display initials as fallback */}
                        {teacher.firstname[0]}{teacher.lastname[0]}
                      </Avatar>

                      <Typography variant="h6">{`${teacher.firstname} ${teacher.lastname}`}</Typography>
                      <Typography variant="body2" color="textSecondary">{teacher.email}</Typography>
                      <Typography variant="body2" color="textSecondary">{teacher.mobilenumber}</Typography>
                      <Typography variant="body2" color="textSecondary">{teacher.gender}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {/* Onboard Teacher Modal */}
      <OnboardTeacherModal
        open={modalOpen}
        onClose={handleModalClose}
        onSuccess={handleOnboardingSuccess}
      />
    </Box>
  );
};

export default AdminDashboard;
