import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import bgImage from "../assets/library-bg.png";

interface ConfirmEmailProps {
  // optional props if needed
}

export default function ConfirmEmail({}: ConfirmEmailProps) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/customer/confirm`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, confirmationCode: code }),
            }
          );
          
      if (!response.ok) {
        const errorText = await response.text();
        setMessage(`Error: ${errorText}`);
      } else {
        const successText = await response.text();
        setMessage(successText);
      }
    } catch (err: any) {
      console.error(err);
      setMessage("An error occurred while confirming your email.");
    }
  }

  return (
    <Box sx={{
      pt: 8,
      minHeight: '100vh',
      marginTop: "80px",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.3)', // White overlay with 90% opacity
      }
    }}>
      <Paper elevation={3} sx={{
        p: 4,
        width: '100%',
        maxWidth: 400,
        mx: 2,
        position: 'relative', // Ensure paper stays above overlay
        backgroundColor: 'rgba(255, 255, 255, 0.95)', // Slightly more opaque background
      }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Confirm Your Email
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <TextField
            fullWidth
            label="Confirmation Code"
            variant="outlined"
            margin="normal"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ mt: 3, mb: 2 }}
          >
            Confirm Email
          </Button>
        </form>

        {message && (
          <Typography 
            sx={{ 
              mt: 2,
              color: message.startsWith('Error') ? 'error.main' : 'success.main'
            }}
          >
            {message}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}