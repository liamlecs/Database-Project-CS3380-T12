import React, { useState, useEffect } from 'react';
import SearchComponent from '../SearchBar/SearchComponent';
import './FrontPage.css';

const Library: React.FC = () => {
  interface Book {
    id: number;
    title: string;
    author: string;
    genre: string;
    imageUrl: string;
  }

  const numRows = 4; // Number of rows
  const booksPerRow = 7; // Number of books visible per row
  const totalBooks = 50; // Total number of books

  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [rowIndices, setRowIndices] = useState<number[]>(new Array(numRows).fill(14)); // Index tracking for each row

  // Generate enough mock books
  useEffect(() => {
    const mockBooks = Array.from({ length: totalBooks }, (_, index) => ({
      id: index + 1,
      title: `Mock Book ${index + 1}`,
      author: `Mock Author ${index + 1}`,
      genre: index % 2 === 0 ? 'Fiction' : 'Non-Fiction',
      imageUrl: ''
    }));

    setBooks(mockBooks);
    setFilteredBooks(mockBooks);
  }, []);

  // Function to handle scrolling in a specific row
  const scrollBooks = (direction: 'left' | 'right', rowIndex: number) => {
    setRowIndices((prevIndices) => {
      const newIndices = [...prevIndices];
      const maxIndex = Math.max(0, filteredBooks.length - booksPerRow); // Prevents scrolling past available books

      if (direction === 'right') {
        newIndices[rowIndex] = Math.min(newIndices[rowIndex] + booksPerRow, maxIndex);
      } else {
        newIndices[rowIndex] = Math.max(newIndices[rowIndex] - booksPerRow, 0);
      }

      return newIndices;
    });
  };

  return (
    <div className="library-container">
      <div className="welcome-message">
        <h1>Checkout Your Favorite Books Today!</h1>
      </div>

      <div className="search-bar-container">
        <SearchComponent books={books} onSearch={() => {}} />
      </div>

      {/* Multiple Rows of Books */}
      {Array.from({ length: numRows }, (_, rowIndex) => {
        const startIndex = rowIndices[rowIndex];
        const booksForRow = filteredBooks.slice(startIndex, startIndex + booksPerRow);

        return (
          <div key={rowIndex} className="book-row">
            {/* Scroll Left Button */}
            <button className="scroll-left" onClick={() => scrollBooks('left', rowIndex)} disabled={startIndex === 0}>
              &lt;
            </button>

            {/* Books Container */}
            <div className="books-section">
              <div className="book-row-container">
                {booksForRow.map((book) => (
                  <div key={book.id} className="book-card">
                    <img 
                      src={book.imageUrl || "https://via.placeholder.com/130"} 
                      alt={book.title} 
                      className="book-image"
                    />
                    <p className="book-title">{book.title}</p>
                    <p className="book-author">{book.author}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Scroll Right Button */}
            <button 
              className="scroll-right" 
              onClick={() => scrollBooks('right', rowIndex)} 
              disabled={startIndex + booksPerRow >= filteredBooks.length}
            >
              &gt;
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Library;
