import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, Grid, CircularProgress, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProfileMenu from './ProfileMenu'; 
import OnboardTeacherModal from './OnboardTeacherModal'; 
import AssignTeachersModal from './AssignTeacherModal';
import AddCourseModal from './AddCourseModal';

const AdminDashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [AssignModal,setAssignModal] = useState(false)

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
  const [courses, setCourses] = useState([
    {
      "id": 101,
      "coursename": "Introduction to Computer Science",
      "courseDesc": "Learn the basics of computer science, including algorithms and programming concepts.",
      "semester": "Fall 2024",
      "teachers": [
        { "id": 1, "firstname": "John", "lastname": "Doe" },
        { "id": 2, "firstname": "Jane", "lastname": "Smith" }
      ]
    },
    {
      "id": 102,
      "coursename": "Advanced Mathematics",
      "courseDesc": "Explore advanced topics in calculus, algebra, and geometry.",
      "semester": "Spring 2025",
      "teachers": []
    },
    {
      "id": 103,
      "coursename": "Physics for Engineers",
      "courseDesc": "A deep dive into classical mechanics and electromagnetism.",
      "semester": "Fall 2024",
      "teachers": [
        { "id": 3, "firstname": "Albert", "lastname": "Einstein" }
      ]
    }
  ]
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [view, setView] = useState('staff'); // 'staff' or 'courses'
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [addCourseModalOpen, setAddCourseModalOpen] = useState(false);



  const navigate = useNavigate();

  // Fetch Teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const response = await axios.get('/api/teachers');
        const filteredTeachers = response.data.filter(user => user.userRole === 'teacher');
        setTeachers(filteredTeachers);
      } catch (error) {
        setErrorMessage('Failed to load teacher data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  // Fetch Courses
  const fetchCourses = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await axios.get('/api/courses');
      setCourses(response.data);
    } catch (error) {
      setErrorMessage('Failed to load course data.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle View Change
  const handleViewChange = (newView) => {
    setView(newView);
    if (newView === 'courses') {
      fetchCourses();
    }
  };

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);
  const handleAssignModalOpen = (course) => {
    setSelectedCourse(course)
    setAssignModal(true)
}
  const handleAssignModalClose = () => setAssignModal(false);
  const handleAddCourseModalOpen = () => setAddCourseModalOpen(true);
  const handleAddCourseModalClose = () => setAddCourseModalOpen(false);

  return (
    <Box sx={{ position: 'relative', padding: 3 }}>
      {/* Profile Menu */}
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <ProfileMenu />
      </Box>

      <Typography variant="h4" sx={{ marginBottom: 3 }}>
        Admin Dashboard
      </Typography>

      {/* Buttons for View Switching */}
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 3 }}>
        <Button
          variant="contained"
          color={view === 'staff' ? 'primary' : 'default'}
          onClick={() => handleViewChange('staff')}
        >
          Staff
        </Button>
        <Button
          variant="contained"
          color={view === 'courses' ? 'primary' : 'default'}
          onClick={() => handleViewChange('courses')}
        >
          Courses
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleModalOpen}
        //   sx={{ marginLeft: 'auto' }}
        >
          Onboard Teacher
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleAddCourseModalOpen}
        >
          Add Course
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

          {/* Staff View */}
          {view === 'staff' && (
            <Grid container spacing={2}>
              {teachers.map((teacher) => (
                <Grid item xs={12} sm={6} md={4} key={teacher.id}>
                  <Card sx={{ maxWidth: 345 }}>
                    <CardContent>
                      <Avatar sx={{ width: 56, height: 56, marginBottom: 2, backgroundColor: '#3f51b5' }}>
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

          {/* Courses View */}
          {view === 'courses' && (
            <Grid container spacing={2}>
              {courses.map((course) => (
                <Grid item xs={12} sm={6} md={4} key={course.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{course.coursename}</Typography>
                      <Typography variant="body2" color="textSecondary">{course.courseDesc}</Typography>
                      <Typography variant="body2" color="textSecondary">Semester: {course.semester}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Teachers: {course.teachers.length > 0 ? course.teachers.join(', ') : 'None'}
                      </Typography>
                      <Button variant="contained" color="primary" sx={{ marginTop: 2 }}
                      onClick={()=>handleAssignModalOpen(course)}
                      >
                        Assign Teachers
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {/* Onboard Teacher Modal */}
      <OnboardTeacherModal open={modalOpen} onClose={handleModalClose} />
      <AssignTeachersModal open={AssignModal} onClose={handleAssignModalClose} course={selectedCourse}/>
      <AddCourseModal open={addCourseModalOpen} onClose={handleAddCourseModalClose} />
    </Box>
  );
};

export default AdminDashboard;
