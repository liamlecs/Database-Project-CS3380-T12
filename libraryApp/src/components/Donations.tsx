import type React from 'react';
import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Snackbar,
  Alert,
  Box,
  Grid,
  Divider,
} from '@mui/material';

const Donations: React.FC = () => {
  // state for selected donation amount
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donationSuccess, setDonationSuccess] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // check if user is logged in on component mount
  useEffect(() => {
    fetchUserDetails();
  }, []);

  // handle predefined amount selection
  const handleAmountSelection = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount(''); // reset custom amount if a predefined amount is selected
  };

  // handle custom amount input
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(null); // reset predefined amount if custom amount is entered
  };

  // retrieve user ID
  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Customer`);
      if (response.ok) {
        const user = await response.json();
        setCustomerId(user.id);
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("User not logged in, proceeding as anonymous donor.");
      setIsLoggedIn(false);
    }
  };

  // handle donation submission
  const handleDonate = async () => {
    const amount = customAmount ? Number.parseFloat(customAmount) : selectedAmount;

    // validate the amount
    if (!amount || amount <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }

    // validate name fields for anonymous donors
    if (!isLoggedIn && (!firstName.trim() || !lastName.trim())) {
      alert('Please provide your first and last name.');
      return;
    }

    try {
      const donationData = {
        CustomerId: isLoggedIn ? customerId : null,
        FirstName: isLoggedIn ? undefined : firstName.trim(),
        LastName: isLoggedIn ? undefined : lastName.trim(),
        Amount: amount,
        Date: new Date().toISOString().split('T')[0],
      };

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Donation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donationData),
      });

      if (!response.ok) {
        throw new Error('Donation failed. Please try again.');
      }

      setDonationSuccess(true);
      resetForm();
    } catch (error) {
      console.error('Error processing donation:', error);
      alert('Error. Please try again.');
    }
  };

  // reset the form
  const resetForm = () => {
    setSelectedAmount(null);
    setCustomAmount('');
    if (!isLoggedIn) {
      setFirstName('');
      setLastName('');
    }
    setDonationSuccess(false);
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 4, marginBottom: 4 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Donate to the Library
        </Typography>

        {isLoggedIn ? (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Thank you for your support, {firstName}!
          </Typography>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              Your Information
            </Typography>
            <Grid container spacing={2} sx={{ marginBottom: 2 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </Grid>
            </Grid>
            <Divider sx={{ my: 3 }} />
          </>
        )}

        {/* Donation Options */}
        <Typography variant="h6" gutterBottom>
          Choose an Amount
        </Typography>
        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
          {[5, 10, 50, 100].map((amount) => (
            <Grid item xs={6} key={amount}>
              <Button
                fullWidth
                variant={selectedAmount === amount ? 'contained' : 'outlined'}
                onClick={() => handleAmountSelection(amount)}
                sx={{ py: 1.5 }}
              >
                ${amount}
              </Button>
            </Grid>
          ))}
        </Grid>

        {/* Custom Amount Input */}
        <TextField
          fullWidth
          label="Or enter a custom amount"
          type="number"
          value={customAmount}
          onChange={handleCustomAmountChange}
          margin="normal"
          InputProps={{ inputProps: { min: 1 } }}
          sx={{ mb: 3 }}
        />

        {/* Donate Button */}
        <Box sx={{ marginTop: 2 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleDonate}
            size="large"
            sx={{ py: 1.5 }}
          >
            Donate Now
          </Button>
        </Box>
      </Paper>

      {/* Thank You Message */}
      <Snackbar
        open={donationSuccess}
        autoHideDuration={10000}
        onClose={() => setDonationSuccess(false)}
      >
        <Alert
          onClose={() => setDonationSuccess(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Thank you for your donation!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Donations;