import React, { useState } from 'react';
import SearchComponent from '../SearchBar/SearchComponent';
// import BookList from '../SearchBar/BookList'; 
import './FrontPage.css';

const Library: React.FC = () => {

  // Will be updated to be connected with the database
  const [books, setBooks] = useState([
    { id: 1, title: 'Book One', author: 'Author One', genre: 'Fiction', isCheckedOut: false },
    { id: 2, title: 'Book Two', author: 'Author Two', genre: 'Non-Fiction', isCheckedOut: true },
    //
  ]);

  const [filteredBooks, setFilteredBooks] = useState(books);

  const handleSearch = (filters: { itemType: string; author: string; genre: string; isCheckedOut: boolean }) => {
    const { itemType, author, genre} = filters;

    const filtered = books.filter((book) => {
      const matchesItemType = itemType ? book.title === itemType : true; // dropdown
      const matchesAuthor = author ? book.author === author : true;
      const matchesGenre = genre ? book.genre.includes(genre) : true;
      // const matchesCheckedOut = isCheckedOut !== null ? book.isCheckedOut === isCheckedOut : true;

      return matchesItemType && matchesAuthor && matchesGenre; //&& matchesCheckedOut;
    });

    setFilteredBooks(filtered);
  };

  // const handleCheckout = (bookId: number) => {
  //   const updatedBooks = books.map((book) =>
  //     book.id === bookId ? { ...book, isCheckedOut: true } : book
  //   );
  //   setBooks(updatedBooks);
  //   setFilteredBooks(updatedBooks);
  // };

  return (
    <div className="library-container">
      <div className="welcome-message">
        <h1>Checkout Your Favorite Books Today!</h1>
      </div>
      <div className="search-bar-container">
        {/* Updated to use SearchComponent instead of SearchBar */}
        <SearchComponent books={books} onSearch={handleSearch} />
      </div>
      {/* <BookList books={filteredBooks} onCheckout={handleCheckout} /> */}
    </div>
  );
};

export default Library;
