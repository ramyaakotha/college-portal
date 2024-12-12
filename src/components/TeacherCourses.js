import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, CardActions, Button, Typography } from '@mui/material';
import TeacherCourseDetails from './TeacherCourseDetails'; // For course assignments and grades

const TeacherCourses = () => {
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Fetch the current teacherId dynamically from localStorage
  const teacherId = localStorage.getItem('userID');

  useEffect(() => {
    if (!teacherId) {
      alert('Teacher ID not found. Please log in again.');
      return;
    }

    // Construct the API endpoint dynamically with the teacherId
    const apiUrl = `http://127.0.0.1:8081/api/courses/teacher/${teacherId}/assigned`;

    // Fetch assigned courses
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch assigned courses: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('API Response:', data); // Debug: Log the API response
        setAssignedCourses(data);
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
        alert('Failed to fetch assigned courses.');
      });
  }, [teacherId]); // Dependency array includes teacherId to refetch if it changes

  const handleViewDetails = (courseId) => setSelectedCourse(courseId);
  const handleBackToCourses = () => setSelectedCourse(null);

  return (
    <Box>
      {selectedCourse ? (
        <TeacherCourseDetails courseId={selectedCourse} handleBack={handleBackToCourses} />
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            Your Assigned Courses
          </Typography>

          {/* Display Assigned Courses */}
          <Grid container spacing={2}>
            {assignedCourses.length > 0 ? (
              assignedCourses.map((course) => (
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
              <Typography variant="body1">No courses assigned yet.</Typography>
            )}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default TeacherCourses;
