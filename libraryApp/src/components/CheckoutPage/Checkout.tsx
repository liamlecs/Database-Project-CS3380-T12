import React from "react";
import { useCheckout } from "../../contexts/CheckoutContext";
import "./Checkout.css";

const CheckoutPage: React.FC = () => {
  const { cart, userType, removeFromCart, clearCart } = useCheckout();

  // Retrieve borrowerTypeId from localStorage.
  // borrowerTypeId = "1" for Student, "2" for Faculty.
  const borrowerTypeId = localStorage.getItem("borrowerTypeId");
  console.log("borrowerTypeId from localStorage:", borrowerTypeId);

  // Set loan period based on borrowerTypeId:
  // Faculty (2) = 14 days, Student (1) = 7 days.
  let loanPeriod = 7; // default to student
  if (borrowerTypeId === "2") {
    loanPeriod = 14;
  }

  // Compute checkout date and due date (format "yyyy-MM-dd").
  const now = new Date();
  const checkoutDate = now.toISOString().split("T")[0];
  const dueDateObj = new Date(now);
  dueDateObj.setDate(now.getDate() + loanPeriod);
  const dueDateStr = dueDateObj.toISOString().split("T")[0];

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const customerId = localStorage.getItem("userId");
    if (!customerId) {
      alert("Error: User is not logged in.");
      return;
    }

    try {
      // Fetch the user's transaction history to check for items with ReturnDate = NULL
      const transactionHistoryResponse = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/TransactionHistory/${customerId}`
      );
      if (!transactionHistoryResponse.ok) {
        const errorText = await transactionHistoryResponse.text();
        throw new Error(`Failed to fetch transaction history: ${errorText}`);
      }

      const activeTransactions = await transactionHistoryResponse.json();
      //console.log("Active transactions:", activeTransactions);

      //Filter for how many transactions have a null return date
      const activeItemCount = activeTransactions.filter(
        (transaction: { returnDate: string | null }) =>
          transaction.returnDate === null
      ).length;

      // Calculate the total number of items after this transaction
      const totalItemsAfterCheckout = activeItemCount + cart.length;

      //console.log("Total items after checkout:", totalItemsAfterCheckout);
      //Check how many active items the user has checked out
      //console.log("Active transactions:", activeItemCount);

      // Determine the borrowing limit based on the user type
      const borrowingLimit = borrowerTypeId === "2" ? 10 : 5;


      if (borrowerTypeId === "2") {
        // Faculty can have 10 active items
        if (totalItemsAfterCheckout == 11) {
          alert(
            "You have reached your borrowing limit. You already have 10 or more items checked out that have not been returned."
          );
          return;
        }
      } else if (borrowerTypeId === "1") {
        // Students can have 5 active items
        if (totalItemsAfterCheckout == 6) {
          alert(
            "You have reached your borrowing limit. You already have 5 or more items checked out that have not been returned."
          );
          return;
        }
      }

      // Check if the total exceeds the borrowing limit
      if (totalItemsAfterCheckout > borrowingLimit) {
        const itemsToRemove = totalItemsAfterCheckout - borrowingLimit;
        alert(
          `You cannot check out these items. You currently have ${activeItemCount} active items, and adding ${cart.length} item(s) would exceed your limit of ${borrowingLimit}. Please remove at least ${itemsToRemove} item(s) from your cart to proceed.`
        );
        return;
      }



      for (const item of cart) {
        // 1. Update the available copies (subtract one).
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

        // 2. Create a transaction record using the computed checkout and due dates.
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
          throw new Error(
            `Failed to create transaction for Item ${item.ItemID}: ${errorText}`
          );
        }
      }

      clearCart();
      alert(
        "Thank you for your checkout! Your items have been processed and recorded in your transaction history."
      );
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An error occurred during checkout. Please try again.");
    }
  };

  return (
    <div className="checkout-container"
    style={{
      // Add top margin so it’s not hidden by the nav bar
      marginTop: "80px",
      // Optional padding if you want some white space around
      padding: "1rem",
    }}>
      <h1>Checkout Summary</h1>
      <p>
        User Type:{" "}
        <strong>
          {borrowerTypeId === "1"
            ? "Student"
            : borrowerTypeId === "2"
            ? "Faculty"
            : "Unknown"}
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
    </div>
  );
};

export default CheckoutPage;
