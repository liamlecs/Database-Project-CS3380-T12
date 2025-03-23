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
        <div>
            <ul>
                {books.map((book: Book) => (
                    <li key={book.id}>
                        {book.title} by {book.author}
                        {!book.isCheckedOut && <button onClick={() => onCheckout(book.id)}>Checkout</button>}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BookList;
