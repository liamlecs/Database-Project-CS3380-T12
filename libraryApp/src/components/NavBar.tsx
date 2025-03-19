import { Link, useMatch, useResolvedPath } from "react-router-dom"

export default function Navbar() {
  return (
    <nav className="nav">
      <Link to="/" className="site-title">
        Front Page
      </Link>
      <ul>
        <li>
        <a href="EventsCalendar">Event Calendar</a>
        </li><li>
        <a href="LibraryHistory">Library History</a>
        </li>
      </ul>
    </nav>
  )
}