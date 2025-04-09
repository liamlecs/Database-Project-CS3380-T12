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
//import InputLabel from "@mui/material/InputLabel";
//import jsPDF from "jspdf";

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

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
        item.itemId.toString().includes(searchQuery)
      ) || [];
    setFilteredWaitlists(filtered);
  }, [searchQuery, profile?.waitlists]);

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
            {(profile.transactionHistory || []).length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                {profile.transactionHistory.map((transaction, index) => (
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
                      <strong>Item ID "Change to Image of Item":</strong> {transaction.itemId}
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

            {/* Transaction History Table */}
            {profile.transactionHistory.length > 0 ? (
              <>
                <TableContainer
                  component={Paper}
                  style={{ maxHeight: "500px" }}
                >
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>Transaction ID</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Title</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Date Borrowed</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Due Date</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Return Date</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {profile.transactionHistory.map((transaction) => (
                        <TableRow key={transaction.transactionId}>
                          <TableCell>{transaction.transactionId}</TableCell>
                          <TableCell>{transaction.title}</TableCell>
                          <TableCell>
                            {new Date(
                              transaction.dateBorrowed
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {new Date(transaction.dueDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {transaction.returnDate
                              ? new Date(
                                  transaction.returnDate
                                ).toLocaleDateString()
                              : "Not Returned"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Generate Report Button */}
                <div style={{ marginTop: "20px", textAlign: "center" }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<SummarizeIcon />}
                    onClick={async () => {
                      // Logic to generate the report
                      alert("Report generation is not implemented yet.");
                      //await fetchTransactions();
                      //generatePDF();
                    }}
                  >
                    Generate Report
                  </Button>
                </div>
              </>
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
                label="Search by Item ID"
                variant="outlined"
                size="small"
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: "40%" }}
              />

              {/* Filter Dropdown with Label */}
              <div className="filter-wrapper">
                <label className="filter-label">Filter:</label>
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
            </div>

            {filteredWaitlists.length > 0 ? (
              <TableContainer component={Paper} style={{ maxHeight: "500px" }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Waitlist ID</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Title</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Reservation Date</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Is Received</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredWaitlists.map((item) => (
                      <TableRow key={item.waitlistId}>
                        <TableCell>{item.waitlistId}</TableCell>
                        <TableCell>{item.title}</TableCell>
                        <TableCell>
                          {new Date(item.reservationDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{item.isReceived ? "Yes" : "No"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <p>No items in the waitlist.</p>
            )}
          </div>
        )}

        {/* Fines Tab */}
        {activeTab === "fines" && (
          <div className="profile-section">
            <h3>Fines</h3>
            {profile.fines.length > 0 ? (
              <TableContainer component={Paper} style={{ maxHeight: "500px" }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Transaction ID</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Amount</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Due Date</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Issue Date</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Status</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {profile.fines.map((fines, index) => (
                      <TableRow key={index}>
                        <TableCell>{fines.transactionId}</TableCell>
                        <TableCell>${fines.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          {fines.dueDate
                            ? new Date(fines.dueDate).toLocaleDateString()
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {fines.issueDate
                            ? new Date(fines.issueDate).toLocaleDateString()
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {fines.status ? "Paid" : "Unpaid"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <p>No fines to display.</p>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="profile-section">
            <h3>Account Settings</h3>
            <form onSubmit={handleSave}>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  label="First Name"
                  variant="outlined"
                  id="firstName"
                  name="firstName"
                  value={editProfile?.firstName || ""}
                  onChange={handleInputChange}
                  fullWidth
                />
                <TextField
                  label="Last Name"
                  variant="outlined"
                  id="lastName"
                  name="lastName"
                  value={editProfile?.lastName || ""}
                  onChange={handleInputChange}
                  fullWidth
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ width: "200px", alignSelf: "center" }}
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

            {/* Only render ChangePassword route if user is on that exact path */}
            {location.pathname === "/userprofile/changepassword" && <Outlet />}
          </div>
        )}
      </div>
    </div>
  );
}
