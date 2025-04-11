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
    <div className="checkout-container">
      <h1>Checkout Summary</h1>
      <p>
        User Type: <strong>{userType.toUpperCase()}</strong>
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
          <button className="checkout-button" onClick={handleCheckout}>
            Finalize Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
