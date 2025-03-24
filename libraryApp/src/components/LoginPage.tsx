import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css"; // CSS import
import bgImage from "../assets/library-bg.jpg";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        setMessage(`Error: ${errorText}`);
      } else {
        const successText = await response.text();
        setMessage(successText);
      }

      const result = await response.json();
      setMessage(result.message || "Login successful!");

      // check if the user is an employee and redirect
      if (result.isEmployee) {
        // store employee authentication data
        localStorage.setItem('isEmployee', 'true');
        localStorage.setItem('employeeData', JSON.stringify(result));
        
        // redirect to employee homepage
        navigate('/employee');
      } else {
        // regular customer redirect
        navigate('/customer-dashboard');
      }

    } catch (err: any) {
      console.error(err);
      setMessage("An error occurred while logging in.");
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
        <h2 className="text-center mb-4">Log In</h2>

        <p className="text-center text-sm mb-4">
          Don’t have a member account?{" "}
          <a href="/RegistrationPage" className="text-blue-600">
            Create an account
          </a>
        </p>

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-3">
            <input
              type="email"
              placeholder="Email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
