// src/components/Checkout.tsx
import React from "react";
import { useCheckout } from "../../contexts/CheckoutContext";
import "./Checkout.css";


const CheckoutPage: React.FC = () => {
    const { cart, userType } = useCheckout();

    return (
        <div className="checkout-container">
            <h1>Checkout Summary</h1>
            <p>User Type: <strong>{userType.toUpperCase()}</strong></p>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <table className="checkout-table">
                    <thead>
                        <tr>
                            <th>Item ID</th>
                            <th>Item Type</th>
                            <th>Title</th>
                            <th>Checkout Date</th>
                            <th>Due Date</th>
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default CheckoutPage;
