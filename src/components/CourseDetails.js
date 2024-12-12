import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const CourseDetails = ({ courseId, handleBack }) => {
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [people, setPeople] = useState([]);
  const [teacherId, setTeacherId] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const userId = localStorage.getItem('userID'); // Get student ID from local storage

  useEffect(() => {
    const fetchTeacherId = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8081/api/courses');
        const courses = await response.json();
        const selectedCourse = courses.find((course) => course.id === courseId);

        if (selectedCourse && selectedCourse.teachers.length > 0) {
          setTeacherId(selectedCourse.teachers[0].id); // Use the first teacher
        } else {
          console.error('No teachers found for this course.');
        }
      } catch (error) {
        console.error('Error fetching teacher ID:', error);
      }
    };

    if (!teacherId) {
      fetchTeacherId();
    }
  }, [courseId, teacherId]);

  useEffect(() => {
    if (!teacherId || !userId) return;

    fetch(
      `http://127.0.0.1:8081/api/assignments/course/${courseId}/teacher/${teacherId}/student/${userId}`
    )
      .then((response) => response.json())
      .then((data) => setAssignments(data))
      .catch((error) => console.error('Error fetching assignments:', error));

    fetch(`http://127.0.0.1:8081/api/courses/${courseId}/grades`)
      .then((response) => response.json())
      .then((data) => setGrades(data))
      .catch((error) => console.error('Error fetching grades:', error));

    fetch(`http://127.0.0.1:8081/api/courses/${courseId}/teacher/${teacherId}/students`)
      .then((response) => response.json())
      .then((data) => setPeople(data))
      .catch((error) => console.error('Error fetching people:', error));
  }, [courseId, teacherId, userId]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleViewDetails = (assignment) => {
    setSelectedAssignment(assignment);
  };

  const handleSubmitResponse = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8081/api/assignments/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentAssignmentId: selectedAssignment.id,
          submissionText: responseText,
        }),
      });

      if (response.ok) {
        alert('Assignment submitted successfully!');
        setSelectedAssignment(null);
        setResponseText('');
      } else {
        throw new Error('Failed to submit assignment');
      }
    } catch (error) {
      console.error('Error submitting assignment:', error);
    }
  };

  const today = new Date();
  const upcomingAssignments = assignments.filter(
    (assignment) => new Date(assignment.dueDate) >= today
  );
  const pastAssignments = assignments.filter(
    (assignment) => new Date(assignment.dueDate) < today
  );

  return (
    <Box>
      <Button variant="outlined" onClick={handleBack} sx={{ marginBottom: 2 }}>
        Back to Courses
      </Button>
      <Typography variant="h4" gutterBottom>
        Course Details
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ marginBottom: 2 }}>
        <Tab label="Assignments" />
        <Tab label="Grades" />
        <Tab label="People" />
      </Tabs>

      {activeTab === 0 && (
        <Box>
          {!selectedAssignment ? (
            <>
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">Upcoming Assignments</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {upcomingAssignments.length > 0 ? (
                    <List>
                      {upcomingAssignments.map((assignment) => (
                        <ListItem key={assignment.id}>
                          <ListItemText
                            primary={assignment.title}
                            secondary={`Due: ${new Date(
                              assignment.dueDate
                            ).toLocaleString()}`}
                          />
                          <Button
                            variant="contained"
                            onClick={() => handleViewDetails(assignment)}
                          >
                            View Details
                          </Button>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography>No upcoming assignments.</Typography>
                  )}
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">Past Assignments</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {pastAssignments.length > 0 ? (
                    <List>
                      {pastAssignments.map((assignment) => (
                        <ListItem key={assignment.id}>
                          <ListItemText
                            primary={assignment.title}
                            secondary={`Due: ${new Date(
                              assignment.dueDate
                            ).toLocaleString()}`}
                          />
                          <Button
                            variant="contained"
                            onClick={() => handleViewDetails(assignment)}
                          >
                            View Details
                          </Button>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography>No past assignments.</Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            </>
          ) : (
            <Box>
              <Button onClick={() => setSelectedAssignment(null)} sx={{ marginBottom: 2 }}>
                Back to Assignments
              </Button>
              <Typography variant="h4">{selectedAssignment.title}</Typography>
              <Typography variant="body1">{selectedAssignment.description}</Typography>
              <Typography variant="subtitle1">
                Due Date: {new Date(selectedAssignment.dueDate).toLocaleString()}
              </Typography>
              <Typography variant="h5" sx={{ marginTop: 3 }}>
                Questions
              </Typography>
              <List>
  {selectedAssignment?.questions && selectedAssignment.questions.length > 0 ? (
    selectedAssignment.questions.map((question, index) => (
      <ListItem key={index}>
        <ListItemText primary={question} />
      </ListItem>
    ))
  ) : (
    <Typography>No questions available for this assignment.</Typography>
  )}
</List>
              <Box sx={{ marginTop: 3 }}>
                <TextField
                  label="Your Response"
                  multiline
                  rows={4}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  fullWidth
                />
                <Button
                  variant="contained"
                  onClick={handleSubmitResponse}
                  sx={{ marginTop: 2 }}
                >
                  Submit Assignment
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      )}
      {activeTab === 1 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Grades
          </Typography>
          <List>
            {grades.map((grade) => (
              <ListItem key={grade.id}>
                <ListItemText
                  primary={`Assignment: ${grade.assignmentTitle}`}
                  secondary={`Grade: ${grade.grade}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
      {activeTab === 2 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            People
          </Typography>
          <List>
            {people.map((person) => (
              <ListItem key={person.id}>
                <ListItemText
                  primary={`${person.firstName} ${person.lastName}`}
                  secondary={`Email: ${person.email}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default CourseDetails;
