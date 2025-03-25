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
  const booksPerRow = 5;

  // serves as a placeholder for the books to be imported from the db
  const placeholderBooks: Book[] = [
    { id: 1, title: "Loading...", author: "Unknown", genre: "Loading", imageUrl: "https://via.placeholder.com/130", isCheckedOut: false },
    { id: 2, title: "Loading...", author: "Unknown", genre: "Loading", imageUrl: "https://via.placeholder.com/130", isCheckedOut: false },
    { id: 3, title: "Loading...", author: "Unknown", genre: "Loading", imageUrl: "https://via.placeholder.com/130", isCheckedOut: false },
    { id: 4, title: "Loading...", author: "Unknown", genre: "Loading", imageUrl: "https://via.placeholder.com/130", isCheckedOut: false },
    { id: 5, title: "Loading...", author: "Unknown", genre: "Loading", imageUrl: "https://via.placeholder.com/130", isCheckedOut: false },
    { id: 6, title: "Loading...", author: "Unknown", genre: "Loading", imageUrl: "https://via.placeholder.com/130", isCheckedOut: false },
    { id: 7, title: "Loading...", author: "Unknown", genre: "Loading", imageUrl: "https://via.placeholder.com/130", isCheckedOut: false },
  ];

  const [books, setBooks] = useState<Book[]>(placeholderBooks);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(placeholderBooks);
  const [rowIndices, setRowIndices] = useState<number[]>(new Array(numRows).fill(0));

  const scrollBooks = (direction: 'left' | 'right', rowIndex: number) => {
    setRowIndices((prevIndices) => {
      const newIndices = [...prevIndices];
      const maxStartIndex = Math.max(0, filteredBooks.length - booksPerRow);

      if (direction === 'right') {
        newIndices[rowIndex] = Math.min(newIndices[rowIndex] + booksPerRow, maxStartIndex);
      } else {
        newIndices[rowIndex] = Math.max(newIndices[rowIndex] - booksPerRow, 0);
      }

      return newIndices;
    });
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('https://localhost:5173/api/Book');
        const data = await response.json();

        const formattedBooks = data.map((book: { bookId: number; title: string; author: string; genre: string; imageUrl?: string; isCheckedOut: boolean }) => ({
          id: book.bookId,
          title: book.title,
          author: book.author,
          genre: book.genre,
          imageUrl: book.imageUrl || "https://via.placeholder.com/130",
          isCheckedOut: book.isCheckedOut,
        }));

        setBooks(formattedBooks);
        setFilteredBooks(formattedBooks);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="library-container">
      <div className="welcome-message">
        <h1>Checkout Your Favorite Books Today!</h1>
      </div>

      <div className="search-bar-container">
        <SearchComponent books={books} onSearch={() => {}} />
      </div>

      {Array.from({ length: numRows }, (_, rowIndex) => {
        const startIndex = rowIndices[rowIndex];
        let booksForRow = filteredBooks.slice(startIndex, startIndex + booksPerRow);
        
        while (booksForRow.length < booksPerRow) {
          booksForRow.push({
            id: -1,
            title: "",
            author: "",
            genre: "",
            imageUrl: "",
            isCheckedOut: false,
          });
        }

        return (
          <div key={rowIndex} className="book-row">
            <button className="scroll-left" onClick={() => scrollBooks('left', rowIndex)} disabled={startIndex === 0}>
              &lt;
            </button>

            <div className="books-section">
              <div className="book-row-container">
                {booksForRow.map((book) => (
                  <div key={book.id} className="book-card" style={{ visibility: book.id === -1 ? 'hidden' : 'visible' }}>
                    <img 
                      src={book.imageUrl} 
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

            <button 
              className="scroll-right" 
              onClick={() => scrollBooks('right', rowIndex)} 
              disabled={rowIndices[rowIndex] >= filteredBooks.length - booksPerRow}
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