import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContainer } from "../common/AuthContainer";

export default function ForgotPassword() {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate("/");
      };
    

  const handleSubmit = () => {
    alert(`Submitted code: `);
  };

  return (
    <AuthContainer showBackButton={true} onBackClick={handleBackClick}>
      <div className="card shadow-sm py-4">
        <div className="card-body p-4">
          <h5 className="text-center mb-3">Forgot password</h5>
          <p className="text-center text-muted mb-5">
            Enter your email to reset your password and access your account.
          </p>
          <div className="mb-4">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              required
            />
          </div>
          <button className="btn btn-primary w-100" onClick={handleSubmit}>
            Send reset link
          </button>
        </div>
      </div>
    </AuthContainer>
  );
}
