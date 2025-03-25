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
    isCheckedOut: boolean;
  }

  const numRows = 4; 
  const booksPerRow = 7;

  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [rowIndices, setRowIndices] = useState<number[]>(new Array(numRows).fill(14));

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('https://localhost:5173/api/Book');
        const data = await response.json();
  
        // Transform the API response into the desired format
        const formattedBooks = data.map((book: { bookId: number; title: string; author: string; imageUrl?: string; isCheckedOut: boolean }) => ({
          id: book.bookId,
          title: book.title,  // e.g., "ISBN: 123456789"
          author: book.author,  // Assuming 'author' is returned as a string
          imageUrl: book.imageUrl || "https://via.placeholder.com/130",  // Placeholder
          isCheckedOut: book.isCheckedOut,
        }));
  
        setBooks(formattedBooks);
        setFilteredBooks(formattedBooks);  // If you're using filtering logic
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
  
    fetchBooks();
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

      {/* multiple rows of books */}
      {Array.from({ length: numRows }, (_, rowIndex) => {
        const startIndex = rowIndices[rowIndex];
        const booksForRow = filteredBooks.slice(startIndex, startIndex + booksPerRow);

        return (
          <div key={rowIndex} className="book-row">
            {/* Scroll Left Button */}
            <button className="scroll-left" onClick={() => scrollBooks('left', rowIndex)} disabled={startIndex === 0}>
              &lt;
            </button>

            {/* books container */}
            <div className="books-section">
              <div className="book-row-container">
                {booksForRow.map((book) => (
                  <div key={book.id} className="book-card">
                    <img 
                      src={book.imageUrl || "https://via.placeholder.com/130"} // Placeholder for book covers
                      alt={book.title} 
                      className="book-image"
                    />
                    <p className="book-title">{book.title}</p>
                    <p className="book-author">{book.author}</p>
                    <p className="book-genre">{book.genre}</p>
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
