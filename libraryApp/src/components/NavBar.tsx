import { Link, useMatch, useResolvedPath } from "react-router-dom"

export default function Navbar() {
  return (
    <nav className="nav">
      <Link to="/" className="site-title">
        E-Library
      </Link>
      <ul>
        <li>
        <Link to="EventsCalendar">Event Calendar</Link>
        </li>
        <li>
          <Link to = "CreateEvent">Create Event</Link>
        </li>
        <li>
          <Link to="customer-login">Customer Login</Link>
        </li>
        <li>
          <Link to="employee-login">Employee Login</Link>
        </li>
        <li>
          <Link to="RegistrationPage" >Registration</Link>
        </li>
        <li>
          <Link to = "bookcheckout">Book Checkout</Link>
        </li>
        <li>
          <Link to = "Donations">Donate</Link>
        </li>
      </ul>
    </nav>
  )
}
