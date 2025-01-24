import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import LoginPage from './components/auth/LoginForm';
import SignUpPage from './components/auth/SignUp';
import ResetPassword from './components/auth/ResetPassword';
import ForgotPassword from './components/auth/ForgotPassword';
import VerifyOTP from './components/auth/VerifyOTP';
import CheckInbox from './components/auth/CheckInbox';
import LoginEmail from './components/auth/LoginEmail';
import ChatPage from './pages/Chat';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/check-inbox" element={<CheckInbox />} />
          <Route path="/login-email" element={<LoginEmail />} />
          <Route path='/chat' element={<ChatPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
