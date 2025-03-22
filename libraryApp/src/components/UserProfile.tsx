import type React from "react";
import { useEffect, useState } from "react";

interface Profile {
  customerID: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string; // e.g., "Customer"
  membershipStartDate: string;
  membershipEndDate: string | null;
}

export default function UserProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [editProfile, setEditProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // 1️⃣ Fetch the user’s profile data from your API when component mounts
  useEffect(() => {
    async function fetchProfile() {
      try {
        const userId = 2; // Replace with dynamic logic later if needed
        const userType = "customer";
    
        const response = await fetch(`http://localhost:5217/UserProfile/${userType}/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
    
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
    
        const data = await response.json();
    
        // Map API fields to your Profile interface if needed
        const mappedProfile: Profile = {
          customerID: userId,
          firstName: data.name.split(" ")[0],
          lastName: data.name.split(" ").slice(1).join(" "),
          email: data.email,
          role: data.role,
          membershipStartDate: data.memberSince,
          membershipEndDate: data.membershipExpires || null,
        };
    
        setProfile(mappedProfile);
        setEditProfile({ ...mappedProfile });
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        setErrorMsg(error.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    }
  
    fetchProfile();
  }, []);

  // 2️⃣ Handle changes in input fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editProfile) return; // safety check
    setEditProfile({
      ...editProfile,
      [e.target.name]: e.target.value,
    });
  };

  // 3️⃣ Handle form submission to save changes
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editProfile) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/UserProfile/customer/${editProfile.customerID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editProfile),
      });
      

      if (!response.ok) {
        throw new Error("Failed to update profile data");
      }

      // If the update is successful, update local state
      setProfile(editProfile);
      setEditing(false);
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setErrorMsg(error.message || "An error occurred while updating profile.");
    }
  };

  if (loading) {
    return <div className="container mt-5">Loading profile...</div>;
  }

  if (errorMsg) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{errorMsg}</div>
      </div>
    );
  }

  if (!profile) {
    return <div className="container mt-5">No profile data found.</div>;
  }

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2 className="text-center mb-4">User Profile</h2>

      {/* Display Profile Details */}
      <div className="card mb-4">
        <div className="card-body">
          <h3>
            {profile.firstName} {profile.lastName}
          </h3>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Role:</strong> {profile.role}
          </p>
          <p>
            <strong>Member Since:</strong>{" "}
            {new Date(profile.membershipStartDate).toLocaleDateString()}
          </p>
          {profile.membershipEndDate && (
            <p>
              <strong>Membership Expires:</strong>{" "}
              {new Date(profile.membershipEndDate).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Toggle between Edit Form and Edit Button */}
      {editing ? (
        <div className="card">
          <div className="card-header">Edit Profile</div>
          <div className="card-body">
            <form onSubmit={handleSave}>
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="form-control"
                  value={editProfile?.firstName || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="lastName" className="form-label">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="form-control"
                  value={editProfile?.lastName || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  value={editProfile?.email || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {/* Add more fields (e.g., membershipEndDate) if needed */}
              <button type="submit" className="btn btn-primary w-100">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      ) : (
        // biome-ignore lint/a11y/useButtonType: <explanation>
<button
          className="btn btn-secondary w-100"
          onClick={() => {
            setEditProfile({ ...profile });
            setEditing(true);
          }}
        >
          Edit Profile
        </button>
      )}
    </div>
  );
}
