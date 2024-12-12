import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

const CourseModal = ({ open, handleClose }) => {
  const [allCourses, setAllCourses] = useState([]);

  useEffect(() => {
    // Fetch all available courses
    fetch('http://127.0.0.1:8081/api/courses')
      .then((response) => response.json())
      .then((data) => setAllCourses(data))
      .catch((error) => console.error('Error fetching courses:', error));
  }, []);

  const handleRegister = async (courseId, teacherId) => {
    // Fetch the current studentId dynamically from localStorage
    const studentId = localStorage.getItem('userID');

    if (!studentId) {
      alert('Student ID not found. Please log in again.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8081/api/courses/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: parseInt(studentId, 10), // Fetch dynamically at the time of request
          courseId: courseId,
          teacherId: teacherId,
        }),
      });

     const result = await response.text();

    if (response.ok) {
      console.log('inside 200');
      alert(result); // "Registered successfully" or other success message
      handleClose(); // Close modal after successful registration
    } else {
      // Handle validation errors from the backend
      alert(`Failed to register: ${result}`);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An unexpected error occurred while registering!');
  }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Available Courses</DialogTitle>
      <DialogContent>
        <List>
          {allCourses.map((course) =>
            course.teachers.map((teacher) => (
              <ListItem key={`${course.id}-${teacher.id}`} button>
                <ListItemText
                  primary={course.courseName}
                  secondary={`Description: ${course.courseDesc}, Teacher: ${teacher.firstName} ${teacher.lastName}`}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleRegister(course.id, teacher.id)}
                >
                  Register
                </Button>
              </ListItem>
            ))
          )}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CourseModal;
