import React, { useState, useEffect } from "react";

interface BookCheckout {
    checkoutID: string;
    customerID: number;
    bookTitle: string;
    checkoutDate: string;
    dueDate: string;
}

const BookCheckoutPage: React.FC = () => {
    const [customerId, setCustomerId] = useState<number | null>(null);
    const [checkouts, setCheckouts] = useState<BookCheckout[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMsg, setErrorMsg] = useState<string>("");

    useEffect(() => {

        const fetchUser = async () => {
            try {
                const response = await fetch("/api/user"); // dummy
                if (!response.ok) throw new Error("Failed to fetch user info");

                const data = await response.json();
                setCustomerId(data.customerId);
            } catch (error) {
                setErrorMsg("Failed to fetch user info");
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (!customerId) return;
        setLoading(true);

        const fetchCheckouts = async () => {
            try {
                const response = await fetch(`http://localhost:5217/api/BookCheckout/${customerId}`);
                if (!response.ok) throw new Error("Failed to fetch checkout data");

                const data = await response.json();
                setCheckouts(data);
            } catch (error: any) {
                setErrorMsg(error.message || "An error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchCheckouts();
    }, [customerId]);

    return (
        <div>
            <h2>My Book Checkouts</h2>
            {loading && <p>Loading...</p>}
            {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
            <ul>
                {checkouts.map((checkout) => (
                    <li key={checkout.checkoutID}>
                        {checkout.bookTitle} - Due: {new Date(checkout.dueDate).toLocaleDateString()}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BookCheckoutPage;
