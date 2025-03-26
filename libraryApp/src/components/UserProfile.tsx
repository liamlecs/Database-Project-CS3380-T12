import React from "react";
import { useEffect, useState } from "react";
import "./UserProfile.css";
import { useLocation, useNavigate } from "react-router-dom";

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
  checkedOutBooks: Array<{ title: string; dueDate: string }>; // List of checked-out books
  transactionHistory: Array<{
    transcationID: number;
    customerID: number;
    itemID: number;
    dateBorrowed: Date;
    dueDate: Date;
    returnDate: Date;
  }>;
  Waitlist: Array<{
    waitlistID: number;
    customerID: number;
    itemID: number;
    reserveDate: Date;
    isReceieved: boolean;
  }>;
}

export default function UserProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editProfile, setEditProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("account"); // Active tab for navigation
  const [waitlist, setWaitlist] = useState<
    Array<{ title: string; author: string; position: string }>
  >([]); // Waitlist state

  //Login Page functionality
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state;

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
          checkedOutBooks: [], // Replace with actual books if available in the API
          transactionHistory: [], // Replace with actual transactions if available in the API
          Waitlist: [], //Populate these whenever we have waitlist stuff
        };

        setProfile(mappedProfile);
        setEditProfile({ ...mappedProfile });

        // Fetch waitlist (mocked for now)
        // We can add this functionality later
        setWaitlist([
          {
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            position: "5",
          },
          { title: "1984", author: "George Orwell", position: "3" },
        ]);
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
                  // Add log out logic here
                  alert("Logged out successfully.");
                  navigate("/customer-login"); // Redirect to login page or handle logout logic
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
            <ul className="waitlist-list">
              {waitlist.map((item, index) => (
                <li key={index}>
                  <strong>{item.title}</strong> by {item.author}{" "}
                  <strong>Position </strong>
                  {item.position}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
