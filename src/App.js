import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';      // Import your LoginPage component
import SignInPage from './components/SignInPage';    // Import your SignInPage component
import AdminDashboard from './components/AdminDashboard';  // Assuming you have a DashboardPage component
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import EditProfile from './components/EditProfile';
// import { useEffect } from 'react'; 
// import { useNavigate } from 'react-router-dom';

const App = () => {

  
  return (
    <Router>
      <Routes>
        {/* Route for LoginPage */}
        <Route path="/" element={<LoginPage />} />

        {/* Route for SignInPage (Sign-Up Page) */}
        <Route path="/sign-up" element={<SignInPage />} />

        {/* Route for DashboardPage */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/edit-profile" element={<EditProfile />} />

        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;
