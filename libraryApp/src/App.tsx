import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import FrontPage from './components/FrontPage.tsx';
import EventsCalendar from './components/EventsCalendar.tsx';
import LibraryHistory from './components/LibraryHistory.tsx';
import NavBar from './components/NavBar.tsx';
import { StrictMode } from 'react';
import CheckoutHistory from './components/LiHistSubcomponents/CheckoutHistory.tsx';
import DonationHistory from './components/LiHistSubcomponents/DonationHistory.tsx';
import FineHistory from './components/LiHistSubcomponents/FineHistory.tsx';
import WaitlistHistory from './components/LiHistSubcomponents/WaitlistHistory.tsx';
import EventHistory from './components/LiHistSubcomponents/EventHistory.tsx';

function App() {

  return (

    <Router>
      <NavBar />
      <div className="container">
      <Routes>
       <Route path="/" element={<FrontPage />} />
        <Route path="/eventscalendar" element={<EventsCalendar />} />
        <Route path="/libraryhistory" element={<LibraryHistory />} >
          <Route path="checkouthistory" element={<CheckoutHistory />} />
          <Route path="donationhistory" element={<DonationHistory />} />
          <Route path="finehistory" element={<FineHistory />} />
          <Route path="waitlisthistory" element={<WaitlistHistory />} />
          <Route path="eventhistory" element={<EventHistory />} />
          </Route>
      </Routes>
      </div>
    </Router>
        

  )
}

export default App
