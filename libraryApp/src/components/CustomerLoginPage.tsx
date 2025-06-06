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

export default function LoginPage() {
  const [email, setEmail] = useState("");
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
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/customer-login`,
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
        // If server is returning JSON even for errors:
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message || "Login failed"}`);
        return;
      } 
      
      const result = await response.json();
      setMessage(result.message || "Login successful!");
      console.log("Login result:", result);


      // Save login state to localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userId", result.userId.toString());
      localStorage.setItem("userType", "customer"); // optional
      localStorage.setItem("firstName", result.firstName);
      localStorage.setItem("lastName", result.lastName);
      localStorage.setItem("email", result.email);
      localStorage.setItem("borrowerTypeId", result.borrowerTypeId.toString());


      // //Get the userID from the customer and send it to the UserProfile.tsx
      // navigate("/UserProfile", {
      //   state: {
      //     userId: result.userId,
      //     //userType: result.isEmployee ? "employee" : "customer",
      //   },
      // });
      window.location.href = "/userprofile";
      
    } catch (err: any) {
      console.error(err);
      setMessage("An error occurred while logging in. Please check your credentials and try again.");
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
          setForgotMessage("If you have an account with us, a reset link has been sent to your email.");
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
          <h2 className="text-center mb-4">Customer Log In</h2>
  
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
