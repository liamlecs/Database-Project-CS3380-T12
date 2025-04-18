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
import SummarizeIcon from "@mui/icons-material/Summarize";
import Box from "@mui/material/Box";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid"; // Import DataGrid
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slider from "@mui/material/Slider"; // Import Slider
import Typography from "@mui/material/Typography"; // Import Typography
import Checkbox from "@mui/material/Checkbox"; // Import Checkbox
import InventoryTable from "./InventoryTable"; // Adjust the path if it's in a different folder
import { Button, Snackbar, Alert, AlertTitle, Stack } from "@mui/material";
import dayjs from 'dayjs';

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
    fineId: number;
    transactionId: number;
    customerId: number;
    amount: number;
    dueDate: Date;
    issueDate: Date;
    paymentStatus: boolean;
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
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

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
  const [selectedFines, setSelectedFines] = useState<number[]>([]); // For selected fines
  const [dialogFines, setDialogFines] = useState<Profile["fines"]>([]);

  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  interface WaitlistItem { 
    notificationId: number;
    title: string;
    typeName: string;
    expirationDate: string;
  }

  const [openWaitlistConfirmationDialog, setOpenWaitlistConfirmationDialog] = useState(false);
  const [openWaitlistTimerFailureDialog, setOpenWaitlistTimerFailureDialog] = useState(false);
  const [showExitWarningDialog, setShowExitWarningDialog] = useState(false);
  
  const [waitlistItems, setWaitlistItems] = React.useState<WaitlistItem[]>([]);
  const [evilListItems, setEvilListItems] = React.useState<WaitlistItem[]>([]);

  const handleConfirmWaitlist = async (id: number) => { //
    //setOpenWaitlistTimerFailureDialog(false);
    try{

      const acceptResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/Waitlist/waitlist-accept/${id}`,
        { method: "POST" }
      );

      if (!acceptResponse.ok) {
        throw new Error(`Reject API call failed with status ${acceptResponse.status}`);
      }
  
      await fetchWaitlistStatus();

      // Optionally update your state or UI here
    } catch (error) {
      console.error("Error accepting waitlist item:", error);
    }
  };

  const handleRemoveWaitlist = async (id: number) => { //run reject api call, then remove from waitlistItems, then increment item by 1
    //setOpenWaitlistTimerFailureDialog(false);

    try{

      const rejectResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/Waitlist/waitlist-reject/${id}`,
        { method: "POST" }
      );


      if (!rejectResponse.ok) {
        throw new Error(`Reject API call failed with status ${rejectResponse.status}`);
      }
  
      await fetchWaitlistStatus();

      // Optionally update your state or UI here
    } catch (error) {
      console.error("Error rejecting waitlist item:", error);
    }
  };


  const columns: GridColDef[] = [
    { field: "notificationId", headerName: "ID", flex: 1 },
    { field: "title", headerName: "Title", flex: 1 }, 
    { field: "typeName", headerName: "Item Type", flex: 1 },
    { field: "expirationDate", headerName: "Expiration Date", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      align: "center",
      renderCell: (params: GridRenderCellParams) => (
        <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start", // prevent centering vertically
      gap: 1,
      mt: 1, // 👈 this pushes everything down
      width: "100%",
    }}
  >
    <Button
      size="small"
      variant="contained"
      color="primary"
      onClick={() => handleConfirmWaitlist(params.row.notificationId)}
    >
      Confirm
    </Button>
    <Button
      size="small"
      variant="outlined"
      color="error"
      onClick={() => handleRemoveWaitlist(params.row.notificationId)}
    >
      Remove
    </Button>
  </Box>
      )
      ,
    },
  ];


  // Add this password change handler
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  // Add this password submit handler
  const handlePasswordSubmit = async () => {
    try {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setPasswordError("New passwords don't match!");
        return;
      }

      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("User not logged in");

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/Customer/${userId}/password`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            oldPassword: passwordForm.oldPassword,
            newPassword: passwordForm.newPassword
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error("Password update failed: " + errorText + "!");
      }

          // Instead of alerting, trigger the Snackbar for success.
      setPasswordSuccess(true);
      setChangePasswordDialogOpen(false);
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });

    } catch (error: any) {
      console.error("Password change error:", error);
      setPasswordError(error.message ?? "Password update failed");
    }
  };

  //Dialog open/close handlers
  const handleDialogOpen = () => {
    const unpaidFines = profile?.fines.filter((fine) => !fine.paymentStatus) || [];
    setDialogFines(unpaidFines); // Use dialog-specific state
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedFines([]); // Reset selections
    setPaymentError(""); // <-- Reset the error here
  };

  //Handle save confirmation
  const handleConfirmSave = async () => {
    setIsDialogOpen(false);
    await handleSave();
  };

  const handleDeleteAccount = async () => {
    setDeleteConfirmOpen(true);
  };

  const handleChangePasswordDialogClose = () => {
    setChangePasswordDialogOpen(false);
    setPasswordError(""); // Clear error message when dialog closes
  };
  

  const handleConfirmDelete = async () => {
    // Close the snackbar immediately
    setDeleteConfirmOpen(false);

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("No user ID found.");
        return;
      }

      // Call soft-delete endpoint on the backend
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/Customer/soft/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to deactivate the account.");
      }

      // Clear local storage and redirect to login
      localStorage.clear();
      alert("Your account has been deactivated successfully.");
      navigate("/login");
    } catch (error) {
      console.error("Error deactivating account:", error);
      alert("Failed to deactivating your account. Please try again later.");
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
  };



  // Check if user is logged in when the component mounts
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [navigate]);

  // Reset `fromSettings` state to false when the component loads
  //This is for change password settings
  useEffect(() => {
    if (location.state?.fromSettings) {
      navigate(location.pathname, { state: { fromSettings: false } });
    }
  }, [location, navigate]);

  //Loads the user from the database
  useEffect(() => {
    async function fetchProfile() {
      try {
        const userIdStr = localStorage.getItem("userId");
        if (!userIdStr) {
          navigate("/login");
          return;
        }
        const userIdNum = parseInt(userIdStr, 10);
        if (isNaN(userIdNum)) {
          navigate("/login");
          return;
        }

        const userType = "customer";

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL
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

        // e) call GET /TransactionHistory/{userIdNum}
        const transHistoryResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL
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

        // Map API fields to Profile interface if needed
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
        `${import.meta.env.VITE_API_BASE_URL}/api/UserProfile/customer/${editProfile.customerID
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
      // Update localStorage
      localStorage.setItem("firstName", editProfile.firstName);
      localStorage.setItem("lastName", editProfile.lastName);
      setEditingField(null);
      // INSTEAD OF alert("Settings Changed Successfully"):
      setSettingsSuccess(true);  // Trigger the success snackbar
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

  const handleRemoveItem = async (waitlistId: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/Waitlist/${waitlistId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove item from waitlist");
      }

      // Update the waitlist after successful removal
      setFilteredWaitlists((prev) =>
        prev.filter((item) => item.waitlistId !== waitlistId)
      );
      alert("Item removed successfully!");
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item.");
    }
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

  //check if any waitlist books are available
    
    const fetchWaitlistStatus = async () => {
      try{

        const userIdStr = localStorage.getItem("userId");
        if (!userIdStr) {
          console.error("unexpected error finding account info, aborting");
          return;
        }
        const customerId = Number.parseInt(userIdStr, 10);

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/Waitlist/waitlist-status/${customerId
          }`);
      const data = await response.json();

      console.log("data: ",data);

      const now = new Date();
      const validItems = data
  .filter((item: WaitlistItem) => new Date(item.expirationDate) > now)
  .map((item: WaitlistItem) => ({
    ...item,
    expirationDate: dayjs(item.expirationDate).format("YYYY-MM-DD HH:mm:ss"),
  }));

const invalidItems = data
  .filter((item: WaitlistItem) => new Date(item.expirationDate) <= now)
  .map((item: WaitlistItem) => ({
    ...item,
    expirationDate: dayjs(item.expirationDate).format("YYYY-MM-DD HH:mm:ss"),
  }));


      setWaitlistItems(validItems);
      setEvilListItems(invalidItems);
      
      await Promise.all(
        invalidItems.map(async (item: WaitlistItem) => { //add increase of item
          try {
            const rejectResponse = await fetch(
              `${import.meta.env.VITE_API_BASE_URL}/api/Waitlist/waitlist-reject/${item.notificationId}`,
              { method: "POST" }
            );

            if (!rejectResponse.ok) {
              console.warn(
                `Failed to reject notification ${item.notificationId}`
              );
            }
            
          } catch (error) {
            console.error(
              `Error rejecting notification ${item.notificationId}:`,
              error
            );
          }
        })
      );

      console.log("validItems: ",validItems );
      console.log("should open validItems dialog: ",validItems.length>0 );
      console.log("invalidItems: ",invalidItems);

      if (validItems.length > 0) {
        setOpenWaitlistConfirmationDialog(true);
      } 
      
      if(invalidItems.length > 0){
        setOpenWaitlistTimerFailureDialog(true);
      }
      
  
    }catch (error) {
        console.error("Error fetching waitlist status", error);
      }
    };
  
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
      React.useEffect(() => {
    fetchWaitlistStatus();
  
  }, []);

  useEffect(() => {
    const filtered =
      profile?.fines.filter((fine) => {
        const matchesStatus =
          filterStatus === "all" ||
          (filterStatus === "paid" && fine.paymentStatus) ||
          (filterStatus === "unpaid" && !fine.paymentStatus);

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
                My Checked-Out Items
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
              {dayjs(profile.membershipStartDate).format("MM/DD/YYYY")}
            </div>
            {profile.membershipEndDate && (
              <div className="profile-item">
                <strong>Membership End Date: </strong>
                {dayjs(profile.membershipEndDate).format("MM/DD/YYYY")}
              </div>
            )}
            <div className="account-actions">
              <button
                className="btn-delete"
                onClick={handleDeleteAccount}
              >
                Deactivate Account
              </button>
              <Snackbar
                open={deleteConfirmOpen}
                onClose={handleCancelDelete}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                sx={{
                  top: "100% !important",
                  left: "50% !important",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <Alert
                  severity="warning"
                  variant="filled"
                  onClose={handleCancelDelete}
                  action={
                    <>
                      <Button
                        color="inherit"
                        size="small"
                        onClick={handleCancelDelete}
                      >
                        Cancel
                      </Button>
                      <Button
                        color="inherit"
                        size="small"
                        onClick={handleConfirmDelete}
                      >
                        Confirm
                      </Button>
                    </>
                  }
                  sx={{ width: "100%" }}
                >
                  <AlertTitle>Confirm Account Deactivation</AlertTitle>
                  Are you sure you want to deactivate your account? This action cannot be undone.
                </Alert>
              </Snackbar>
            </div>
          </div>
        )}

        {activeTab === "inventory" && (
          <div className="profile-section">
            <h3>My Checked-Out Items</h3>
            {profile.transactionHistory.filter((t) => !t.returnDate).length >
              0 ? (
              <div style={{ height: 500, width: "100%" }}>
                <DataGrid
                  rows={profile.transactionHistory
                    .filter((t) => !t.returnDate)
                    .map((transaction) => ({
                      id: transaction.transactionId, // DataGrid requires a unique 'id'
                      title: transaction.title || "Untitled",
                      dateBorrowed: dayjs(transaction.dateBorrowed).format("MM/DD/YYYY"),
                      dueDate: dayjs(transaction.dueDate).format("MM/DD/YYYY"),
                      transactionId: transaction.transactionId, // Pass along for action handling
                    }))}
                  columns={[
                    { field: "title", headerName: "Title", width: 300 },
                    {
                      field: "dateBorrowed",
                      headerName: "Date Borrowed",
                      width: 200,
                    },
                    { field: "dueDate", headerName: "Due Date", width: 200 },
                    {
                      field: "action",
                      headerName: "Actions",
                      width: 200,
                      renderCell: (params) => (
                        <Button
                          variant="contained"
                          onClick={() => {
                            window.location.href = "/return";
                          }}
                        >
                          Return This Item
                        </Button>
                      ),
                    },
                  ]}
                />
              </div>
            ) : (
              <p>You have no items currently checked out.</p>
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
                    dateBorrowed: dayjs(transaction.dateBorrowed).format("MM/DD/YYYY"),
                    dueDate: dayjs(transaction.dueDate).format("MM/DD/YYYY"),
                    returnDate: transaction.returnDate
                      ? dayjs(transaction.returnDate).format("MM/DD/YYYY")
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
              <div className="filter-wrapper" style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "16px" }}>
                <label className="filter-label" style={{ whiteSpace: "nowrap" }}>Filter by Days:</label>
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
              <div className="filter-wrapper" style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "16px" }}>
                <label className="filter-label" style={{ whiteSpace: "nowrap" }}>Filter by Received:</label>
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
                    reservationDate: dayjs(item.reservationDate).format("MM/DD/YYYY"),
                    isReceived: item.isReceived ? "Yes" : "No",
                  }))}
                  columns={[
                    { field: "id", headerName: "Waitlist ID", width: 150 },
                    { field: "title", headerName: "Title", width: 230 },
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
                    {
                      field: "action",
                      headerName: "Actions",
                      width: 200,
                      renderCell: (params) => {
                        const [dialogOpen, setDialogOpen] =
                          React.useState(false);

                        const handleDialogOpen = () => setDialogOpen(true);
                        const handleDialogClose = () => setDialogOpen(false);

                        const handleConfirmRemove = () => {
                          handleRemoveItem(params.row.id);
                          setDialogOpen(false);
                        };

                        if (params.row.isReceived === "No") {
                          return (
                            <>
                              <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleDialogOpen}
                              >
                                Remove Item
                              </Button>
                              <Dialog
                                open={dialogOpen}
                                onClose={handleDialogClose}
                                aria-labelledby="remove-dialog-title"
                                aria-describedby="remove-dialog-description"
                              >
                                <DialogTitle id="remove-dialog-title">
                                  Confirm Removal
                                </DialogTitle>
                                <DialogContent>
                                  <DialogContentText id="remove-dialog-description">
                                    Are you sure you want to remove this item
                                    from the waitlist?
                                  </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                  <Button
                                    onClick={handleDialogClose}
                                    color="secondary"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={handleConfirmRemove}
                                    color="primary"
                                    autoFocus
                                  >
                                    Confirm
                                  </Button>
                                </DialogActions>
                              </Dialog>
                            </>
                          );
                        }
                        return null;
                      },
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
              <div
                className="filter-wrapper"
                style={{ display: "flex", alignItems: "center", gap: "25px" }}
              >
                <label className="filter-label">
                  Filter by Amount: ${filterAmount[0]} - ${filterAmount[1]}
                </label>
                <Box sx={{ width: 300, paddingTop: 2 }}>
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
                  rows={filteredFines.map((fine, index) => {
                    // Find the corresponding transaction to get the title
                    const transaction = profile.transactionHistory.find(
                      (t) => t.transactionId === fine.transactionId
                    );
                    return {
                      id: index, // DataGrid requires a unique `id` field
                      transactionId: fine.transactionId,
                      title: transaction?.title || "N/A", // Use the title from the transaction
                      amount: `$${fine.amount.toFixed(2)}`,
                      dueDate: fine.dueDate
                        ? dayjs(fine.dueDate).format("MM/DD/YYYY")
                        : "N/A",
                      issueDate: fine.issueDate
                        ? dayjs(fine.issueDate).format("MM/DD/YYYY")
                        : "N/A",
                      status: fine.paymentStatus ? "Paid" : "Unpaid",
                    };
                  })}
                  columns={[
                    {
                      field: "transactionId",
                      headerName: "Transaction ID",
                      width: 150,
                    },
                    {
                      field: "title",
                      headerName: "Title",
                      width: 200,
                    },
                    { field: "amount", headerName: "Amount", width: 150 },
                    { field: "dueDate", headerName: "Due Date", width: 175 },
                    {
                      field: "issueDate",
                      headerName: "Issue Date",
                      width: 175,
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

            {/* Pay Fines Button */}
            <Box
              sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}
            >
              <Button
                type="button"
                variant="contained"
                color="secondary"
                sx={{ width: "200px" }}
                onClick={handleDialogOpen}
              >
                Pay Fines
              </Button>
            </Box>

            {/* Pay Fines Dialog */}
            <Dialog
              open={isDialogOpen}
              onClose={handleDialogClose}
              aria-labelledby="pay-fines-dialog-title"
              aria-describedby="pay-fines-dialog-description"
            >
              <DialogTitle id="pay-fines-dialog-title">Pay Fines</DialogTitle>
              <DialogContent>
                <DialogContentText id="pay-fines-dialog-description">
                  Below is a list of your fines. Select the fines you want to
                  pay:
                </DialogContentText>
                <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Checkbox
                            checked={
                              selectedFines.length === filteredFines.length
                            }
                            indeterminate={
                              selectedFines.length > 0 &&
                              selectedFines.length < filteredFines.length
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedFines(
                                  filteredFines.map(
                                    (fine) => fine.fineId
                                  )
                                );
                              } else {
                                setSelectedFines([]);
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>Transaction ID</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dialogFines.map((fine) => {
                        const transaction = profile.transactionHistory.find(
                          (t) => t.transactionId === fine.transactionId
                        );
                        return (
                          <TableRow key={fine.transactionId}>
                            <TableCell>
                              <Checkbox
                                checked={selectedFines.includes(
                                  fine.fineId
                                )}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedFines((prev) => [
                                      ...prev,
                                      fine.fineId,
                                    ]);
                                  } else {
                                    setSelectedFines((prev) =>
                                      prev.filter(
                                        (id) => id !== fine.fineId
                                      )
                                    );
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell>{fine.transactionId}</TableCell>
                            <TableCell>{transaction?.title || "N/A"}</TableCell>
                            <TableCell>${fine.amount.toFixed(2)}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                {/* Total Amount */}
                <Typography
                  variant="h6"
                  sx={{ marginTop: 2, textAlign: "right", fontWeight: "bold" }}
                >
                  Total: $
                  {dialogFines
                    .filter((fine) =>
                      selectedFines.includes(fine.fineId)
                    )
                    .reduce((total, fine) => total + fine.amount, 0)
                    .toFixed(2)}
                </Typography>

                {/* Credit Card Information Fields */}
                <Box sx={{ marginTop: 3 }}>
                  <TextField
                    label="Credit Card Number"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    inputProps={{ maxLength: 16 }}
                    required
                  />
                  <TextField
                    label="Expiration Date (MM/YY)"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    inputProps={{ maxLength: 5 }}
                    required
                  />
                  <TextField
                    label="CVC"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    inputProps={{ maxLength: 3 }}
                    required
                  />
                  <TextField
                    label="Cardholder Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    required
                  />
                </Box>
                            {/* If there is an error, show the Snackbar/Alert right here */}
            {paymentError && (
              <Box sx={{ mt: 2, position: "relative" }}>
                <Alert
                  severity="error"
                  variant="filled"
                  onClose={() => setPaymentError("")}
                  sx={{ position: "absolute", width: "100%", zIndex: 2000 }}
                >
                  {paymentError}
                </Alert>
              </Box>
            )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDialogClose} color="secondary">
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    if (selectedFines.length === 0 || dialogFines.length === 0) {
                      setPaymentError("Please select at least one fine to pay.");
                      setPaymentSuccess(false); // Just in case
                      return;
                    }

                    try {
                      // 1. Update backend
                      await Promise.all(
                        selectedFines.map(async (fineId) => {
                          const fineToUpdate = dialogFines.find(f => f.fineId === fineId);
                          if (!fineToUpdate) return;

                          const updatedFine = { ...fineToUpdate, paymentStatus: true };
                          await fetch(
                            `${import.meta.env.VITE_API_BASE_URL}/api/Fine/${fineId}`,
                            {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify(updatedFine),
                            }
                          );
                        })
                      );

                      // 2. Update frontend state
                      if (profile) {
                        const updatedProfile = {
                          ...profile,
                          fines: profile.fines.map(fine =>
                            selectedFines.includes(fine.fineId)
                              ? { ...fine, paymentStatus: true }
                              : fine
                          )
                        };
                        setProfile(updatedProfile);

                        // 3. Recalculate filtered fines based on current filters
                        const newFiltered = updatedProfile.fines.filter(fine => {
                          const matchesStatus = filterStatus === "all" ||
                            (filterStatus === "paid" && fine.paymentStatus) ||
                            (filterStatus === "unpaid" && !fine.paymentStatus);
                          const matchesAmount = fine.amount >= filterAmount[0] &&
                            fine.amount <= filterAmount[1];
                          return matchesStatus && matchesAmount;
                        });
                        setFilteredFines(newFiltered);
                      }

                      setPaymentError("");          // Clear any previous error
                      setPaymentSuccess(true);      // Trigger success snackbar
                      setSelectedFines([]);
                      handleDialogClose();
                    } catch (error) {
                      setPaymentError("Payment failed. Please try again.");
                      setPaymentSuccess(false);
                    }
                  }}
                  color="primary"
                  autoFocus
                >
                  Pay Fines
                </Button>
              </DialogActions>
            </Dialog>


          {/* Payment Success Snackbar */}
          <Snackbar
            open={paymentSuccess}
            autoHideDuration={6000}
            onClose={() => setPaymentSuccess(false)}
            // anchorOrigin={{ vertical: "top", horizontal: "center" }}
            sx={{
              top: "50% !important",
              left: "50% !important",
              transform: "translate(-50%, -50%) !important",
              position: "fixed !important",
              zIndex: 1500,
            }}
          >
            <Alert
              severity="success"
              variant="filled"
              onClose={() => setPaymentSuccess(false)}
              sx={{ width: "100%" }}
            >
              <AlertTitle>Payment Successful</AlertTitle>
              Your fines have been paid successfully!
            </Alert>
          </Snackbar>
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

                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setChangePasswordDialogOpen(true)}
                >
                  Change Password
                </Button>
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

            {/* Change Password Dialog */}
            <Dialog
              open={changePasswordDialogOpen}
              onClose={handleChangePasswordDialogClose}
            >
              <DialogTitle>Change Password</DialogTitle>
              <DialogContent sx={{ position: "relative" }}>
                    {/* If there's an error, show the Snackbar right here */}
                    <Snackbar
                      open={Boolean(passwordError)}
                      // If you want it to stay until user closes it, remove autoHideDuration
                      autoHideDuration={6000}
                      onClose={() => setPasswordError("")}
                      // We won't use anchorOrigin to avoid putting it outside the container
                      // Instead we'll position it absolutely via sx styling.
                      sx={{
                        position: "absolute !important",
                        top: "8px !important",
                        left: "50% !important",
                        transform: "translateX(-50%) !important",
                        width: "auto !important",
                        zIndex: 2000
                      }}
                    >
                      <Alert
                        severity="error"
                        variant="filled"
                        onClose={() => setPasswordError("")}
                      >
                        {passwordError}
                      </Alert>
                    </Snackbar>
                <TextField
                  fullWidth
                  type="password"
                  label="Old Password"
                  name="oldPassword"
                  value={passwordForm.oldPassword}
                  onChange={handlePasswordChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  type="password"
                  label="New Password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  type="password"
                  label="Confirm New Password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  margin="normal"
                  error={passwordForm.newPassword !== passwordForm.confirmPassword}
                  helperText={passwordForm.newPassword !== passwordForm.confirmPassword && "Passwords do not match"}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setChangePasswordDialogOpen(false)}>Cancel</Button>
                <Button
                  onClick={handlePasswordSubmit}
                  color="primary"
                  disabled={
                    !passwordForm.oldPassword ||
                    !passwordForm.newPassword ||
                    passwordForm.newPassword !== passwordForm.confirmPassword
                  }
                >
                  Save
                </Button>
              </DialogActions>
            </Dialog>
                  <Snackbar
              open={settingsSuccess}
              autoHideDuration={6000}
              onClose={() => setSettingsSuccess(false)}
              // Optionally anchor it:
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              sx={{
                zIndex: 1500, // ensure it's on top
              }}
            >
              <Alert
                severity="success"
                variant="filled"
                sx={{ width: "100%" }}
                onClose={() => setSettingsSuccess(false)}
              >
                <AlertTitle>Success</AlertTitle>
                Settings Changed Successfully!
              </Alert>
            </Snackbar>

        
        <Snackbar
        open={passwordSuccess}
        autoHideDuration={6000}
        onClose={() => setPasswordSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          // You can override positioning styles here if desired.
          zIndex: 1500,
        }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setPasswordSuccess(false)}
          sx={{ width: "100%" }}
        >
          <AlertTitle>Success</AlertTitle>
          Your password has been updated successfully!
        </Alert>
      </Snackbar>
          </div>
        )}
        {/*waitlist offer*/}
        <Dialog
  open={openWaitlistConfirmationDialog || openWaitlistTimerFailureDialog}
  onClose={() => {
    if (waitlistItems.length > 0) {
      setShowExitWarningDialog(true); // User has pending confirmations
    } else {
      setOpenWaitlistConfirmationDialog(false);
      setOpenWaitlistTimerFailureDialog(false);
      window.location.reload();
    }
  }}
  maxWidth="md"
  fullWidth
>
  <DialogTitle>Waitlist Notifications</DialogTitle>
  <DialogContent dividers>

    {/* Valid waitlist items (still available) */}
    {waitlistItems.length > 0 && (
      <>
        <Typography variant="h6" gutterBottom>
          Books Available For Pickup
        </Typography>
        <DataGrid
          autoHeight
          rows={waitlistItems.map((item, index) => ({
            ...item,
            id: `valid-${index}`,
          }))}
          columns={columns}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
          sx={{ marginBottom: 4 }}
        />
      </>
    )}

    {/* Expired waitlist items */}
    {evilListItems.length > 0 && (
      <>
        <Typography variant="h6" gutterBottom>
          Expired Reservations
        </Typography>
        <DataGrid
          autoHeight
          rows={evilListItems.map((item, index) => ({
            ...item,
            id: `expired-${index}`,
          }))}
          columns={[
            { field: "notificationId", headerName: "ID", flex: 1 },
            { field: "title", headerName: "Title", flex: 1 },
            { field: "typeName", headerName: "Item Type", flex: 1 },
            { field: "expirationDate", headerName: "Expired On", flex: 1 },
          ]}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
        />
      </>
    )}

    {/* No items fallback */}
    {waitlistItems.length === 0 && evilListItems.length === 0 && (
      <Typography>No waitlist notifications at this time.</Typography>
    )}
  </DialogContent>
  <DialogActions>
    <Button
      onClick={() => {
        if (waitlistItems.length > 0) {
          setShowExitWarningDialog(true); // User has pending confirmations
        } else {
          setOpenWaitlistConfirmationDialog(false);
          setOpenWaitlistTimerFailureDialog(false);
          window.location.reload();
        }
      }}
      color="primary"
      variant="contained"
    >
      OK
    </Button>
  </DialogActions>
</Dialog>


{/*dialog showing a warning if they attempt to exit without closing correctly */}
<Dialog
  open={showExitWarningDialog}
  onClose={() => setShowExitWarningDialog(false)}
>
  <DialogTitle>Are you sure you want to exit?</DialogTitle>
  <DialogContent>
    <DialogContentText>
      You still have items available for pickup. Exiting without making a decision will forfeit your claim and pass the item to the next customer in line.
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setShowExitWarningDialog(false)} color="secondary">
      Cancel
    </Button>
    <Button
      onClick={async () => {
        try {
          await Promise.all(
            waitlistItems.map(async (item) => {
              const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/Waitlist/waitlist-reject/${item.notificationId}`,
                { method: "POST" }
              );
              if (!response.ok) {
                console.warn(`Failed to reject waitlist item ${item.notificationId}`);
              }
            })
          );
        } catch (error) {
          console.error("Error auto-rejecting waitlist items:", error);
        } finally {
          setShowExitWarningDialog(false);
          setOpenWaitlistConfirmationDialog(false);
          setOpenWaitlistTimerFailureDialog(false);
          window.location.reload(); // or call fetchWaitlistStatus();
        }
      }}
      color="primary"
      autoFocus
    >
      Yes, Exit Anyway
    </Button>
  </DialogActions>
</Dialog>


      </div>
    </div>
  );
}
