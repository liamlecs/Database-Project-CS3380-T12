import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import "../UserProfile.css";

interface Profile {
  password: string;
}

export default function ChangePassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [oldPassword, setOldPassword] = useState("");
  const [password, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // 🔁 Redirect to /userprofile if the page is refreshed
  useEffect(() => {
    if (!location.state?.fromSettings) {
      navigate("/userprofile");
    }
  }, [navigate]);

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMsg("New password and confirmation do not match.");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found.");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/UserProfile/customer/${userId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 401) {
        setErrorMsg("Old password is incorrect.");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to validate old password. Please try again.");
      }

      const data: { password: string } = await response.json();
      if (oldPassword !== data.password) {
        setErrorMsg("Old Password is not correct.");
        return;
      }

      const updateResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/UserProfile/customer/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      if (!updateResponse.ok) {
        throw new Error("Failed to change password. Please try again.");
      }

      alert("Password changed successfully!");
      navigate("/userprofile");
    } catch (error: any) {
      setErrorMsg(error.message || "An error occurred.");
    }
  };

  return (
    <div className="change-password">
      <h3>Change Password</h3>
      <form onSubmit={handlePasswordChange}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Old Password"
            variant="outlined"
            type="text"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="New Password"
            variant="outlined"
            type="text"
            value={password}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Confirm New Password"
            variant="outlined"
            type="text"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            required
          />
          {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
          <Button type="submit" variant="contained" color="primary">
            Change Password
          </Button>
        </Box>
      </form>
    </div>
  );
}
