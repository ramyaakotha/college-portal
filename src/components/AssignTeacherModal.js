import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

const AssignTeachersModal = ({ open, onClose, course }) => {
  const [teachers, setTeachers] = useState([
    {
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
    }
  ]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch Teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get('/api/users'); // Replace with your GET API for users
        const teacherData = response.data.filter((user) => user.userRole === 'teacher');
        setTeachers(teacherData);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchTeachers();
  }, []);

  // Reset selected teachers when course changes
  useEffect(() => {
    if (course) {
      setSelectedTeachers([]); // Reset selected teachers when a new course is selected
    }
  }, [course]);

  // Handle Selection
  const handleTeacherSelection = (teacherId) => {
    setSelectedTeachers((prev) =>
      prev.includes(teacherId) ? prev.filter((id) => id !== teacherId) : [...prev, teacherId]
    );
  };

  // Handle Submit
  const handleSubmit = async () => {
    console.log(selectedTeachers)
    console.log(course.id, "courseID")
    setLoading(true);
    try {
      const payload = { teacherIds: selectedTeachers, courseId: course.id };
      await axios.post('/api/assign-teachers', payload); // Replace with your POST API
      alert('Teachers assigned successfully!');
      onClose();
    } catch (error) {
      console.error('Error assigning teachers:', error);
      alert('Failed to assign teachers.');
    } finally {
      setLoading(false);
    }
  };

  if (!course) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Assign Teachers to {course?.coursename}
        </Typography>
        {teachers.map((teacher) => (
          <FormControlLabel
            key={teacher.id}
            control={
              <Checkbox
                checked={selectedTeachers.includes(teacher.id)}
                onChange={() => handleTeacherSelection(teacher.id)}
              />
            }
            label={`${teacher.firstname} ${teacher.lastname}`}
          />
        ))}
        <Box sx={{ textAlign: 'center', marginTop: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading || selectedTeachers.length === 0}
          >
            {loading ? <CircularProgress size={24} /> : 'Assign'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AssignTeachersModal;
