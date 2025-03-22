// src/components/BookList.tsx
import React from 'react';

interface Book {
    id: number;
    title: string;
    author: string;
    genre: string;
    isCheckedOut: boolean;
}

interface BookListProps {
    books: Book[];
    onCheckout: (bookId: number) => void;
}

const BookList: React.FC<BookListProps> = ({ books, onCheckout }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Genre</th>
                    <th>Checked Out</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {books.map((book) => (
                    <tr key={book.id}>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.genre}</td>
                        <td>{book.isCheckedOut ? 'Yes' : 'No'}</td>
                        <td>
                            <button onClick={() => onCheckout(book.id)}>Checkout</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default BookList;
