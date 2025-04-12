import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Snackbar,
  Alert,
  Grid,
  Divider,
  Card,
  CardContent,
  useTheme,
  Box
} from "@mui/material";

const Donations: React.FC = () => {
  const theme = useTheme();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [donationSuccess, setDonationSuccess] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userIdStored = localStorage.getItem("userId");
        if (!userIdStored) {
          setIsLoggedIn(false);
          return;
        }
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/Customer/${userIdStored}`
        );
        if (!response.ok) throw new Error("Failed to fetch user data");

        const user = await response.json();

        setUserId(user.customerId ?? user.userId);
        setFirstName(user.firstName ?? user.FirstName);
        setLastName(user.lastName ?? user.LastName);

        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setIsLoggedIn(false);
        localStorage.removeItem("userId");
      }
    };

    fetchUserData();
  }, []);

  const handleAmountSelection = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(null);
  };

  const handleDonate = async () => {
    const amount = customAmount ? Number.parseFloat(customAmount) : selectedAmount;
    if (!amount || amount <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }

    if (!isLoggedIn && (!firstName.trim() || !lastName.trim())) {
      alert("Please provide your first and last name.");
      return;
    }

    const donationData = {
      CustomerId: isLoggedIn ? userId : null,
      FirstName: firstName.trim(),
      LastName: lastName.trim(),
      Amount: amount,
      Date: new Date().toISOString().split("T")[0],
    };

    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/Donation`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(donationData),
        }
      );

      if (!response.ok) {
        throw new Error("Donation failed. Please try again.");
      }

      setDonationSuccess(true);
      resetForm();
    } catch (error) {
      console.error("Error processing donation:", error);
      alert("Error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedAmount(null);
    setCustomAmount("");
    if (!isLoggedIn) {
      setFirstName("");
      setLastName("");
    }
  };

  return (
    <Box sx={{ marginTop: "80px" }}>
      {/* 
        Using marginTop: "80px" to push the content down, 
        preventing the global NavBar from overlapping this section. 
      */}
      <Container maxWidth="md" sx={{ my: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Paper
              elevation={3}
              sx={{
                padding: 4,
                borderRadius: 3,
                background: theme.palette.background.paper,
              }}
            >
              <Typography
                variant="h3"
                gutterBottom
                align="center"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                  mb: 4,
                }}
              >
                Support Our Library
              </Typography>

              {isLoggedIn ? (
                <>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Your Information
                  </Typography>
                  <Grid container spacing={2} sx={{ marginBottom: 3 }}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        value={firstName}
                        disabled
                        variant="filled"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        value={lastName}
                        disabled
                        variant="filled"
                      />
                    </Grid>
                  </Grid>
                  <Divider sx={{ my: 3, borderColor: theme.palette.divider }} />
                </>
              ) : (
                <>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Your Information
                  </Typography>
                  <Grid container spacing={2} sx={{ marginBottom: 3 }}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                  <Divider sx={{ my: 3, borderColor: theme.palette.divider }} />
                </>
              )}

              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Choose an Amount
              </Typography>
              <Grid container spacing={2} sx={{ marginBottom: 3 }}>
                {[5, 10, 50, 100].map((amount) => (
                  <Grid item xs={6} sm={3} key={amount}>
                    <Button
                      fullWidth
                      variant={selectedAmount === amount ? "contained" : "outlined"}
                      onClick={() => handleAmountSelection(amount)}
                      sx={{
                        py: 2,
                        borderRadius: 2,
                        fontWeight: selectedAmount === amount ? 600 : 500,
                        borderWidth: selectedAmount === amount ? 0 : 2,
                        "&:hover": {
                          borderWidth: 2,
                        },
                      }}
                    >
                      ${amount}
                    </Button>
                  </Grid>
                ))}
              </Grid>

              <TextField
                fullWidth
                label="Or enter a custom amount"
                type="number"
                value={customAmount}
                onChange={handleCustomAmountChange}
                margin="normal"
                InputProps={{
                  inputProps: { min: 1 },
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                }}
                sx={{ mb: 3 }}
                variant="outlined"
              />

              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleDonate}
                size="large"
                disabled={isLoading}
                sx={{
                  py: 2,
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  boxShadow: theme.shadows[4],
                  "&:hover": {
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                {isLoading ? "Processing..." : "Donate Now"}
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Card sx={{ height: "100%", borderRadius: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: 700, mb: 3 }}
                >
                  Your Donation Matters
                </Typography>
                <Typography paragraph sx={{ mb: 2 }}>
                  Every contribution helps us maintain and expand our collection,
                  improve facilities, and provide better services to our community.
                </Typography>
                <Typography paragraph sx={{ mb: 2 }}>
                  With your support, we hope to:
                </Typography>
                <ul
                  style={{
                    paddingLeft: 24,
                    marginBottom: 24,
                    listStyleType: "none",
                  }}
                >
                  <li
                    style={{
                      marginBottom: 8,
                      position: "relative",
                      paddingLeft: 24,
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        color: theme.palette.primary.main,
                      }}
                    >
                      ✓
                    </span>
                    Purchase new books and materials
                  </li>
                  <li
                    style={{
                      marginBottom: 8,
                      position: "relative",
                      paddingLeft: 24,
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        color: theme.palette.primary.main,
                      }}
                    >
                      ✓
                    </span>
                    Upgrade technology and equipment
                  </li>
                  <li
                    style={{
                      marginBottom: 8,
                      position: "relative",
                      paddingLeft: 24,
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        color: theme.palette.primary.main,
                      }}
                    >
                      ✓
                    </span>
                    Fund community programs and events
                  </li>
                  <li style={{ position: "relative", paddingLeft: 24 }}>
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        color: theme.palette.primary.main,
                      }}
                    >
                      ✓
                    </span>
                    Maintain our beautiful library spaces
                  </li>
                </ul>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Snackbar
          open={donationSuccess}
          autoHideDuration={6000}
          onClose={() => setDonationSuccess(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setDonationSuccess(false)}
            severity="success"
            sx={{
              width: "100%",
              boxShadow: theme.shadows[6],
              "& .MuiAlert-icon": {
                fontSize: 32,
              },
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Thank you for your generous donation!
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Your support makes a difference in our community.
            </Typography>
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Donations;
