import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/library-bg.png"; // Use your background image
import emailjs from 'emailjs-com';

const EMAILJS_USER_ID = import.meta.env.VITE_EMAILJS_USER_ID;
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;


const ContactPage: React.FC = () => {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
  
      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            from_name: formData.name,
            from_email: formData.email,
            to_email: "uhelibrary5@gmail.com",
            subject: formData.subject,
            message: formData.message
          },
          EMAILJS_USER_ID
        );
  
        alert("Message sent successfully!");
        navigate("/");
      } catch (error) {
        console.error("Failed to send message:", error);
        alert("Failed to send message. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <Box sx={{
      pt: 8,
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
      }
    }}>
      <Paper elevation={3} sx={{
        p: 4,
        width: '100%',
        maxWidth: 600,
        mx: 2,
        position: 'relative',
        backgroundColor: 'rgba(255, 255, 255, 0.95)'
      }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Contact Us
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            margin="normal"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />

          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />

          <TextField
            fullWidth
            label="Subject"
            variant="outlined"
            margin="normal"
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
            required
          />

          <TextField
            fullWidth
            label="Message"
            variant="outlined"
            margin="normal"
            multiline
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            required
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            Send Message
          </Button>
        </form>

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Prefer to email directly?{' '}
          <Link href="mailto:uhelibrary5@gmail.com" color="primary">
          uhelibrary5@gmail.com
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default ContactPage;