import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // For error feedback
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate inputs
    if (!email || !password) {
      setError("Both email and password are required.");
      return;
    }

    axios
      .post("http://localhost:3001/login", { email, password })
      .then((result) => {
        if (result.data === "success") {
          // Store session token in sessionStorage
          sessionStorage.setItem("sessionToken", "your-session-token"); // Replace with actual token if needed

          // Navigate to /home page
          navigate("/home");
        }
      })
      .catch((err) => {
        setError("Invalid credentials, please try again.");
        console.log(err);
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Login</h2>
        {error && <p className="text-danger">{error}</p>} {/* Error message */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              autoComplete="on"
              name="email"
              className="form-control rounded-0"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              autoComplete="on"
              name="password"
              className="form-control rounded-0"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0">
            Login
          </button>
        </form>
        <p>Don't Have an Account?</p>
        <Link
          to="/register"
          className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none"
        >
          Signup
        </Link>
      </div>
    </div>
  );
}

export default Login;
