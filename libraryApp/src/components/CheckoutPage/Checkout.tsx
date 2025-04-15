import React, { useState } from "react";
import { useCheckout } from "../../contexts/CheckoutContext";
import "./Checkout.css";
import { Snackbar, Alert, AlertTitle } from "@mui/material";
import { SnackbarCloseReason } from "@mui/material/Snackbar";


const CheckoutPage: React.FC = () => {
  const { cart, userType, removeFromCart, clearCart } = useCheckout();

  // Retrieve borrowerTypeId from localStorage (Student = "1", Faculty = "2")
  const borrowerTypeId = localStorage.getItem("borrowerTypeId");

  // Set loan period based on borrowerTypeId:
  let loanPeriod = borrowerTypeId === "2" ? 14 : 7; // Faculty gets 14 days, Student gets 7 days

  // Compute checkout date and due date (format "yyyy-MM-dd")
  const now = new Date();
  const checkoutDate = now.toISOString().split("T")[0];
  const dueDateObj = new Date(now);
  dueDateObj.setDate(now.getDate() + loanPeriod);
  const dueDateStr = dueDateObj.toISOString().split("T")[0];

  // For nicer error messaging via Snackbar
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // New success state
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const handleSuccessClose = (
    event: React.SyntheticEvent<Element, Event> | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") return;
    setCheckoutSuccess(false);
  };

  const handleSnackbarClose = (
    event: React.SyntheticEvent<Element, Event> | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
    setCheckoutError(null);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setCheckoutError("Your cart is empty.");
      setSnackbarOpen(true);
      return;
    }
  
    const customerId = localStorage.getItem("userId");
    if (!customerId) {
      setCheckoutError("Error: User is not logged in.");
      setSnackbarOpen(true);
      return;
    }
  
    try {
      // Fetch the user's transaction history
      const transactionHistoryResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/TransactionHistory/${customerId}`
      );
  
      let activeTransactions: any[] = [];
  
      if (transactionHistoryResponse.status === 404 || transactionHistoryResponse.status === 204) {
        activeTransactions = [];
      } else if (!transactionHistoryResponse.ok) {
        const errorText = await transactionHistoryResponse.text();
        throw new Error(`Failed to fetch transaction history: ${errorText}`);
      } else {
        activeTransactions = await transactionHistoryResponse.json();
      }
  
      // Count active transactions (items not returned)
      const activeItemCount = activeTransactions.filter(
        (transaction: { returnDate: string | null }) => transaction.returnDate === null
      ).length;
  
      //calculate current waitlist entries
      const customerEmail = localStorage.getItem("email");

      const waitlistResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/Waitlist/CustomerWaitlists/${customerEmail}`
      );

      let activeWaitlists: any[] = [];

      if (waitlistResponse.status === 404 || waitlistResponse.status === 204) {
        activeWaitlists = [];
      } else if (!waitlistResponse.ok) {
        const errorText = await waitlistResponse.text();
        throw new Error(`Failed to fetch waitlist history: ${errorText}`);
      } else {
        activeWaitlists = await waitlistResponse.json();
      }

      const activeWaitlistCount = activeWaitlists.filter(
        (waitlist: { waitlistPosition: number | null }) => waitlist.waitlistPosition !== -1
      ).length;

      const totalItemsAfterCheckout = activeItemCount + cart.length + activeWaitlistCount;
  
      // Determine borrowing limit (Student = 5, Faculty = 10)
      const borrowingLimit = borrowerTypeId === "2" ? 10 : 5;
  
      if (totalItemsAfterCheckout > borrowingLimit) {
        const overBy = totalItemsAfterCheckout - borrowingLimit;
        setCheckoutError(
          `You cannot check out these ${cart.length} item(s) because that would exceed your limit of ${borrowingLimit}. ` +
          `You currently have ${activeItemCount} item(s) checked out and ${activeWaitlistCount} item(s) waitlisted. Adding these ${cart.length} brings you to ${totalItemsAfterCheckout}. ` +
          `Please remove at least ${overBy} item(s) from your cart, return some items, or exit from waitlists first.`
        );
        setSnackbarOpen(true);
        return;
      }
  
      // Process each item in the cart
      for (const item of cart) {
        // 1. Update available copies (subtract one)
        const updateResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/Item/update-copies`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              itemId: item.ItemID,
              changeInCopies: -1,
            }),
          }
        );
        if (!updateResponse.ok) {
          const errorText = await updateResponse.text();
          throw new Error(`Failed to update Item ${item.ItemID}: ${errorText}`);
        }
  
        // 2. Create a transaction record
        const transactionRecord = {
          CustomerId: parseInt(customerId, 10),
          ItemId: item.ItemID,
          DateBorrowed: checkoutDate,
          DueDate: dueDateStr,
          ReturnDate: null,
        };
  
        const transactionResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/TransactionHistory`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(transactionRecord),
          }
        );
        if (!transactionResponse.ok) {
          const errorText = await transactionResponse.text();
          throw new Error(`Failed to create transaction for Item ${item.ItemID}: ${errorText}`);
        }
      }
  
      clearCart();
      setCheckoutSuccess(true);
    } catch (error) {
      console.error("Checkout error:", error);
      setCheckoutError("An error occurred during checkout. Please try again.");
      setSnackbarOpen(true);
    }
  };
  
  return (
    <div className="checkout-container"
      style={{
        marginTop: "80px", // Prevent overlap with nav bar
        padding: "1rem",
      }}
    >
      <h1>Checkout Summary</h1>
      <p>
        User Type:{" "}
        <strong>
          {borrowerTypeId === "1" ? "Student" : borrowerTypeId === "2" ? "Faculty" : "Unknown"}
        </strong>
      </p>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table className="checkout-table">
            <thead>
              <tr>
                <th>Item ID</th>
                <th>Item Type</th>
                <th>Title</th>
                <th>Checkout Date</th>
                <th>Due Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.ItemID}</td>
                  <td>{item.ItemType}</td>
                  <td>{item.Title}</td>
                  <td>{checkoutDate}</td>
                  <td>{dueDateStr}</td>
                  <td>
                    <button onClick={() => removeFromCart(idx)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <button className="checkout-button" onClick={handleCheckout}>
              Finalize Checkout
            </button>
          </div>
        </>
      )}
  
      {/* Error Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          <AlertTitle>Error</AlertTitle>
          {checkoutError}
        </Alert>
      </Snackbar>

          {/* Success Snackbar */}
            <Snackbar
        open={checkoutSuccess}
        autoHideDuration={6000}
        onClose={handleSuccessClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSuccessClose} severity="success" variant="filled" sx={{ width: "100%" }}>
          <AlertTitle>Success</AlertTitle>
          Thank you for your checkout! Your item(s) have been processed successfully.
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CheckoutPage;
