import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import FrontPage from './components/FrontPage.tsx';
import EventsCalendar from './components/EventsCalendar.tsx';
import LibraryHistory from './components/LibraryHistory.tsx';
import NavBar from './components/NavBar.tsx';

function App() {

  return (

    <Router>
      <NavBar />
      <Routes>
       <Route path="/" element={<FrontPage />} />
        <Route path="/eventscalendar" element={<EventsCalendar />} />
        <Route path="/libraryhistory" element={<LibraryHistory />} />
      </Routes>
    </Router>
        

  )
}

export default App
