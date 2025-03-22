import React, { useState } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import BookList from '../SearchBar/BookList';
import './FrontPage.css';

const Library: React.FC = () => {
  // will be updated to be connected with db
  const [books, setBooks] = useState([
    { id: 1, title: 'Book One', author: 'Author One', genre: 'Fiction', isCheckedOut: false },
    { id: 2, title: 'Book Two', author: 'Author Two', genre: 'Non-Fiction', isCheckedOut: true },
    //
  ]);

  const [filteredBooks, setFilteredBooks] = useState(books);

  const handleSearch = (filters: { title: string; author: string; genre: string; isCheckedOut: boolean }) => {
    const { title, author, genre, isCheckedOut } = filters;

    const filtered = books.filter((book) => {
      const matchesTitle = title ? book.title.includes(title) : true;
      const matchesAuthor = author ? book.author.includes(author) : true;
      const matchesGenre = genre ? book.genre.includes(genre) : true;
      const matchesCheckedOut = isCheckedOut !== null ? book.isCheckedOut === isCheckedOut : true;

      return matchesTitle && matchesAuthor && matchesGenre && matchesCheckedOut;
    });

    setFilteredBooks(filtered);
  };

  const handleCheckout = (bookId: number) => {
    const updatedBooks = books.map((book) =>
      book.id === bookId ? { ...book, isCheckedOut: true } : book
    );
    setBooks(updatedBooks);
    setFilteredBooks(updatedBooks);
  };

  return (
    <div className="library-container">
      <div className="welcome-message">
        <h1>Checkout Your Favorite Books Today!</h1>
      </div>
      <div className="search-bar-container">
        <SearchBar onSearch={handleSearch} />
      </div>
      <BookList books={filteredBooks} onCheckout={handleCheckout} />
    </div>
  );
};

export default Library;
