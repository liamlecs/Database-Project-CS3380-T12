import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import bgImage from "../assets/library-bg.png";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Error: Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPassword }),
        }
      );
      const result = await response.json();

      if (!response.ok) {
        setMessage(`Error: ${result.message || "Reset failed."}`);
      } else {
        setMessage("Password reset successful! You can now log in.");
      }
    } catch (err) {
      setMessage("Error: Unable to reset password. Please try again later.");
    }
  };

  return (
    <Box
      sx={{
        pt: 8, // padding top offset if you have a fixed Navbar
        minHeight: "100vh",
        marginTop: "80px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
        // Semi-transparent white overlay
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.3)",
        },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 400,
          mx: 2,
          position: "relative", // Keep Paper above the overlay
          backgroundColor: "rgba(255, 255, 255, 0.95)",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ textAlign: "center", width: "100%" }}
        >
          Reset Password
        </Typography>

        <form onSubmit={handleResetPassword}>
          <TextField
            fullWidth
            label="New Password"
            variant="outlined"
            margin="normal"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <TextField
            fullWidth
            label="Confirm New Password"
            variant="outlined"
            margin="normal"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ mt: 3, mb: 2 }}
          >
            RESET PASSWORD
          </Button>
        </form>

        {message && (
          <Typography
            sx={{
              mt: 2,
              color: message.startsWith("Error") ? "error.main" : "success.main",
              textAlign: "center", // Center the message text
            }}
          >
            {message}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
