import React, { useState, useEffect } from 'react';
import SearchComponent from '../SearchBar/SearchComponent';
import './FrontPage.css';
import welcomeBg from "../../assets/welcome_background.jpg";

const Library: React.FC = () => {
  interface Book {
    id: number;
    title: string;
    author: string;
    genre: string;
    imageUrl: string;
    isCheckedOut: boolean;
  }

  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Item`);
      const data = await response.json();

      const formattedBooks: Book[] = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        author: item.author,
        genre: item.genre,
        imageUrl: item.imageUrl || "https://via.placeholder.com/130",
        isCheckedOut: item.isCheckedOut || false,
      }));

      setBooks(formattedBooks);
      setFilteredBooks(formattedBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const openCheckoutModal = (book: Book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleCheckout = () => {
    // Handle checkout logic
    alert(`You have checked out: ${selectedBook?.title}`);
    closeModal();
  };

  return (
    <div className="library-container">
      <div className="welcome-message" style={{
        backgroundImage: `url(${welcomeBg})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundSize: "cover"
      }}>
        <h1>Checkout Your Favorite Books Today!</h1>
      </div>

      <div className="search-bar-container">
        <SearchComponent books={books} onSearch={() => { }} />
      </div>

      <div className="books-section">
        {filteredBooks.map((book) => (
          <div key={book.id} className="book-card">
            <img src={book.imageUrl} alt={book.title} className="book-image" />
            <div className="book-info">
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">{book.author}</p>
              <p className="book-genre">{book.genre}</p>
            </div>
            <button
              className="add-to-cart-btn"
              onClick={() => openCheckoutModal(book)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Modal for Checkout Confirmation */}
      {showModal && selectedBook && (
        <div className="checkout-modal">
          <div className="modal-content">
            <h2>Confirm Checkout</h2>
            <div className="book-info">
              <p className="book-title">Title: {selectedBook.title}</p>
              <p className="book-author">Author: {selectedBook.author}</p>
              <p className="book-genre">Genre: {selectedBook.genre}</p>
              <p className="book-summary">Summary: A book about {selectedBook.genre}.</p>
            </div>
            <button className="confirm-btn" onClick={handleCheckout}>Confirm</button>
            <button className="cancel-btn" onClick={closeModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;
