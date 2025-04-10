import React from "react";

interface Book {
  bookId: number;
  title: string;
  author: string;
  genre: string;
  imageUrl: string;
  isCheckedOut: boolean;
}

interface BookCardProps {
    book: Book;
    onAddToCart: (book: Book) => void;
  }

const BookCard: React.FC<BookCardProps> = ({ book, onAddToCart }) => {
  return (
    <div className="book-card">
      <img src={book.imageUrl} alt={book.title} className="book-image" />
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">{book.author}</p>
        <p className="book-genre">{book.genre}</p>
      </div>
      <button className="add-to-cart-btn" onClick={() => onAddToCart(book)}>
        Add to Cart
      </button>
    </div>
  );
};

export default BookCard;
