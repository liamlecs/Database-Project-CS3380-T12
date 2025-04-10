// src/components/Checkout.tsx
import React from "react";
import { useCheckout } from "../../contexts/CheckoutContext";
import "./Checkout.css";


const CheckoutPage: React.FC = () => {
    const { cart, userType, removeFromCart, clearCart } = useCheckout();


    const handleCheckout = async () => {
        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }


        try {
            for (const item of cart) {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Item/update-copies`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        itemId: item.ItemID,
                        changeInCopies: -1, // subtract 1 when checking out
                    }),
                });


                if (!response.ok) {
                    const error = await response.text();
                    throw new Error(`Failed to update Item ${item.ItemID}: ${error}`);
                }
            }


            clearCart();
            alert("Thank you for your checkout! Your items have been processed (:");
        } catch (error) {
            console.error("Checkout error:", error);
            alert("An error occurred during checkout. Please try again.");
        }
    };


    return (
        <div className="checkout-container">
            <h1>Checkout Summary</h1>
            <p>User Type: <strong>{userType.toUpperCase()}</strong></p>
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
                                    <td>{item.CheckoutDate}</td>
                                    <td>{item.DueDate}</td>
                                    <td>
                                        <button onClick={() => removeFromCart(idx)}>Remove</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className="checkout-button" onClick={handleCheckout}>Finalize Checkout</button>
                </>
            )}
        </div>
    );
};


export default CheckoutPage;



