import { Link, useMatch, useResolvedPath } from "react-router-dom"

export default function Navbar() {
  return (
    <nav className="nav">
      <Link to="/" className="site-title">
        Front Page
      </Link>
      <ul>
        <li>
        <Link to="EventsCalendar">Event Calendar</Link>
        </li><li>
        <Link to="LibraryHistory">Library History</Link>
        </li>
        <li>
          <Link to="LoginPage">Login</Link>
        </li>
        <li>
          <Link to="RegistrationPage" >Signup</Link>
        </li>
      </ul>
    </nav>
  )
}
