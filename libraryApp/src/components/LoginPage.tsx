import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css"; // CSS import
import bgImage from "../assets/library-bg.png";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button as MUIButton,
} from "@mui/material"; // Import MUI components

export default function SingleLoginPage() {
  const [loginMode, setLoginMode] = useState<"customer" | "employee">(
    "customer"
  ); // NEW: Toggle for login mode
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState(""); // NEW: Username for employee login
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  // NEW: State to control the "Forgot Password" dialog
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      // const endpoint =
      //   loginMode === "customer"
      //     ? `${import.meta.env.VITE_API_BASE_URL}/api/auth/customer-login`
      //     : `${import.meta.env.VITE_API_BASE_URL}/api/auth/employee-login`;

      // 1) Always hit the single /login endpoint
      const endpoint = `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`;

      // const body =
      //   loginMode === "customer"
      //     ? { email: email, password: password }
      //     : { username: username, password: password };

      // 2) Build a unified body
      const body: any = {
        mode: loginMode,          // "customer" or "employee"
        password: password
      };
      if (loginMode === "customer") {
        body.email = email;
      } else {
        body.username = username;
      }

      // 3) Fire your request
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message || "Login failed"}`);
        return;
      }

      const result = await response.json();
      setMessage(result.message || "Login successful!");
      console.log("Login result:", result);

      if (loginMode === "customer") {
        // Save customer login state
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userId", result.userId.toString());
        localStorage.setItem("userType", "customer");
        localStorage.setItem("firstName", result.firstName);
        localStorage.setItem("lastName", result.lastName);
        localStorage.setItem("email", result.email);
        localStorage.setItem(
          "borrowerTypeId",
          result.borrowerTypeId.toString()
        );
        window.location.href = "/userprofile";
      } else {
        // Save employee login state
        localStorage.setItem("employeeId", result.employeeID.toString());
        localStorage.setItem("isEmployeeLoggedIn", "true");
        localStorage.setItem("employeeFirstName", result.firstName);
        localStorage.setItem("employeeLastName", result.lastName);
        localStorage.setItem("username", result.username);
        window.location.href = "/employee";
      }
    } catch (err: any) {
      console.error(err);
      setMessage(
        "An error occurred while logging in. Please check your credentials and try again."
      );
    }
  }

  // NEW: Handle forgot password submission
  async function handleForgotPasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotEmail }),
        }
      );
      const result = await response.json();
      if (!response.ok) {
        setForgotMessage(`Error: ${result.message || "Request failed"}`);
      } else {
        setForgotMessage(
          "If you have an account with us, a reset link has been sent to your email."
        );
      }
    } catch (err: any) {
      setForgotMessage("An error occurred. Please try again later.");
    }
  }

  return (
    <div
      className="login-bg"
      style={{
        marginTop: "80px",
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
        <h2 className="text-center mb-4">
          {loginMode === "customer" ? "Customer Log In" : "Employee Log In"}
        </h2>

        {/* Add this section for customer registration link */}
        {loginMode === "customer" && (
          <p className="text-center text-sm mb-4">
            Don’t have a member account?{" "}
            <a href="/RegistrationPage" className="text-blue-600">
              Create an account
            </a>
          </p>
        )}

        {loginMode === "employee" && (
          <p className="text-center text-sm mb-4">
            Contact your organization's administrator for login credentials.
          </p>
        )}

        <div className="text-center mb-4">
          <button
            className={`btn ${
              loginMode === "customer" ? "btn-primary" : "btn-secondary"
            } mx-1`}
            onClick={() => setLoginMode("customer")}
          >
            Customer
          </button>
          <button
            className={`btn ${
              loginMode === "employee" ? "btn-primary" : "btn-secondary"
            } mx-1`}
            onClick={() => setLoginMode("employee")}
          >
            Employee
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {loginMode === "customer" ? (
            // Email Field for Customer
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
          ) : (
            // Username Field for Employee
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
          )}

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

          {/* Show Password Checkbox */}
          <div className="d-flex align-items-center justify-content-center mb-4">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              style={{ marginRight: "0.5rem" }}
            />
            <label htmlFor="showPassword" style={{ margin: 0 }}>
              Show Password
            </label>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>

          {/* Add spacing and then the Forgot Password button */}
          {loginMode === "customer" && (
            <div className="text-center mt-4">
              <MUIButton
                variant="text"
                onClick={() => {
                  setForgotPasswordOpen(true);
                  setForgotMessage("");
                }}
              >
                Forgot Your Password?
              </MUIButton>
            </div>
          )}
        </form>

        {message && (
          <div className="mt-3 alert alert-info text-center">{message}</div>
        )}
      </div>

      {/* MUI Dialog for Forgot Password */}
      <Dialog
        open={forgotPasswordOpen}
        onClose={() => {
          setForgotPasswordOpen(false);
          setForgotMessage("");
        }}
      >
        <DialogTitle>Reset Password</DialogTitle>
        <form onSubmit={handleForgotPasswordSubmit}>
          <DialogContent>
            <TextField
              label="Enter your email"
              type="email"
              fullWidth
              margin="dense"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
            />
            {forgotMessage && (
              <div style={{ marginTop: "10px" }}>{forgotMessage}</div>
            )}
          </DialogContent>
          <DialogActions>
            <MUIButton
              onClick={() => {
                setForgotPasswordOpen(false);
                setForgotMessage("");
              }}
            >
              Cancel
            </MUIButton>
            <MUIButton type="submit" variant="contained">
              Submit
            </MUIButton>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
