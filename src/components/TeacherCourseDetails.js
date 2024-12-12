import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Button,
  Modal,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const TeacherCourseDetails = ({ courseId, handleBack }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [createAssignmentOpen, setCreateAssignmentOpen] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [newQuestion, setNewQuestion] = useState("");
  const [assignmentDetails, setAssignmentDetails] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const teacherId = localStorage.getItem("userID");

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpenCreateAssignment = () => {
    setCreateAssignmentOpen(true);
  };

  const handleCloseCreateAssignment = () => {
    setCreateAssignmentOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAssignmentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleCreateAssignment = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8081/api/assignments/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...assignmentDetails,
            courseId,
            teacherId: parseInt(teacherId, 10),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create assignment");
      }

      const result = await response.text();
      alert(result);
      setCreateAssignmentOpen(false);
      fetchAssignments(); // Refresh assignments after creation
    } catch (error) {
      console.error("Error creating assignment:", error);
      alert("Failed to create assignment.");
    }
  };

  const fetchAssignments = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8081/api/assignments/course/${courseId}/teacher/${teacherId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch assignments");
      }
      const data = await response.json();
      setAssignments(data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      alert("Failed to fetch assignments.");
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8081/api/courses/${courseId}/teacher/${teacherId}/students`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
      alert("Failed to fetch students.");
    }
  };

  const handleViewAssignmentDetails = (assignment) => {
    setSelectedAssignment(assignment);
  };

  const handleBackToAssignments = () => {
    setSelectedAssignment(null);
  };

  const handleAddQuestion = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8081/api/assignments/${selectedAssignment.id}/add-question`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questionText: newQuestion }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add question");
      }

      const result = await response.text();
      alert(result);
      setNewQuestion("");
      fetchAssignments(); // Refresh the assignment questions
    } catch (error) {
      console.error("Error adding question:", error);
      alert("Failed to add question.");
    }
  };

  const handleAssignAssignment = async () => {
    try {
      // Extract student IDs
      const studentIds = students.map((student) => student.id);

      if (studentIds.length === 0) {
        alert("No students to assign the assignment.");
        return;
      }

      // Send the student IDs to the backend
      const response = await fetch(
        `http://127.0.0.1:8081/api/assignments/${selectedAssignment.id}/assign-students`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(studentIds),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to assign the assignment.");
      }

      const result = await response.text();
      alert(result); // Notify the user
    } catch (error) {
      console.error("Error assigning assignment:", error);
      alert("Failed to assign the assignment.");
    }
  };

  useEffect(() => {
    fetchAssignments();
    fetchStudents();
  }, [courseId, teacherId]);

  const today = new Date();

  const upcomingAssignments = assignments.filter(
    (assignment) => new Date(assignment.dueDate) >= today
  );
  const pastAssignments = assignments.filter(
    (assignment) => new Date(assignment.dueDate) < today
  );

  return (
    <Box>
      {selectedAssignment ? (
        <Box>
          <Button variant="outlined" onClick={handleBackToAssignments} sx={{ marginBottom: 2 }}>
            Back to Assignments
          </Button>
          <Typography variant="h4" gutterBottom>
            {selectedAssignment.title}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {selectedAssignment.description}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Due Date: {new Date(selectedAssignment.dueDate).toLocaleString()}
          </Typography>

          <Typography variant="h5" gutterBottom>
            Questions
          </Typography>
          {selectedAssignment.questions.length > 0 ? (
            <List>
              {selectedAssignment.questions.map((question, index) => (
                <ListItem key={index}>
                  <ListItemText primary={question} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No questions added yet.</Typography>
          )}

          <Box sx={{ marginTop: 4 }}>
            <TextField
              label="Add New Question"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              fullWidth
            />
            <Button variant="contained" onClick={handleAddQuestion} sx={{ marginTop: 2 }}>
              Add Question
            </Button>
          </Box>

          <Box sx={{ marginTop: 4 }}>
            <Button variant="contained" color="secondary" onClick={handleAssignAssignment}>
              Assign Assignment
            </Button>
          </Box>
        </Box>
      ) : (
        <>
          <Button variant="outlined" onClick={handleBack} sx={{ marginBottom: 2 }}>
            Back to Courses
          </Button>
          <Typography variant="h4" gutterBottom>
            Course Details
          </Typography>

          <Tabs value={activeTab} onChange={handleTabChange} aria-label="teacher course details tabs">
            <Tab label="Assignments" />
            <Tab label="Grades" />
            <Tab label="Students" />
          </Tabs>

          {activeTab === 0 && (
            <Box sx={{ marginTop: 2 }}>
              <Button
                variant="contained"
                sx={{ marginBottom: 2 }}
                onClick={handleOpenCreateAssignment}
              >
                Create Assignment
              </Button>

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
                            secondary={`Due: ${new Date(assignment.dueDate).toLocaleString()}`}
                          />
                          <Button
                            variant="outlined"
                            onClick={() => handleViewAssignmentDetails(assignment)}
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
                            secondary={`Due: ${new Date(assignment.dueDate).toLocaleString()}`}
                          />
                          <Button
                            variant="outlined"
                            onClick={() => handleViewAssignmentDetails(assignment)}
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
            </Box>
          )}

          {activeTab === 1 && (
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="h5">Grades</Typography>
              <Typography>No grades available yet.</Typography>
            </Box>
          )}

          {activeTab === 2 && (
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="h5">Students</Typography>
              {students.length > 0 ? (
                <List>
                  {students.map((student) => (
                    <ListItem key={student.id}>
                      <ListItemText
                        primary={`${student.firstName} ${student.lastName}`}
                        secondary={`Email: ${student.email}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>No students enrolled yet.</Typography>
              )}
            </Box>
          )}

          <Modal
            open={createAssignmentOpen}
            onClose={handleCloseCreateAssignment}
            aria-labelledby="create-assignment-modal"
            aria-describedby="modal-for-creating-assignment"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "background.paper",
                p: 4,
                borderRadius: 2,
                boxShadow: 24,
                width: 400,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Create Assignment
              </Typography>
              <TextField
                label="Title"
                name="title"
                value={assignmentDetails.title}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                name="description"
                value={assignmentDetails.description}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Due Date"
                name="dueDate"
                type="datetime-local"
                value={assignmentDetails.dueDate}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                <Button variant="outlined" onClick={handleCloseCreateAssignment}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleCreateAssignment}>
                  Create
                </Button>
              </Box>
            </Box>
          </Modal>
        </>
      )}
    </Box>
  );
};

export default TeacherCourseDetails;
