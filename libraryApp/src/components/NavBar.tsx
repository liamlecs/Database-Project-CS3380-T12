  import React, { useState, useEffect } from "react";
  import { Link, useNavigate } from "react-router-dom";
  import "./NavBar.css";

  export default function Navbar() {
    const navigate = useNavigate();

    // Local state for login info and dropdown toggle
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isEmployeeLoggedIn, setIsEmployeeLoggedIn] = useState(false);
    const [employeeFirstName, setEmployeeFirstName] = useState("");
    const [employeeLastName, setEmployeeLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [showMenu, setShowMenu] = useState(false);

    // On component mount, read login info from localStorage
    useEffect(() => {
      // Check if the employee is logged in
      const employeeLoggedIn = localStorage.getItem("isEmployeeLoggedIn") === "true";
      setIsEmployeeLoggedIn(employeeLoggedIn);
      if (employeeLoggedIn) {
        setEmployeeFirstName(localStorage.getItem("employeeFirstName") || "");
        setEmployeeLastName(localStorage.getItem("employeeLastName") || "");
      }


      // Check if the user is logged in
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
      // Check if the user is logged in before toggling the menu
      if (isLoggedIn || isEmployeeLoggedIn) {
        setShowMenu((prev) => !prev);
      } else {
        navigate("/customer-login");
      }
    };

    // Handle log out by clearing localStorage and navigating to login
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
      // Force a full reload to ensure all components update their state
      window.location.href = "/customer-login";
      alert("Logged out successfully.");
    };

    return (
      <nav className="nav">
        {/* Left side: Site Title */}
        <Link to="/" className="site-title">
          E-Library @ UH
        </Link>

        {/* Middle: Navigation Links */}
        <ul>
          <li>
            <Link to="/eventscalendar">Event Calendar</Link>
          </li>

          {/* Only show these links if NOT customer or employee logged in */}
          {!isLoggedIn && !isEmployeeLoggedIn && (
            <>
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


          {/* Only show these links if customer logged in */}
          {isLoggedIn && (
            <>
              <li>
                <Link to="/bookcheckout">Book Checkout</Link>
              </li>
              <li>
                <Link to="/UserProfile">User Profile</Link>
              </li>
              <li>
                <Link to="/return">Return</Link>
              </li>
            </>
          )}

          {/* Only show these links if employee logged in */}
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

          {/* Always show these links unless employee logged in*/}
          {!isEmployeeLoggedIn && ( 
            <>
            <li>
              <Link to="/donations">Donate</Link>
            </li>
            <li>
              <Link to="/requestreactivation">Request Reactivation</Link>
            </li>
            </>
          )}
          
        </ul>

        {/* Right side: User Avatar */}
        <div className="avatar-container" onClick={toggleMenu}>
          <div className="avatar-circle">
            {localStorage.getItem("isEmployeeLoggedIn") === "true" && localStorage.getItem("employeeFirstName")
              ? localStorage.getItem("employeeFirstName")?.charAt(0).toUpperCase()
              : localStorage.getItem("isLoggedIn") === "true" && localStorage.getItem("firstName")
                ? localStorage.getItem("firstName")?.charAt(0).toUpperCase()
                : "?"
            }
          </div>
          {showMenu && (
            <div className="avatar-dropdown">
              <p className="avatar-name">
                {localStorage.getItem("isEmployeeLoggedIn") === "true"
                  ? `${localStorage.getItem("employeeFirstName") || ''} ${localStorage.getItem("employeeLastName") || ''}`
                  : `${localStorage.getItem("firstName") || ''} ${localStorage.getItem("lastName") || ''}`
                }
              </p>
              {localStorage.getItem("isEmployeeLoggedIn") !== "true" && 
                <p className="avatar-email">{localStorage.getItem("email") || ''}</p>
              }
              <hr />
              <button onClick={handleLogout}>Sign Out</button>
            </div>
          )}
      </div>
      </nav>
    );
  }
