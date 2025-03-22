import { useNavigate } from "react-router-dom";

export default function BookCheckOutPage() {
    const navigate = useNavigate();

    const handleCheckout = () => {
        alert("Book checked out successfully!");
        navigate("/"); 
    };

    return (
        <div>
            <h1>Book Checkout Page</h1>
            <p>Select a book and checkout.</p>
            <button onClick={handleCheckout}>Checkout</button>
        </div>
    );
}
