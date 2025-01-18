import { useState } from "react";
import { AuthContainer } from "../common/AuthContainer";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    // Gửi yêu cầu reset mật khẩu
    console.log("New Password:", newPassword);
    alert("Password has been reset successfully!");
  };

  return (
    <AuthContainer>
      <div className="card shadow-sm py-4">
        <div className="card-body p-4">
          <h5 className="mb-5 text-center">Reset Password</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="password"
                placeholder="New password"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Confirm password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-danger text-center">{error}</p>}
            <button type="submit" className="btn btn-primary w-100">
              Reset password
            </button>
          </form>
        </div>
      </div>
    </AuthContainer>
  );
}
