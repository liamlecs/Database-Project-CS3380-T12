import React, { use, useEffect, useState } from "react";
import "./UserProfile.css";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import SummarizeIcon from "@mui/icons-material/Summarize";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid"; // Import DataGrid
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slider from "@mui/material/Slider"; // Import Slider
import Typography from "@mui/material/Typography"; // Import Typography

interface Profile {
  customerID: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string; // e.g., "Customer"
  membershipStartDate: string;
  membershipEndDate: string | null;
  //checkedBooks
  fines: Array<{
    transactionId: number;
    customerId: number;
    amount: number;
    dueDate: Date;
    issueDate: Date;
    status: boolean;
  }>;
  transactionHistory: Array<{
    transactionId: number;
    customerId: number;
    itemId: number;
    dateBorrowed: Date;
    dueDate: Date;
    returnDate: Date;
    title?: string;
  }>;
  waitlists: Array<{
    waitlistId: number;
    customerId: number;
    itemId: number;
    title: string;
    reservationDate: Date;
    isReceived: boolean;
  }>;
}

export default function UserProfile() {
  const navigate = useNavigate();
  const location = useLocation();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [editProfile, setEditProfile] = useState<Profile | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("account"); // Active tab for navigation
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredWaitlists, setFilteredWaitlists] = useState<
    Profile["waitlists"]
  >([]);
  const [filterDays, setFilterDays] = useState<number>(0);
  const [filterReceived, setFilterReceived] = useState<string>("all");

  const [inventorySearchQuery, setInventorySearchQuery] = useState<string>("");
  const [filteredInventory, setFilteredInventory] = useState<
    Profile["transactionHistory"]
  >([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog visibility
  const [filterStatus, setFilterStatus] = useState<string>("all"); // For status filter
  const [filterAmount, setFilterAmount] = useState<number[]>([0, 100]); // For amount slider
  const [filteredFines, setFilteredFines] = useState<Profile["fines"]>([]); // For filtered fines

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleConfirmSave = async () => {
    setIsDialogOpen(false);
    await handleSave();
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/customer-login");
    }
  }, [navigate]);

  // Reset `fromSettings` state to false when the component loads
  useEffect(() => {
    if (location.state?.fromSettings) {
      navigate(location.pathname, { state: { fromSettings: false } });
    }
  }, [location, navigate]);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const userIdStr = localStorage.getItem("userId");
        if (!userIdStr) {
          navigate("/customer-login");
          return;
        }
        const userIdNum = parseInt(userIdStr, 10);
        if (isNaN(userIdNum)) {
          navigate("/customer-login");
          return;
        }

        const userType = "customer";

        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/UserProfile/${userType}/${userIdNum}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        const data = await response.json();

        //console.log(data);

        // e) call your GET /TransactionHistory/{userIdNum}
        const transHistoryResponse = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/TransactionHistory/${userIdNum}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        //check to see if null first
        let transHistoryData = [];
        if (transHistoryResponse.ok) {
          transHistoryData = await transHistoryResponse.json();
        } else if (transHistoryResponse.status === 404) {
          console.warn("No tranaction history found");
        } else {
          throw new Error("Failed to fetch transaction data");
        }

        //see what the backend is sending
        //console.log("FULL RESPONSE", data);
        //console.log(transHistoryData);

        // Map API fields to your Profile interface if needed
        //Mapping Customer Fields to the fetch request
        const mappedProfile: Profile = {
          customerID: userIdNum,
          firstName: data.name.split(" ")[0],
          lastName: data.name.split(" ").slice(1).join(" "),
          email: data.email,
          password: data.password,
          role: data.role,
          membershipStartDate: data.memberSince,
          membershipEndDate: data.membershipExpires || null,
          fines: data.fines || [],
          //checkedoutbooks implement later
          transactionHistory: transHistoryData || [],
          waitlists: data.waitLists || [],
        };

        setProfile(mappedProfile);
        setEditProfile({ ...mappedProfile });
        setFilteredWaitlists(data.waitList || []);
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        setErrorMsg(error.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editProfile) return;
    setEditProfile((prev) =>
      prev
        ? {
            ...prev,
            [e.target.name]: e.target.value,
          }
        : null
    );
  };

  const handleSave = async () => {
    if (!editProfile) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/UserProfile/customer/${
          editProfile.customerID
        }`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editProfile),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile data");
      }

      setProfile(editProfile);
      setEditingField(null);
      alert("Settings Changed Successfully");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setErrorMsg(error.message || "An error occurred while updating profile.");
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const filterLast30Days = () => {
    const now = new Date();
    const last30Days = new Date(now.setDate(now.getDate() - 30));
    const filtered =
      profile?.waitlists.filter(
        (item) => new Date(item.reservationDate) >= last30Days
      ) || [];
    setFilteredWaitlists(filtered);
  };

  const handleFilterDaysChange = (days: number) => {
    setFilterDays(days);
    const now = new Date();
    const filtered =
      profile?.waitlists.filter((item) => {
        const reservationDate = new Date(item.reservationDate);
        return (
          days === 0 ||
          reservationDate >= new Date(now.setDate(now.getDate() - days))
        );
      }) || [];
    setFilteredWaitlists(filtered);
  };

  useEffect(() => {
    const filtered =
      profile?.waitlists.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      ) || [];
    setFilteredWaitlists(filtered);
  }, [searchQuery, profile?.waitlists]);

  useEffect(() => {
    const filtered =
      profile?.waitlists.filter((item) => {
        const matchesSearchQuery = item.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesReceivedFilter =
          filterReceived === "all" ||
          (filterReceived === "yes" && item.isReceived) ||
          (filterReceived === "no" && !item.isReceived);
        return matchesSearchQuery && matchesReceivedFilter;
      }) || [];
    setFilteredWaitlists(filtered);
  }, [searchQuery, filterReceived, profile?.waitlists]);

  useEffect(() => {
    const filtered =
      profile?.transactionHistory.filter((transaction) =>
        transaction.title
          ?.toLowerCase()
          .includes(inventorySearchQuery.toLowerCase())
      ) || [];
    setFilteredInventory(filtered);
  }, [inventorySearchQuery, profile?.transactionHistory]);

  useEffect(() => {
    const filtered =
      profile?.fines.filter((fine) => {
        const matchesStatus =
          filterStatus === "all" ||
          (filterStatus === "paid" && fine.status) ||
          (filterStatus === "unpaid" && !fine.status);

        const matchesAmount =
          fine.amount >= filterAmount[0] && fine.amount <= filterAmount[1];

        return matchesStatus && matchesAmount;
      }) || [];
    setFilteredFines(filtered);
  }, [filterStatus, filterAmount, profile?.fines]);

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }
  if (errorMsg) {
    return <div className="error">{errorMsg}</div>;
  }
  if (!profile) {
    return <div>No profile data found.</div>;
  }

  return (
    <div className="user-profile">
      {/* Left side nav */}
      <div className="left-nav">
        <nav className="vertical-nav">
          <ul>
            <li>
              <button
                className={activeTab === "account" ? "active" : ""}
                onClick={() => handleTabChange("account")}
              >
                My Account
              </button>
            </li>
            <li>
              <button
                className={activeTab === "inventory" ? "active" : ""}
                onClick={() => handleTabChange("inventory")}
              >
                Inventory
              </button>
            </li>
            <li>
              <button
                className={activeTab === "transactions" ? "active" : ""}
                onClick={() => handleTabChange("transactions")}
              >
                Transaction History
              </button>
            </li>
            <li>
              <button
                className={activeTab === "waitlist" ? "active" : ""}
                onClick={() => handleTabChange("waitlist")}
              >
                Waitlist
              </button>
            </li>
            <li>
              <button
                className={activeTab === "fines" ? "active" : ""}
                onClick={() => handleTabChange("fines")}
              >
                Fines
              </button>
            </li>
            <li>
              <button
                className={activeTab === "settings" ? "active" : ""}
                onClick={() => handleTabChange("settings")}
              >
                Account Settings
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Right side content */}
      <div className="profile-content">
        {/* Account Tab */}
        {activeTab === "account" && (
          <div className="profile-section">
            <h3>My Account</h3>
            <div className="profile-item">
              <strong>Name: </strong>
              {profile.firstName} {profile.lastName}
            </div>
            <div className="profile-item">
              <strong>Email: </strong>
              {profile.email}
            </div>
            <div className="profile-item">
              <strong>Role: </strong>
              {profile.role}
            </div>
            <div className="profile-item">
              <strong>Membership Start Date: </strong>
              {new Date(profile.membershipStartDate).toLocaleDateString()}
            </div>
            {profile.membershipEndDate && (
              <div className="profile-item">
                <strong>Membership End Date: </strong>
                {new Date(profile.membershipEndDate).toLocaleDateString()}
              </div>
            )}
            <div className="account-actions">
              <button
                className="btn-delete"
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete your account? This action cannot be undone."
                    )
                  ) {
                    alert("Account deleted successfully.");
                    // TODO: Implement actual delete logic
                  }
                }}
              >
                Delete Account
              </button>
            </div>
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === "inventory" && (
          <div className="profile-section">
            <h3>Inventory</h3>

            {/* Search Bar */}
            <div className="filter-container">
              <TextField
                label="Search by Title"
                variant="outlined"
                size="small"
                onChange={(e) => setInventorySearchQuery(e.target.value)}
                style={{ width: "40%", marginBottom: "16px" }}
              />
            </div>

            {(filteredInventory || []).length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                {filteredInventory.map((transaction, index) => (
                  <Paper
                    key={index}
                    elevation={3}
                    style={{
                      flex: "1 1 calc(33.333% - 16px)", // Adjust for 3 items per row
                      padding: "15px",
                      borderRadius: "8px",
                      backgroundColor: "#f8f9fa",
                      minWidth: "300px",
                    }}
                  >
                    <div style={{ marginBottom: "10px" }}>
                      <strong>Item ID:</strong> {transaction.itemId}
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                      <strong>Title:</strong> {transaction.title || "N/A"}
                    </div>
                  </Paper>
                ))}
              </div>
            ) : (
              <p>No inventory data to display.</p>
            )}
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <div className="profile-section">
            <h3>Transaction History</h3>

            {/* Material-UI DataGrid */}
            {profile.transactionHistory.length > 0 ? (
              <div style={{ height: 500, width: "100%" }}>
                <DataGrid
                  rows={profile.transactionHistory.map((transaction) => ({
                    id: transaction.transactionId, // DataGrid requires a unique `id` field
                    title: transaction.title || "N/A",
                    dateBorrowed: new Date(
                      transaction.dateBorrowed
                    ).toLocaleDateString(),
                    dueDate: new Date(transaction.dueDate).toLocaleDateString(),
                    returnDate: transaction.returnDate
                      ? new Date(transaction.returnDate).toLocaleDateString()
                      : "Not Returned",
                  }))}
                  columns={[
                    { field: "id", headerName: "Transaction ID", width: 150 },
                    { field: "title", headerName: "Title", width: 300 },
                    {
                      field: "dateBorrowed",
                      headerName: "Date Borrowed",
                      width: 200,
                    },
                    { field: "dueDate", headerName: "Due Date", width: 200 },
                    {
                      field: "returnDate",
                      headerName: "Return Date",
                      width: 200,
                    },
                  ]}
                  //pageSize={10}
                  //rowsPerPageOptions={[5, 10, 20]}
                  //disableSelectionOnClick
                />
              </div>
            ) : (
              <p>No transactions found.</p>
            )}
          </div>
        )}

        {/* Waitlist Tab */}
        {activeTab === "waitlist" && (
          <div className="profile-section">
            <h3>Waitlist</h3>

            {/* Search and Filter Controls */}
            <div className="filter-container">
              {/* Search Bar */}
              <TextField
                label="Search by Title"
                variant="outlined"
                size="small"
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: "40%" }}
              />

              {/* Filter Dropdown with Label */}
              <div className="filter-wrapper">
                <label className="filter-label">Filter by Days:</label>
                <FormControl className="filter-dropdown">
                  <Select
                    value={filterDays}
                    onChange={(e) =>
                      handleFilterDaysChange(e.target.value as number)
                    }
                  >
                    <MenuItem value={0}>All</MenuItem>
                    <MenuItem value={30}>Last 30 Days</MenuItem>
                    <MenuItem value={60}>Last 60 Days</MenuItem>
                    <MenuItem value={360}>Last Year</MenuItem>
                  </Select>
                </FormControl>
              </div>

              {/* New Filter for "Is Received" */}
              <div className="filter-wrapper">
                <label className="filter-label">Filter by Received:</label>
                <FormControl className="filter-dropdown">
                  <Select
                    value={filterReceived}
                    onChange={(e) => setFilterReceived(e.target.value)}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            {/* Material-UI DataGrid */}
            {filteredWaitlists.length > 0 ? (
              <div style={{ height: 500, width: "100%" }}>
                <DataGrid
                  rows={filteredWaitlists.map((item) => ({
                    id: item.waitlistId, // DataGrid requires a unique `id` field
                    title: item.title,
                    reservationDate: new Date(
                      item.reservationDate
                    ).toLocaleDateString(),
                    isReceived: item.isReceived ? "Yes" : "No",
                  }))}
                  columns={[
                    { field: "id", headerName: "Waitlist ID", width: 150 },
                    { field: "title", headerName: "Title", width: 300 },
                    {
                      field: "reservationDate",
                      headerName: "Reservation Date",
                      width: 200,
                    },
                    {
                      field: "isReceived",
                      headerName: "Is Received",
                      width: 150,
                    },
                  ]}
                  //pageSize={10}
                  //rowsPerPageOptions={[5, 10, 20]}
                  //disableSelectionOnClick
                />
              </div>
            ) : (
              <p>No items in the waitlist.</p>
            )}
          </div>
        )}

        {/* Fines Tab */}
        {activeTab === "fines" && (
          <div className="profile-section">
            <h3>Fines</h3>

            {/* Filters */}
            <div className="filter-container">
              {/* Filter by Status */}
              <div className="filter-wrapper">
                <label className="filter-label">Filter by Status:</label>
                <FormControl className="filter-dropdown">
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="paid">Paid</MenuItem>
                    <MenuItem value="unpaid">Unpaid</MenuItem>
                  </Select>
                </FormControl>
              </div>

              {/* Filter by Amount */}
              <div className="filter-wrapper">
                <label className="filter-label">
                  Filter by Amount: ${filterAmount[0]} - ${filterAmount[1]}
                </label>
                <Box sx={{ width: 300, paddingTop: 2 }}>
                  <Typography gutterBottom variant="subtitle1">
                    Filter by Amount: ${filterAmount[0]} - ${filterAmount[1]}
                  </Typography>
                  <Slider
                    value={filterAmount}
                    onChange={(e, newValue) =>
                      setFilterAmount(newValue as number[])
                    }
                    valueLabelDisplay="auto"
                    min={0}
                    max={Math.max(
                      ...profile.fines.map((fine) => fine.amount),
                      100
                    )}
                    step={5}
                    marks={[
                      { value: 0, label: "$0" },
                      { value: 25, label: "$25" },
                      { value: 50, label: "$50" },
                      { value: 75, label: "$75" },
                      { value: 100, label: "$100+" },
                    ]}
                    sx={{
                      color: "primary.main",
                      "& .MuiSlider-track": {
                        height: 8,
                      },
                      "& .MuiSlider-rail": {
                        height: 8,
                        opacity: 0.3,
                      },
                      "& .MuiSlider-thumb": {
                        height: 24,
                        width: 24,
                        backgroundColor: "#fff",
                        border: "2px solid currentColor",
                        "&:hover": {
                          boxShadow: "0 0 0 8px rgba(25, 118, 210, 0.16)",
                        },
                      },
                    }}
                  />
                </Box>
              </div>
            </div>

            {/* Material-UI DataGrid */}
            {filteredFines.length > 0 ? (
              <div style={{ height: 500, width: "100%" }}>
                <DataGrid
                  rows={filteredFines.map((fine, index) => ({
                    id: index, // DataGrid requires a unique `id` field
                    transactionId: fine.transactionId,
                    amount: `$${fine.amount.toFixed(2)}`,
                    dueDate: fine.dueDate
                      ? new Date(fine.dueDate).toLocaleDateString()
                      : "N/A",
                    issueDate: fine.issueDate
                      ? new Date(fine.issueDate).toLocaleDateString()
                      : "N/A",
                    status: fine.status ? "Paid" : "Unpaid",
                  }))}
                  columns={[
                    {
                      field: "transactionId",
                      headerName: "Transaction ID",
                      width: 150,
                    },
                    { field: "amount", headerName: "Amount", width: 150 },
                    { field: "dueDate", headerName: "Due Date", width: 200 },
                    {
                      field: "issueDate",
                      headerName: "Issue Date",
                      width: 200,
                    },
                    { field: "status", headerName: "Status", width: 150 },
                  ]}
                  //pageSize={10}
                  //rowsPerPageOptions={[5, 10, 20]}
                  //disableSelectionOnClick
                />
              </div>
            ) : (
              <p>No fines to display.</p>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="profile-section">
            <h3>Account Settings</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  label="First Name"
                  variant="outlined"
                  id="firstName"
                  name="firstName"
                  value={editProfile?.firstName || ""}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
                <TextField
                  label="Last Name"
                  variant="outlined"
                  id="lastName"
                  name="lastName"
                  value={editProfile?.lastName || ""}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />

                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  sx={{ width: "200px", alignSelf: "center" }}
                  onClick={handleDialogOpen} // Open the confirmation dialog
                >
                  Save Changes
                </Button>

                {/* Only show the Change Password button if we're NOT on /userprofile/changepassword */}
                {location.pathname !== "/userprofile/changepassword" && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      navigate("/userprofile/changepassword", {
                        state: { fromSettings: true },
                      })
                    }
                  >
                    Change Password
                  </Button>
                )}
              </Box>
            </form>

            {/* Confirmation Dialog */}
            <Dialog
              open={isDialogOpen}
              onClose={handleDialogClose}
              aria-labelledby="confirm-dialog-title"
              aria-describedby="confirm-dialog-description"
            >
              <DialogTitle id="confirm-dialog-title">
                Confirm Changes
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="confirm-dialog-description">
                  Are you sure you want to change these settings?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDialogClose} color="secondary">
                  Cancel
                </Button>
                <Button onClick={handleConfirmSave} color="primary" autoFocus>
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>

            {/* Only render ChangePassword route if user is on that exact path */}
            {location.pathname === "/userprofile/changepassword" && <Outlet />}
          </div>
        )}
      </div>
    </div>
  );
}
