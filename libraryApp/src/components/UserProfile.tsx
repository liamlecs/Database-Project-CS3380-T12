import React from "react";
import { useEffect, useState } from "react";
import "./UserProfile.css";
import { useLocation, useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
//import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
//import InputLabel from "@mui/material/InputLabel";

interface Profile {
  customerID: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string; // e.g., "Customer"
  membershipStartDate: string;
  membershipEndDate: string | null;

  //Future things to display
  fines: number; // User's total fines
  //checkedOutBooks: Array<{ title: string; dueDate: string }>; // List of checked-out books
  transactionHistory: Array<{
    transcationID: number;
    customerID: number;
    itemID: number;
    dateBorrowed: Date;
    dueDate: Date;
    returnDate: Date;
  }>;
  waitlists: Array<{
    waitlistId: number;
    customerId: number;
    itemId: number;
    reservationDate: Date;
    isReceived: boolean;
  }>;
}

export default function UserProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editProfile, setEditProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("account"); // Active tab for navigation
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredWaitlists, setFilteredWaitlists] = useState<Profile["waitlists"]>([]);
  const [filterDays, setFilterDays] = useState<number>(0);

  //Login Page functionality
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state;
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/customer-login");
    }
  }, []);
  

  useEffect(() => {
    async function fetchProfile() {
      try {
        //Integrate with Customer and Emplyoee authentication
        //For now loads a default customer in the DB with userID = 2.
        const userType = "customer";

        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/UserProfile/${userType}/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();

        console.log("API Response:", data);


        // Map API fields to your Profile interface if needed
        //Mapping Customer Fields to the fetch request
        const mappedProfile: Profile = {
          customerID: userId,
          firstName: data.name.split(" ")[0],
          lastName: data.name.split(" ").slice(1).join(" "),
          email: data.email,
          password: data.password,
          role: data.role,
          membershipStartDate: data.memberSince,
          membershipEndDate: data.membershipExpires || null,
          fines: data.fines, // Replace with actual fines if available in the API
          //checkedOutBooks: [], // Replace with actual books if available in the API
          transactionHistory: [], // Replace with actual transactions if available in the API
          waitlists: data.waitList || [] //Populate these whenever we have waitlist stuff
        };

        setProfile(mappedProfile);
        setEditProfile({ ...mappedProfile });
        setFilteredWaitlists(data.waitList || []);

        // Fetch waitlist (mocked for now)
        // We can add this functionality later
        {/*setWaitlist([
          {
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            position: "5",
          },
          { title: "1984", author: "George Orwell", position: "3" },
        ]);*/}
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        setErrorMsg(error.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editProfile) return;
    setEditProfile({
      ...editProfile,
      [e.target.name]: e.target.value,
    });
  };

  //Editing Customer Fields
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editProfile) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/UserProfile/customer/${
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
      setEditingField(null); // Stop editing after save
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
    const filtered = profile?.waitlists.filter((item) => new Date(item.reservationDate) >= last30Days) || [];
    setFilteredWaitlists(filtered);
  };

  const handleFilterDaysChange = (days: number) => {
    setFilterDays(days);
    const now = new Date();
    const filtered = profile?.waitlists.filter((item) => {
      const reservationDate = new Date(item.reservationDate);
      return days === 0 || reservationDate >= new Date(now.setDate(now.getDate() - days));
    }) || [];
    setFilteredWaitlists(filtered);
  };

  useEffect(() => {
    const filtered = profile?.waitlists.filter((item) =>
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
                className={activeTab === "settings" ? "active" : ""}
                onClick={() => handleTabChange("settings")}
              >
                Account Settings
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <div className="profile-content">
        {activeTab === "account" && (
          <div className="profile-section">
            <h3>My Account</h3>
            <div className="profile-item">
              <span>
                <strong>Name:</strong>
              </span>
              <span>
                {profile.firstName} {profile.lastName}
              </span>
            </div>
            <div className="profile-item">
              <span>
                <strong>Email:</strong>
              </span>
              <span>{profile.email}</span>
            </div>
            <div className="profile-item">
              <span>
                <strong>Role:</strong>
              </span>
              <span>{profile.role}</span>
            </div>
            <div className="profile-item">
              <span>
                <strong>Membership Start Date:</strong>
              </span>
              <span>
                {new Date(profile.membershipStartDate).toLocaleDateString()}
              </span>
            </div>
            {profile.membershipEndDate && (
              <div className="profile-item">
                <span>
                  <strong>Membership End Date:</strong>
                </span>
                <span>
                  {new Date(profile.membershipEndDate).toLocaleDateString()}
                </span>
              </div>
            )}
            {/* Add Delete Account and Log Out buttons */}
            <div className="account-actions">
              <button
                className="btn-delete"
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete your account? This action cannot be undone."
                    )
                  ) {
                    // Add delete account logic here
                    alert("Account deleted successfully.");
                  }
                }}
              >
                Delete Account
              </button>
              <button
                className="btn-logout"
                onClick={() => {
                  localStorage.removeItem("isLoggedIn");
                  localStorage.removeItem("userId");
                  localStorage.removeItem("userType");
                  alert("Logged out successfully.");
                  navigate("/customer-login");
                }}                
              >
                Log Out
              </button>
            </div>
          </div>
        )}

        {activeTab === "transactions" && (
          <div className="profile-section">
            <h3>Transaction History</h3>
            <ul className="transaction-history-list">
              {profile.transactionHistory.map((transaction, index) => (
                <li key={index}>
                  <strong>{transaction.customerID}</strong>
                  <br />
                  Date: {new Date(transaction.dueDate).toLocaleDateString()}
                  <br />
                  TransactionID: ${transaction.transcationID.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="profile-section">
            <h3>Account Settings</h3>
            <form onSubmit={handleSave}>
              <div className="profile-item">
                <label htmlFor="firstName">
                  <strong>First Name:</strong>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={editProfile?.firstName || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="profile-item">
                <label htmlFor="lastName">
                  <strong>Last Name:</strong>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={editProfile?.lastName || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="profile-item">
                <label htmlFor="email">
                  <strong>Email:</strong>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={editProfile?.email || ""}
                  readOnly
                />
              </div>
              <div className="profile-item">
                <label htmlFor="password">
                  <strong>Password:</strong>
                </label>
                <input
                  type="text"
                  id="password"
                  name="password"
                  value={editProfile?.password || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </form>
          </div>
        )}

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
                    onChange={(e) => handleFilterDaysChange(e.target.value as number)}
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
                      <TableCell><strong>Waitlist ID</strong></TableCell>
                      <TableCell><strong>Customer ID</strong></TableCell>
                      <TableCell><strong>Item ID</strong></TableCell>
                      <TableCell><strong>Reservation Date</strong></TableCell>
                      <TableCell><strong>Is Received</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredWaitlists.map((item) => (
                      <TableRow key={item.waitlistId}>
                        <TableCell>{item.waitlistId}</TableCell>
                        <TableCell>{item.customerId}</TableCell>
                        <TableCell>{item.itemId}</TableCell>
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
      </div>
    </div>
  );
}
