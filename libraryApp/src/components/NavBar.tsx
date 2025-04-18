import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/library-logo.png";
import "./NavBar.css";
import { useCheckout } from "../contexts/CheckoutContext";

const NavBar: React.FC = React.memo(function NavBar() {
  const navigate = useNavigate();
  const { cart } = useCheckout();

  // Initialize state directly from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("isLoggedIn") === "true");
  const [isEmployeeLoggedIn, setIsEmployeeLoggedIn] = useState(() => localStorage.getItem("isEmployeeLoggedIn") === "true");
  const [employeeFirstName, setEmployeeFirstName] = useState(() => localStorage.getItem("employeeFirstName") || "");
  const [employeeLastName, setEmployeeLastName] = useState(() => localStorage.getItem("employeeLastName") || "");
  const [firstName, setFirstName] = useState(() => localStorage.getItem("firstName") || "");
  const [lastName, setLastName] = useState(() => localStorage.getItem("lastName") || "");
  const [email, setEmail] = useState(() => localStorage.getItem("email") || "");
  const [showMenu, setShowMenu] = useState(false);

  // Optionally, keep the effect to update state if localStorage can change during the app lifecycle
  useEffect(() => {
    const employeeLoggedIn = localStorage.getItem("isEmployeeLoggedIn") === "true";
    setIsEmployeeLoggedIn(employeeLoggedIn);
    if (employeeLoggedIn) {
      setEmployeeFirstName(localStorage.getItem("employeeFirstName") || "");
      setEmployeeLastName(localStorage.getItem("employeeLastName") || "");
    }

    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      setFirstName(localStorage.getItem("firstName") || "");
      setLastName(localStorage.getItem("lastName") || "");
      setEmail(localStorage.getItem("email") || "");
    }
  }, []);

  const toggleMenu = () => {
    if (isLoggedIn || isEmployeeLoggedIn) {
      setShowMenu((prev) => !prev);
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("isEmployeeLoggedIn");
    localStorage.removeItem("employeeFirstName");
    localStorage.removeItem("employeeLastName");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    localStorage.removeItem("employeeId");
    localStorage.removeItem("userType");
    setIsLoggedIn(false);
    setShowMenu(false);
    setIsEmployeeLoggedIn(false);
    window.location.href = "/login";
    alert("Logged out successfully.");
  };

  return (
    <nav className="nav">
      <Link to="/" className="site-title">
        <img src={logo} className="nav-logo" alt="E-Library Logo" />
        E-Library @ UH
      </Link>
      <ul>
        <li>
          <Link to="/eventscalendar">Event Calendar</Link>
        </li>
        {!isLoggedIn && !isEmployeeLoggedIn && (
          <>
            <li>
              <Link to="/registrationpage">Registration</Link>
            </li>
            <li>
              <Link to="/login">Login Page</Link>
            </li>
            <li>
              <Link to="/requestreactivation">Request Reactivation</Link>
            </li>
          </>
        )}
        {isLoggedIn && (
          <>
            <li>
              <Link to="/bookcheckout">Cart ({cart.length})</Link>
            </li>
            <li>
              <Link to="/UserProfile">User Profile</Link>
            </li>
          </>
        )}
        {isEmployeeLoggedIn && !isLoggedIn && (
          <>
            <li>
              <Link to="/reportsoutlet">Reports Outlet</Link>
            </li>
            <li>
              <Link to="/Employee">Employee Dashboard</Link>
            </li>
          </>
        )}
        {!isEmployeeLoggedIn && (
          <>
          <li>
            <Link to="/donations">Donate</Link>
          </li>
          <li>
            <Link to="/contact">Contact Us</Link>
          </li>
          </>
        )}

      </ul>
      <div className="avatar-container" onClick={toggleMenu}>
        <div className="avatar-circle">
          {isEmployeeLoggedIn && employeeFirstName
            ? employeeFirstName.charAt(0).toUpperCase()
            : isLoggedIn && firstName
            ? firstName.charAt(0).toUpperCase()
            : "?"}
        </div>
        {showMenu && (
          <div className="avatar-dropdown">
            <p className="avatar-name">
              {isEmployeeLoggedIn
                ? `${employeeFirstName} ${employeeLastName}`
                : `${firstName} ${lastName}`}
            </p>
            {!isEmployeeLoggedIn && <p className="avatar-email">{email}</p>}
            <hr />
            <button onClick={handleLogout}>Sign Out</button>
          </div>
        )}
      </div>
    </nav>
  );
});

export default NavBar;