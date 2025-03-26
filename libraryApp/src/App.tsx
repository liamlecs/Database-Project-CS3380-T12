import "./App.css";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import FrontPage from "./components/FrontPage/FrontPage.tsx";
import EventsCalendar from "./components/EventsCalendar.tsx";
import LibraryHistory from "./components/LibraryHistory.tsx";
import NavBar from "./components/NavBar.tsx";
import CheckoutHistory from "./components/LiHistSubcomponents/CheckoutHistory.tsx";
import DonationHistory from "./components/LiHistSubcomponents/DonationHistory.tsx";
import FineHistory from "./components/LiHistSubcomponents/FineHistory.tsx";
import WaitlistHistory from "./components/LiHistSubcomponents/WaitlistHistory.tsx";
import EventHistory from "./components/LiHistSubcomponents/EventHistory.tsx";
import CustomerLoginPage from "./components/CustomerLoginPage.tsx";
import RegistrationPage from "./components/RegistrationPage.tsx";
import CreateEvent from "./components/CreateEvent.tsx";
import UserProfile from "./components/UserProfile.tsx";
import BookCheckOutPage from "./components/BookCheckoutPage/BookCheckOutPage.tsx";
import Donations from "./components/Donations.tsx"
import TermsAndConditionsPage from "./components/TermsAndConditionsPage.tsx";
import ConfirmEmail from "./components/ConfirmEmail.tsx";
import Employee from "./components/Employee.tsx";
import EmployeeLoginPage from "./components/EmployeeLoginPage.tsx";
import 'bootstrap/dist/css/bootstrap.min.css';

function AppRoutes() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check localStorage to persist session
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userId = localStorage.getItem("userId");

    if (isLoggedIn === "true" && userId) {
      // Optional: If you want to auto-redirect logged-in users to profile
      // navigate("/UserProfile");
      console.log("User is logged in:", userId);
    }
  }, []);

  return (
    <>
      <NavBar />
      <div className="container">
        <Routes>
          <Route path="/" element={<FrontPage />} />
          <Route path="/eventscalendar" element={<EventsCalendar />} />
          <Route path="/createevent" element={<CreateEvent />} />
          <Route path="/customer-login" element={<CustomerLoginPage />} />
          <Route path="/employee-login" element={<EmployeeLoginPage />} />
          <Route path="/registrationpage" element={<RegistrationPage />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/bookcheckout" element={<BookCheckOutPage />} />
          <Route path="/terms" element={<TermsAndConditionsPage />} />
          <Route path="/confirm" element={<ConfirmEmail />} />

          {/* Optional Nested Routes */}
          <Route path="/libraryhistory" element={<LibraryHistory />}>
            <Route path="checkouthistory" element={<CheckoutHistory />} />
            <Route path="donationhistory" element={<DonationHistory />} />
            <Route path="finehistory" element={<FineHistory />} />
            <Route path="waitlisthistory" element={<WaitlistHistory />} />
            <Route path="eventhistory" element={<EventHistory />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
