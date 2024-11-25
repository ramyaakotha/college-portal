import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import axios from 'axios';

const AddCourseModal = ({ open, onClose }) => {
  const [courseName, setCourseName] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [semester, setSemester] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    console.log(courseName, courseDesc, semester )
    try {
      const payload = { courseName, courseDesc, semester };
      await axios.post('/api/courses', payload); // Replace with your API endpoint
      alert('Course added successfully!');
      onClose();
    } catch (error) {
      console.error('Error adding course:', error);
      alert('Failed to add course.');
    } finally {
      setLoading(false);
    }
  };

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
          Add New Course
        </Typography>
        <TextField
          fullWidth
          label="Course Name"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          fullWidth
          label="Course Description"
          value={courseDesc}
          onChange={(e) => setCourseDesc(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          fullWidth
          label="Semester"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <Box sx={{ textAlign: 'center', marginTop: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddCourseModal;
