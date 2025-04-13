import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import FrontPage from "./components/FrontPage/Library.tsx";
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
import BookCheckOutPage from "./components/CheckoutPage/Checkout.tsx";
import Donations from "./components/Donations.tsx";
import TermsAndConditionsPage from "./components/TermsAndConditionsPage.tsx";
import ConfirmEmail from "./components/ConfirmEmail.tsx";
import Employee from "./components/Employee.tsx";
import EmployeeLoginPage from "./components/EmployeeLoginPage.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import PopularityReport from "./components/Reports/PopularityReport.tsx";
import ItemFineReport from "./components/Reports/ItemFineReport.tsx";
import CustomerLookupReport from "./components/Reports/CustomerLookupReport.tsx";
import ReportsOutlet from "./components/ReportsOutlet.tsx";
import { CheckoutProvider } from "./contexts/CheckoutContext.tsx";
import MasterTransactionReport from "./components/Reports/MasterTransactionReport.tsx";
import ChangePassword from "./components/UserProfileSubPage/ChangePassword.tsx";
import Return from "./components/Return.tsx";
import RequestReactivation from "./components/RequestReactivation.tsx";
import ReactivateAccount from "./components/ReactivateAccount.tsx";
import Layout from "./components/Layout.tsx";
import ContactPage from './components/ContactPage.tsx';

function AppRoutes() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check localStorage to persist session
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userId = localStorage.getItem("userId");

    if (isLoggedIn === "true" && userId) {
      console.log("User is logged in:", userId);
    }
  }, []);

  return (
    // All routes are nested inside the Layout so every page gets the NavBar and Footer.
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<FrontPage />} />
        <Route path="eventscalendar" element={<EventsCalendar />} />
        <Route path="createevent" element={<CreateEvent />} />
        <Route path="customer-login" element={<CustomerLoginPage />} />
        <Route path="employee-login" element={<EmployeeLoginPage />} />
        <Route path="registrationpage" element={<RegistrationPage />} />
        <Route path="donations" element={<Donations />} />
        <Route path="employee" element={<Employee />} />
        <Route path="userprofile" element={<UserProfile />}>
          <Route path="changepassword" element={<ChangePassword />} />
        </Route>
        <Route path="contact" element={<ContactPage />} />
        <Route path="bookcheckout" element={<BookCheckOutPage />} />
        <Route path="return" element={<Return />} />
        <Route path="reactivateaccount" element={<ReactivateAccount />} />
        <Route path="requestreactivation" element={<RequestReactivation />} />
        <Route path="terms" element={<TermsAndConditionsPage />} />
        <Route path="confirm" element={<ConfirmEmail />} />
        <Route path="reportsoutlet" element={<ReportsOutlet />}>
          <Route path="popularityreport" element={<PopularityReport />} />
          <Route path="itemfinereport" element={<ItemFineReport />} />
          <Route path="customerlookupreport" element={<CustomerLookupReport />} />
          <Route path="mastertransactionreport" element={<MasterTransactionReport />} />
        </Route>
        <Route path="libraryhistory" element={<LibraryHistory />}>
          <Route path="checkouthistory" element={<CheckoutHistory />} />
          <Route path="donationhistory" element={<DonationHistory />} />
          <Route path="finehistory" element={<FineHistory />} />
          <Route path="waitlisthistory" element={<WaitlistHistory />} />
          <Route path="eventhistory" element={<EventHistory />} />
        </Route>
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <CheckoutProvider>
        <AppRoutes />
      </CheckoutProvider>
    </Router>
  );
}

export default App;
