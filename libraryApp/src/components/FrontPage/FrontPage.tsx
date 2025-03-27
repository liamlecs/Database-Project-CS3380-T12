import React, { useState, useEffect } from "react";
import SearchComponent from "../SearchBar/SearchComponent";
import CheckoutModal from "./CheckoutModals"; // Adjusted path to point to the correct file location
import BookCard from "./BookCards";
import { Book as BaseBook } from "../../types/Book";

interface ExtendedBook extends BaseBook {
  isCheckedOut: boolean;
}
import "./FrontPage.css";
import welcomeBg from "../../assets/welcome_background.jpg";
import { transformBookData } from "../../utils/transformBookData";

const Library: React.FC = () => {
  const [books, setBooks] = useState<ExtendedBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<ExtendedBook[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<ExtendedBook | null>(null);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Items`);
      const data = await response.json();

      const formattedBooks = transformBookData(data).map((book: BaseBook) => ({
        ...book,
        isCheckedOut: false, // Default value for isCheckedOut
      }));
      setBooks(formattedBooks);
      setFilteredBooks(formattedBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const openCheckoutModal = (book: ExtendedBook) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleCheckout = () => {
    alert(`You have checked out: ${selectedBook?.id}`);
    closeModal();
  };

  return (
    <div className="library-container">
      <div
        className="welcome-message"
        style={{
          backgroundImage: `url(${welcomeBg})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          backgroundSize: "cover",
        }}
      >
        <h1>Checkout Your Favorite Books Today!</h1>
      </div>

      <div className="search-bar-container">
        <SearchComponent books={books} onSearch={() => {}} />
      </div>

      <div className="books-section">
        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book as BaseBook} onAddToCart={openCheckoutModal} />
        ))}
      </div>

      {showModal && selectedBook && (
        <CheckoutModal
          book={selectedBook}
          onConfirm={handleCheckout}
          onCancel={closeModal}
        />
      )}
    </div>
  );
};

export default Library;