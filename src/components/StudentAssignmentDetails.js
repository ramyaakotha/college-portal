import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

const StudentAssignmentDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { assignment } = location.state || {};

  console.log('Assignment received:', assignment); 

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (assignment) {
      console.log('Fetching questions for assignment:', assignment.id); 
      fetch(`http://127.0.0.1:8081/api/assignments/${assignment.id}/questions`)
        .then((response) => response.json())
        .then((data) => {
          console.log('Questions fetched:', data);
          setQuestions(data);
        })
        .catch((error) => console.error('Error fetching questions:', error));
    }
  }, [assignment]);

  if (!assignment) {
    return (
      <Box>
        <Typography variant="h6">No assignment details available.</Typography>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </Box>
    );
  }

  return (
    <Box>
      <Button onClick={() => navigate(-1)} sx={{ marginBottom: 2 }}>
        Back to Assignments
      </Button>
      <Typography variant="h4">{assignment.title}</Typography>
      <Typography variant="body1">{assignment.description}</Typography>
      <Typography variant="subtitle1">
        Due Date: {new Date(assignment.dueDate).toLocaleString()}
      </Typography>
      <Typography variant="h5" gutterBottom>
        Questions
      </Typography>
      {questions.length > 0 ? (
        <ul>
          {questions.map((question, index) => (
            <li key={index}>{question}</li>
          ))}
        </ul>
      ) : (
        <Typography>No questions available.</Typography>
      )}
    </Box>
  );
};

export default StudentAssignmentDetails;
