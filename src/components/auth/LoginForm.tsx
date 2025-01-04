"use client"

import { useState } from "react"
import { AuthContainer } from "../common/AuthContainer"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)
    // Add login logic here
    setIsLoading(false)
  }

  return (
    <AuthContainer>
      <div className="card shadow-sm py-4">
        <div className="card-body p-4">
          <button
            className="btn btn-outline-secondary w-100 mb-3 d-flex align-items-center justify-content-center gap-2 py-2"
            style={{ borderColor: "#d6d6d6" }}
            onClick={() => {/* Add Google login logic */}}
          >
            <img src={require('../../assests/icons/google.svg').default} alt="Google" width="20" height="20" />
            Log in with Google
          </button>

          <button
            className="btn btn-outline-secondary w-100 mb-3 d-flex align-items-center justify-content-center gap-2 py-2"
            style={{ borderColor: "#d6d6d6" }}
            onClick={() => {/* Add Email login logic */}}
          >
            <i className="fas fa-envelope" style={{ fontSize: "20px" }}></i>
            Log in with Email
          </button>

          <div className="position-relative my-5">
            <hr />
            <div className="position-absolute top-50 start-50 translate-middle px-3 bg-white">
              <small className="text-muted">OR</small>
            </div>
          </div>

          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                required
              />
            </div>

            <div className="text-end mb-5">
              <a href="/forgot-password" className="text-decoration-none">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <div className="text-center mt-4">
            <small className="text-muted">
              Don't have an account?{" "}
              <a href="/signup" className="text-decoration-none">
                Sign up
              </a>
            </small>
          </div>
        </div>
      </div>
    </AuthContainer>
  )
}