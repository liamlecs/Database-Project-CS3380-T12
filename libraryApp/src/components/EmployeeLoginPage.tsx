import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css"; // CSS import
import bgImage from "../assets/library-bg.jpg";

export default function EmployeeLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/employee-login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        }
      );

      if (!response.ok) {
        // If server is returning JSON even for errors:
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message || "Login failed"}`);
        return;
      }

      const result = await response.json();
      setMessage(result.message || "Login successful!");

      localStorage.setItem("employeeId", result.employeeID.toString());

      // Get the EmployeeID from the Employee and send it to the Employee.tsx
      navigate("/Employee", {
        state: {
          employeeID: result.employeeID,
        },
      });

    } catch (err: any) {
      console.error(err);
      setMessage("An error occurred while logging in. Please check your credentials and try again.");
    }
  }

  return (
    <div
      className="login-bg"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="login-card">
        <h1 className="text-center mb-2">E-Library</h1>
        <h2 className="text-center mb-4">Employee Log In</h2>

        <p className="text-center text-sm mb-4">
          Contact your organization's administrator for login credentials.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="mb-3">
            <input
              type="text"
              placeholder="Username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-3">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-2 justify-start mb-4">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              className="cursor-pointer"
            />
            <label htmlFor="showPassword" className="cursor-pointer text-sm">
              Show Password
            </label>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>

        {message && (
          <div className="mt-3 alert alert-info">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
