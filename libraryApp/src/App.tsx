import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import ResetPasswordPage from "./components/ResetPasswordPage";
import DonationHistory from "./components/LiHistSubcomponents/DonationHistory.tsx";
import CheckoutHistory from "./components/LiHistSubcomponents/CheckoutHistory.tsx";
import EventHistory from "./components/LiHistSubcomponents/EventHistory.tsx";
import FineHistory from "./components/LiHistSubcomponents/FineHistory.tsx";
import WaitlistHistory from "./components/LiHistSubcomponents/WaitlistHistory.tsx";
import FrontPage from "./components/FrontPage/Library.tsx";
import EventsCalendar from "./components/EventsCalendar.tsx";
import LibraryHistory from "./components/LibraryHistory.tsx";
import CustomerLoginPage from "./components/CustomerLoginPage.tsx";
import RegistrationPage from "./components/RegistrationPage.tsx";
import CreateEvent from "./components/CreateEvent.tsx";
import UserProfile from "./components/UserProfile.tsx";
import ChangePassword from "./components/UserProfileSubPage/ChangePassword.tsx";
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
import Return from "./components/Return.tsx";
import RequestReactivation from "./components/RequestReactivation.tsx";
import ReactivateAccount from "./components/ReactivateAccount.tsx";
import Layout from "./components/Layout.tsx";
import ContactPage from "./components/ContactPage.tsx";
import AnimatedPage from "./components/AnimatedPage";
import { AnimatePresence } from "framer-motion";
import SingleLoginPage from "./components/LoginPage.tsx";

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <AnimatedPage>
                <FrontPage />
              </AnimatedPage>
            }
          />
          
          <Route
            path="eventscalendar"
            element={
              <AnimatedPage>
                <EventsCalendar />
              </AnimatedPage>
            }
          />
          <Route
            path="createevent"
            element={
              <AnimatedPage>
                <CreateEvent />
              </AnimatedPage>
            }
          />
          <Route
            path="login"
            element={
              <AnimatedPage>
                <SingleLoginPage />
              </AnimatedPage>
            }
          />
          <Route path="/ResetPassword" element={
              <AnimatedPage>
              <ResetPasswordPage />
              </AnimatedPage>
          } />
          <Route
            path="registrationpage"
            element={
              <AnimatedPage>
                <RegistrationPage />
              </AnimatedPage>
            }
          />
          <Route
            path="donations"
            element={
              <AnimatedPage>
                <Donations />
              </AnimatedPage>
            }
          />
          <Route
            path="employee"
            element={
              <AnimatedPage>
                <Employee />
              </AnimatedPage>
            }
          />
          <Route
            path="userprofile"
            element={
              <AnimatedPage>
                <UserProfile />
              </AnimatedPage>
            }/>
          <Route
            path="contact"
            element={
              <AnimatedPage>
                <ContactPage />
              </AnimatedPage>
            }
          />
          <Route
            path="bookcheckout"
            element={
              <AnimatedPage>
                <BookCheckOutPage />
              </AnimatedPage>
            }
          />
          <Route
            path="return"
            element={
              <AnimatedPage>
                <Return />
              </AnimatedPage>
            }
          />
          <Route
            path="reactivateaccount"
            element={
              <AnimatedPage>
                <ReactivateAccount />
              </AnimatedPage>
            }
          />
          <Route
            path="requestreactivation"
            element={
              <AnimatedPage>
                <RequestReactivation />
              </AnimatedPage>
            }
          />
          <Route
            path="terms"
            element={
              <AnimatedPage>
                <TermsAndConditionsPage />
              </AnimatedPage>
            }
          />
          <Route
            path="confirm"
            element={
              <AnimatedPage>
                <ConfirmEmail />
              </AnimatedPage>
            }
          />
          <Route
            path="reportsoutlet"
            element={
              <AnimatedPage>
                <ReportsOutlet />
              </AnimatedPage>
            }
          >
            <Route
              index
              element={
                <AnimatedPage>
                  <MasterTransactionReport />
                </AnimatedPage>
              }
            />
            <Route
              path="popularityreport"
              element={
                <AnimatedPage>
                  <PopularityReport />
                </AnimatedPage>
              }
            />
            <Route
              path="itemfinereport"
              element={
                <AnimatedPage>
                  <ItemFineReport />
                </AnimatedPage>
              }
            />
            <Route
              path="customerlookupreport"
              element={
                <AnimatedPage>
                  <CustomerLookupReport />
                </AnimatedPage>
              }
            />
            <Route
              path="mastertransactionreport"
              element={
                <AnimatedPage>
                  <MasterTransactionReport />
                </AnimatedPage>
              }
            />
          </Route>
          <Route
            path="libraryhistory"
            element={
              <AnimatedPage>
                <LibraryHistory />
              </AnimatedPage>
            }
          >
            <Route
              path="checkouthistory"
              element={
                <AnimatedPage>
                  <CheckoutHistory />
                </AnimatedPage>
              }
            />
            <Route
              path="donationhistory"
              element={
                <AnimatedPage>
                  <DonationHistory />
                </AnimatedPage>
              }
            />
            <Route
              path="finehistory"
              element={
                <AnimatedPage>
                  <FineHistory />
                </AnimatedPage>
              }
            />
            <Route
              path="waitlisthistory"
              element={
                <AnimatedPage>
                  <WaitlistHistory />
                </AnimatedPage>
              }
            />
            <Route
              path="eventhistory"
              element={
                <AnimatedPage>
                  <EventHistory />
                </AnimatedPage>
              }
            />
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
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
