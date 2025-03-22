import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BookCheckOutPage() {
    const navigate = useNavigate();
    const [isWaitlisted, setIsWaitlisted] = useState(false);

    const handleCheckout = () => {
        alert("Book checked out successfully!");
        navigate("/");  // redirect to home after checkout
    };

    const handleWaitlist = () => {
        setIsWaitlisted(true);
        alert("Book added to the waitlist!");
    };

    return (
        <div>
            <h1>Book Checkout Page</h1>
            <p>Select a book and choose an option:</p>

            <button onClick={handleCheckout}>Checkout</button>
            <button onClick={handleWaitlist} disabled={isWaitlisted}>
                {isWaitlisted ? "Successfully Waitlisted" : "Hold / Waitlist"}
            </button>
        </div>
    );
}
