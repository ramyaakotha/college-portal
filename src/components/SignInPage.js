import React, { useState } from 'react';
import { Box, Card, Typography, Button, TextField, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import backgroundImage from './../assets/background.jpg';  // Adjust the path as needed

const SignInPage = () => {
  const navigate = useNavigate();

  // State variables
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Handle email validation and OTP sending
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError('');
  };

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      // Call your email validation API here
      const emailExists = await validateEmail(email); // Assume this is your API call to check email
      if (emailExists) {
        setEmailError('Email already exists. Please use a different email.');
        setLoading(false);
      } else {
        // If email does not exist, trigger OTP sending API
        const otpResponse = await sendOtpToEmail(email); // Assume this is your API call to send OTP
        if (otpResponse.success) {
          setOtpSent(true);
          setLoading(false);
        } else {
          setEmailError('There was an issue sending OTP. Please try again.');
          setLoading(false);
        }
      }
    } catch (error) {
      setEmailError('Error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      // Call your OTP verification API here
      const verificationResponse = await verifyOtp(email, otp); // Assume this is your API call to verify OTP
      if (verificationResponse.success) {
        setOtpError('');
        handleSignUp(); // Call handleSignUp after successful OTP verification
      } else {
        setOtpError('Invalid OTP. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      setOtpError('Error occurred during OTP verification. Please try again.');
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);

    // Simple password validation
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      // Sign-up logic (e.g., call an API to create a user)
      const signUpResponse = await signUpUser(firstName, lastName, email, password);
      if (signUpResponse.success) {
        setLoading(false);
        navigate('/'); // Redirect to Login page after successful sign-up
      } else {
        setLoading(false);
        alert('Sign-up failed. Please try again.');
      }
    } catch (error) {
      setLoading(false);
      alert('Error occurred during sign-up. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
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
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
        }}
      >
        <Typography variant="h4" gutterBottom color="primary">
          Create Account
        </Typography>
        <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <TextField
            label="Email Address"
            type="email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={handleEmailChange}
            error={!!emailError}
            helperText={emailError}
          />
          {!otpSent && (
            <Button variant="contained" color="primary" fullWidth onClick={handleSendOtp} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Send OTP'}
            </Button>
          )}
          {otpSent && (
            <>
              <TextField
                label="Enter OTP"
                variant="outlined"
                fullWidth
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                error={!!otpError}
                helperText={otpError}
              />
              <Button variant="contained" color="primary" fullWidth onClick={handleVerifyOtp} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Verify OTP'}
              </Button>
            </>
          )}
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
          />
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!confirmPasswordError}
            helperText={confirmPasswordError}
          />
          <Button variant="contained" color="primary" fullWidth onClick={handleSignUp} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Sign Up'}
          </Button>
          <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
            Already have an account?{' '}
            <Button variant="text" color="secondary" size="small" sx={{ fontWeight: 'bold' }} onClick={() => navigate('/')}>
              Login
            </Button>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

// Helper functions to simulate API calls
const validateEmail = async (email) => {
 
  const response = await fetch(`/api/validate-email?email=${email}`);
  const data = await response.json();
  
  return data.exists;  // Assume the response has an 'exists' field which is true/false
};

const sendOtpToEmail = async (email) => {
  // Simulate API call to send OTP to email
  return { success: true };  // Simulate successful OTP sending
};

const verifyOtp = async (email, otp) => {
  // Simulate API call to verify OTP
  return { success: true };  // Simulate successful OTP verification
};

const signUpUser = async (firstName, lastName, email, password) => {
  // Simulate API call to sign up the user
  return { success: true };  // Simulate successful sign-up
};

export default SignInPage;
