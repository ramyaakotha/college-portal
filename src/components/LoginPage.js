import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Card, 
  InputAdornment, 
  CircularProgress 
} from '@mui/material';
import { Email, Lock } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';  // for navigation
import axios from 'axios'; // Assuming axios is used for API calls

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // hook for navigation

  const handleLogin = async () => {
    setIsLoading(true);
    setErrorMessage(''); // Reset error message on each attempt
    try {
      // Replace with your actual login API call
      const response = await axios.post('/api/login', { email, password });
  
      if (response.status === 200) {
        const { userRole, userID } = response.data;  // Assuming the API response contains userRole and userID
        
        // Store the user role and userID in localStorage
        localStorage.setItem('userRole', userRole);
        localStorage.setItem('userID', userID);  // Storing userID

        // Redirect to the respective dashboard based on the user role
        if (userRole === 'admin') {
          navigate('/admin-dashboard'); // Redirect to Admin Dashboard
        } else if (userRole === 'teacher') {
          navigate('/teacher-dashboard'); // Redirect to Teacher Dashboard
        } else if (userRole === 'student') {
          navigate('/student-dashboard'); // Redirect to Student Dashboard
        } else {
          setErrorMessage('Unexpected user role.');
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // If the user does not exist (404), show specific message
        setErrorMessage('No account exists. Please sign up.');
      } else {
        // Generic error message
        setErrorMessage('Login failed! Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #32CD32, #f5f5f5)',
        padding: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          width: '100%',
          padding: 3,
          borderRadius: 3,
          boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom color="primary">
          Welcome Back!
        </Typography>
        <Typography variant="body1" gutterBottom color="textSecondary">
          Please login to access your college dashboard.
        </Typography>

        {/* Error Message */}
        {errorMessage && (
          <Typography variant="body2" color="error" sx={{ marginBottom: 2 }}>
            {errorMessage}
          </Typography>
        )}

        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 2 }}
        >
          <TextField 
            label="Email Address" 
            type="email" 
            variant="outlined" 
            fullWidth 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <TextField 
            label="Password" 
            type="password" 
            variant="outlined" 
            fullWidth 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth
            onClick={handleLogin}
            disabled={isLoading || !email || !password}
            sx={{
              padding: 1.5,
              fontSize: '1rem',
              fontWeight: 'bold',
              textTransform: 'none',
              borderRadius: 2,
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.05)' },
            }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Login'}
          </Button>
          <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
            New user?{' '}
            <Button 
              variant="text" 
              color="secondary" 
              size="small"
              sx={{ fontWeight: 'bold' }}
              onClick={() => navigate('/sign-up')}
            >
              Sign Up
            </Button>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default LoginPage;
