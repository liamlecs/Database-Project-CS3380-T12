import type React from 'react';
import { useState, useEffect, use } from 'react';
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
  Divider
} from '@mui/material';

const Donations: React.FC = () => {
  // state for selected donation amount
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donationSuccess, setDonationSuccess] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [customerID, setCustomerID] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  
  /* useEffect(() => {
    const storedCustomerId = localStorage.getItem('customerId');
    if (storedCustomerId) {
      fetchUserData(parseInt(storedCustomerId));
    }
  }, []); */

  const fetchUserData = async () => {
    try {

      // check if customerId is stored in localStorage
      const customerID = localStorage.getItem('customerId');
      if (!customerID) {
        setIsLoggedIn(false);
        return;
      }

      // fetch user data from api
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Customer/${customerID}`);
      if (!response.ok) throw new Error('Failed to fetch user data');

      const user = await response.json();
      setCustomerID(user.customerId || user.id);
      setFirstName(user.firstName || user.first_name);
      setLastName(user.lastName || user.last_name);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
      setIsLoggedIn(false);
      localStorage.removeItem('customerId'); // clear customerId if fetch fails
    }
  };

  useEffect(() => {
    fetchUserData();
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
  const getCustomerId = async (): Promise<number> => {
    const response = await fetch('/api/Customer');
    const user = await response.json();
    return user.id;
  };

  // handle donation submission
  const handleDonate = async () => {
    const amount = customAmount ? Number.parseFloat(customAmount) : selectedAmount;

    // validate the amount
    if (!amount || amount <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }

    if (!isLoggedIn && (!firstName.trim() || !lastName.trim())) {
      alert('Please provide your first and last name.');
      return;
    }

    const donationData = {
      customerID: isLoggedIn ? customerID : null,
      firstName: isLoggedIn ? undefined : firstName.trim(),
      lastName: isLoggedIn ? undefined : lastName.trim(),
      amount: amount,
      date: new Date().toISOString().split('T')[0],
    };

    try {
      // send donation data to the server
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Donation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationData),
      });

      if (!response.ok) {
        throw new Error('Donation failed. Please try again.');
      }

      setDonationSuccess(true);

      resetForm(); // reset form after successful donation
    } catch (error) {
      console.error('Error processing donation:', error);
      alert('Error. Please try again.');
    }
  };

  // Reset the form
  const resetForm = () => {
    setSelectedAmount(null);
    setCustomAmount('');
    if (!isLoggedIn) {
      setFirstName('');
      setLastName('');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 4 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Donate to the Library
        </Typography>

        {!isLoggedIn && (
          <>
            <Typography variant="h6" gutterBottom>
              Your Information
            </Typography>
            <Grid container spacing={2} sx={{ marginBottom: 2 }}>
              <Grid item xs={6}>
                <TextField fullWidth label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
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
              <Button fullWidth variant={selectedAmount === amount ? 'contained' : 'outlined'} onClick={() => handleAmountSelection(amount)} sx={{ py: 1.5 }}>
                ${amount}
              </Button>
            </Grid>
          ))}
        </Grid>

        {/* Custom Amount Input */}
        <TextField
          fullWidth
          label="Custom Amount"
          type="number"
          value={customAmount}
          onChange={handleCustomAmountChange}
          margin="normal"
          InputProps={{ inputProps: { min: 1 } }}
        />

        {/* Donate Button */}
        <Box sx={{ marginTop: 2 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleDonate}
            size="large"
          >
            Donate Now
          </Button>
        </Box>
      </Paper>

      {/* Thank You Message */}
      <Snackbar
        open={donationSuccess}
        autoHideDuration={50000}
        onClose={() => setDonationSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
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