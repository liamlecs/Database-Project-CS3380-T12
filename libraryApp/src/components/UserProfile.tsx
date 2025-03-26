import React, { useEffect, useState } from "react";
import "./UserProfile.css";
import { useNavigate } from "react-router-dom";

interface Profile {
  customerID: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string; // e.g., "Customer"
  membershipStartDate: string;
  membershipEndDate: string | null;
  fines: number; 
  checkedOutBooks: Array<{ title: string; dueDate: string }>;
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
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [editProfile, setEditProfile] = useState<Profile | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("account");

  // For demonstration, we have a mock waitlist array
  const [waitlist, setWaitlist] = useState<
    Array<{ title: string; author: string; position: string }>
  >([]);

  // 1. Check if user is logged in. If not, redirect
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/customer-login");
    }
  }, [navigate]);

  // 2. Read userId from localStorage and fetch the profile
  useEffect(() => {
    async function fetchProfile() {
      try {
        // a) get userId from localStorage
        const userIdStr = localStorage.getItem("userId");
        if (!userIdStr) {
          // if no userId, redirect to login
          navigate("/customer-login");
          return;
        }
        // b) parse it
        const userIdNum = parseInt(userIdStr, 10);
        if (isNaN(userIdNum)) {
          // if parse fails, also redirect
          navigate("/customer-login");
          return;
        }

        // c) we assume "customer" for userType
        const userType = "customer";

        // d) call your GET /UserProfile/{type}/{id}
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/UserProfile/${userType}/${userIdNum}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();

        // e) Map the API response to your Profile structure
        const mappedProfile: Profile = {
          customerID: userIdNum,
          firstName: data.name.split(" ")[0],
          lastName: data.name.split(" ").slice(1).join(" "),
          email: data.email,
          password: data.password,
          role: data.role,
          membershipStartDate: data.memberSince,
          membershipEndDate: data.membershipExpires || null,
          fines: data.fines,
          checkedOutBooks: [],
          transactionHistory: [],
          Waitlist: [],
        };

        setProfile(mappedProfile);
        setEditProfile({ ...mappedProfile });

        // Example waitlist
        setWaitlist([
          {
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            position: "5",
          },
          {
            title: "1984",
            author: "George Orwell",
            position: "3",
          },
        ]);
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        setErrorMsg(error.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [navigate]);

  // Handle input changes when editing
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

  // Save changes
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editProfile) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/UserProfile/customer/${editProfile.customerID}`,
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

        {/* Transactions Tab */}
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

        {/* Waitlist Tab */}
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

        {/* Settings Tab */}
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
      </div>
    </div>
  );
}
