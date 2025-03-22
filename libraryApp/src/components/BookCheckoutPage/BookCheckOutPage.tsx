// src/components/BookCheckoutTable.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface BookCheckout {
    bookId: number;
    customerId: number;
    checkoutDate: string;
    dueDate: string | null;
    returnDate: string | null;
    isReturned: boolean;
}

const BookCheckoutTable: React.FC = () => {
    const [checkouts, setCheckouts] = useState<BookCheckout[]>([]);

    useEffect(() => {
        axios.get('https://localhost:5001/api/bookcheckout')
            .then(response => setCheckouts(response.data))
            .catch(error => console.error('There was an error!', error));
    }, []);

    return (
        <div>
            <h1>Book Checkout Information</h1>
            <table>
                <thead>
                    <tr>
                        <th>Book ID</th>
                        <th>Customer ID</th>
                        <th>Checkout Date</th>
                        <th>Due Date</th>
                        <th>Return Date</th>
                        <th>Returned</th>
                    </tr>
                </thead>
                <tbody>
                    {checkouts.map(checkout => (
                        <tr key={checkout.bookId}>
                            <td>{checkout.bookId}</td>
                            <td>{checkout.customerId}</td>
                            <td>{new Date(checkout.checkoutDate).toLocaleDateString()}</td>
                            <td>{checkout.dueDate ? new Date(checkout.dueDate).toLocaleDateString() : ''}</td>
                            <td>{checkout.returnDate ? new Date(checkout.returnDate).toLocaleDateString() : ''}</td>
                            <td>{checkout.isReturned ? 'Yes' : 'No'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BookCheckoutTable;
