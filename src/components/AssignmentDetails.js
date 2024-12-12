import React, { useState, useEffect } from "react";
import { Box, Typography, List, ListItem, TextField, Button } from "@mui/material";

const AssignmentDetails = ({ assignment, courseId, teacherId, handleBack }) => {
  const [newQuestion, setNewQuestion] = useState("");
  const [students, setStudents] = useState([]);

  // Fetch students registered for the course and teacher
  const fetchStudents = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8081/api/courses/${courseId}/teacher/${teacherId}/students`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch students.");
      }
      const data = await response.json();
      setStudents(data); // Save the list of students
    } catch (error) {
      console.error("Error fetching students:", error);
      alert("Failed to fetch students.");
    }
  };

  // Fetch students when component mounts
  useEffect(() => {
    fetchStudents();
  }, [courseId, teacherId]);

  // Handle adding a question to the assignment
  const handleAddQuestion = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8081/api/assignments/${assignment.id}/add-question`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questionText: newQuestion }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add question.");
      }

      const result = await response.text();
      alert(result);
      setNewQuestion("");
    } catch (error) {
      console.error("Error adding question:", error);
      alert("Failed to add question.");
    }
  };

  // Handle assigning the assignment to students
  const handleAssignAssignment = async () => {
    try {
      const studentIds = students.map((student) => student.id);

      if (studentIds.length === 0) {
        alert("No students to assign the assignment.");
        return;
      }

      const response = await fetch(
        `http://127.0.0.1:8081/api/assignments/${assignment.id}/assign-students`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(studentIds),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to assign assignment.");
      }

      const result = await response.text();
      alert(result);
    } catch (error) {
      console.error("Error assigning assignment:", error);
      alert("Failed to assign assignment.");
    }
  };

  return (
    <Box>
      <Button variant="outlined" onClick={handleBack} sx={{ marginBottom: 2 }}>
        Back to Assignments
      </Button>
      <Typography variant="h4" gutterBottom>
        {assignment.title}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {assignment.description}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Due Date: {new Date(assignment.dueDate).toLocaleString()}
      </Typography>

      <Typography variant="h5" gutterBottom>
        Questions
      </Typography>
      {assignment.questions.length > 0 ? (
        <List>
          {assignment.questions.map((question, index) => (
            <ListItem key={index}>{question}</ListItem>
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
        <Button
          variant="contained"
          onClick={handleAddQuestion}
          sx={{ marginTop: 2 }}
        >
          Add Question
        </Button>
      </Box>

      <Box sx={{ marginTop: 4 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleAssignAssignment} // Assign assignment functionality
        >
          Assign Assignment
        </Button>
      </Box>
    </Box>
  );
};

export default AssignmentDetails;
