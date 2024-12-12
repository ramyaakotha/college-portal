import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const OnboardTeacherModal = ({ open, onClose }) => {
  // State Variables
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Input Handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" })); // Clear error
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First Name is required.";
    if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required.";
    if (!formData.gender) newErrors.gender = "Gender is required.";
    if (!formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) newErrors.email = "Invalid email format.";
    if (!formData.mobileNumber.match(/^\d{10}$/)) newErrors.mobileNumber = "Mobile number must be 10 digits.";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      gender: formData.gender,
      email: formData.email,
      mobileNumber: formData.mobileNumber,
      password: formData.password,
      userRole: "teacher", // Fixed value
    };

    try {
      const response = await axios.post("http://127.0.0.1:8081/staff/onboard-teacher", payload); // Replace with your API endpoint
      console.log("response payload", response)
      if (response.status === 200) {
        // onSuccess(); // Trigger success callback
        alert("Onboarded Successfully");
        onClose(); // Close modal
      }
    } catch (error) {
      console.log(error,"error jdf");
      alert("Error onboarding teacher. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="onboard-teacher-modal">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
          maxWidth: 400,
          width: "100%",
        }}
      >
        <Typography variant="h6" component="h2" mb={2} color="primary">
          Onboard Teacher
        </Typography>
        <form noValidate autoComplete="off" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <TextField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            error={!!errors.firstName}
            helperText={errors.firstName}
            fullWidth
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            error={!!errors.lastName}
            helperText={errors.lastName}
            fullWidth
          />
          <TextField
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            error={!!errors.gender}
            helperText={errors.gender}
            select
            fullWidth
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
          />
          <TextField
            label="Mobile Number"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            error={!!errors.mobileNumber}
            helperText={errors.mobileNumber}
            fullWidth
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            error={!!errors.password}
            helperText={errors.password}
            fullWidth
          />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Onboard Teacher"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default OnboardTeacherModal;
