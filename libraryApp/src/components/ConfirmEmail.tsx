import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";

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
      pt: 8, // Add padding for navbar
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: 'background.default'
    }}>
      <Paper elevation={3} sx={{
        p: 4,
        width: '100%',
        maxWidth: 400,
        mx: 2
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