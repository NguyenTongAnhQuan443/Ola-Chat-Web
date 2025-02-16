import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import LoginPage from "./components/auth/LoginForm";
import SignUpPage from "./components/auth/SignUp";
import ResetPassword from "./components/auth/ResetPassword";
import ForgotPassword from "./components/auth/ForgotPassword";
import VerifyOTP from "./components/auth/VerifyOTP";
import CheckInbox from "./components/auth/CheckInbox";
import LoginEmail from "./components/auth/LoginEmail";
import Layout from "./pages/DashboardPage";
import Home from "./pages/HomePage";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";

const isAuthenticated = () => {
  return sessionStorage.getItem('userId') !== null;
};

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/check-inbox" element={<CheckInbox />} />
          <Route path="/login-email" element={<LoginEmail />} />

          {/* Layout chung (Header + Sidebar giữ nguyên) */}
          <Route path="/" element={isAuthenticated() ? <Layout /> : <Navigate to="/login" />}>
            <Route index element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="messages" element={<Messages />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
