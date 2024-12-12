import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, CardActions, Button, Typography } from '@mui/material';
import CourseModal from './CourseModal'; // Modal to show all courses
import CourseDetails from './CourseDetails'; // Component for course assignments and grades

const StudentCourses = () => {
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Fetch the current studentId dynamically from localStorage
  const studentId = localStorage.getItem('userID');

  useEffect(() => {
    if (!studentId) {
      alert('Student ID not found. Please log in again.');
      return;
    }

    // Construct the API endpoint dynamically with the studentId
    const apiUrl = `http://127.0.0.1:8081/api/courses/student/${studentId}/registered`;

    // Fetch registered courses
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch registered courses.');
        }
        return response.json();
      })
      .then((data) => setRegisteredCourses(data))
      .catch((error) => console.error('Error fetching courses:', error));
  }, [studentId]); // Dependency array includes studentId to refetch if it changes

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleViewDetails = (courseId) => setSelectedCourse(courseId);
  const handleBackToCourses = () => setSelectedCourse(null);

  return (
    <Box>
      {selectedCourse ? (
        <CourseDetails courseId={selectedCourse} handleBack={handleBackToCourses} />
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            Your Registered Courses
          </Typography>

          {/* Registered Courses */}
          <Grid container spacing={2}>
            {registeredCourses.length > 0 ? (
              registeredCourses.map((course) => (
                <Grid item xs={12} sm={6} md={4} key={course.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{course.courseName}</Typography>
                      <Typography variant="body2">{course.courseDesc}</Typography>
                      <Typography variant="subtitle2">{course.semester}</Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleViewDetails(course.id)}
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography variant="body1">No courses registered yet.</Typography>
            )}
          </Grid>

          {/* Register More Courses */}
          <Box sx={{ marginTop: 4 }}>
            <Button variant="outlined" onClick={handleOpenModal}>
              Register More Courses
            </Button>
          </Box>

          {/* Modal for Registering Courses */}
          <CourseModal open={modalOpen} handleClose={handleCloseModal} studentId={studentId} />
        </>
      )}
    </Box>
  );
};

export default StudentCourses;
