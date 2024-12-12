import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  RadioGroup,
  Radio,
} from '@mui/material';
import axios from 'axios';

const AssignTeachersModal = ({ open, onClose, course, staff }) => {
  // const [teachers, setTeachers] = useState(staff);
  // const [selectedTeachers, setSelectedTeachers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);

  // Fetch Teachers
  // useEffect(() => {
  //   const fetchTeachers = async () => {
  //     try {
  //       const response = await axios.get('/api/users'); // Replace with your GET API for users
  //       const teacherData = response.data.filter((user) => user.userRole === 'teacher');
  //       setTeachers(teacherData);
  //     } catch (error) {
  //       console.error('Error fetching teachers:', error);
  //     }
  //   };

  //   fetchTeachers();
  // }, []);
console.log('teachers',staff);
  // Reset selected teachers when course changes
  useEffect(() => {
    if (course) {
      setSelectedTeacherId(null); // Reset selected teachers when a new course is selected
    }
  }, [course]);

  // Handle Selection
  // const handleTeacherSelection = (teacherId) => {
  //   // setSelectedTeachers((prev) =>
  //   //   prev.includes(teacherId) ? prev.filter((id) => id !== teacherId) : [...prev, teacherId]
  //   // );
  //   setSelectedTeachers(teacherId);
  // };

  // Handle Submit
  const handleSubmit = async () => {
    console.log(selectedTeacherId);
    console.log(course.id, "courseID");
    // setLoading(true);
    try {
      const payload = { teacherId: selectedTeacherId, courseId: course.id };
      const response = await axios.post('http://127.0.0.1:8081/api/course-teacher/assign', payload); // Replace with your POST API
      console.log("asssign", response)
      alert('Teacher assigned successfully!');
      onClose();
    } catch (error) {
      console.error('Error assigning teacher:', error);
      alert('Failed to assign teacher.');
    } 
  }

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
       <RadioGroup
       value={selectedTeacherId}
       onChange={(e) => setSelectedTeacherId(Number(e.target.value))}
     >
       {staff?.map((teacher) => (
         <FormControlLabel
           key={teacher?.id}
           value={teacher?.id}
           control={<Radio />}
           label={`${teacher?.firstName} ${teacher?.lastName}`}
         />
       ))}
     </RadioGroup>
        <Box sx={{ textAlign: 'center', marginTop: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading || selectedTeacherId === null}
          >
            {loading ? <CircularProgress size={24} /> : 'Assign'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AssignTeachersModal;
