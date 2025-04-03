import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";

export default function Navbar() {
  const navigate = useNavigate();

  // Local state for login info and dropdown toggle
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  // On component mount, read login info from localStorage
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      setFirstName(localStorage.getItem("firstName") || "");
      setLastName(localStorage.getItem("lastName") || "");
      setEmail(localStorage.getItem("email") || "");
    }
  }, []);

  // Toggle the dropdown menu when avatar is clicked
  const toggleMenu = () => {
    if (isLoggedIn) {
      setShowMenu((prev) => !prev);
    } else {
      navigate("/customer-login");
    }
  };

  // Handle log out by clearing localStorage and navigating to login
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    localStorage.removeItem("userType");
    setIsLoggedIn(false);
    setShowMenu(false);
    // Force a full reload to ensure all components update their state
    window.location.href = "/customer-login";
    alert("Logged out successfully.");
  };

  return (
    <nav className="nav">
      {/* Left side: Site Title */}
      <Link to="/" className="site-title">
        E-Library
      </Link>

      {/* Middle: Navigation Links */}
      <ul>
        <li>
          <Link to="/eventscalendar">Event Calendar</Link>
        </li>

        {/* Only show these links if NOT logged in */}
        {!isLoggedIn && (
          <>
            <li>
              <Link to="/createevent">Create Event</Link>
            </li>
            <li>
              <Link to="/registrationpage">Registration</Link>
            </li>
            <li>
              <Link to="/customer-login">Customer Login</Link>
            </li>
            <li>
              <Link to="/employee-login">Employee Login</Link>
            </li>
          </>
        )}

        <li>
          <Link to="/bookcheckout">Book Checkout</Link>
        </li>
        <li>
          <Link to="/donations">Donate</Link>
        </li>
        <li>
              <Link to="/customerlookupreport">Customer Lookup Report</Link>
            </li>
      </ul>

      {/* Right side: User Avatar */}
      <div className="avatar-container" onClick={toggleMenu}>
        <div className="avatar-circle">
          {isLoggedIn && firstName ? firstName.charAt(0).toUpperCase() : "?"}
        </div>
        {showMenu && (
          <div className="avatar-dropdown">
            <p className="avatar-name">
              {firstName} {lastName}
            </p>
            <p className="avatar-email">{email}</p>
            <hr />
            <button onClick={handleLogout}>Sign Out</button>
          </div>
        )}
      </div>
    </nav>
  );
}
