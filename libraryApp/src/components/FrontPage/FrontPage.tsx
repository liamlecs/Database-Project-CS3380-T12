import React, { useState, useEffect } from 'react';
import './FrontPage.css';
import welcomeBg from "../../assets/welcome_background.jpg";

const Library: React.FC = () => {
  const [tables] = useState(["Book", "Movies", "Music", "Technology"]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [secondDropdownOptions, setSecondDropdownOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [items, setItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredItems, setFilteredItems] = useState<any[]>([]);

  useEffect(() => {
    if (selectedTable) {
      switch (selectedTable) {
        case "Book":
          setSecondDropdownOptions(["Title", "Author", "ISBN", "Genre"]);
          break;
        case "Movies":
          setSecondDropdownOptions(["Title", "Director", "MovieID", "Genre"]);
          break;
        case "Music":
          setSecondDropdownOptions(["Title", "Artist", "SongID", "Genre"]);
          break;
        case "Technology":
          setSecondDropdownOptions(["Item Name", "Brand Name", "Serial Number", "Genre"]);
          break;
        default:
          setSecondDropdownOptions([]);
      }
    } else {
      setSecondDropdownOptions([]);
    }
  }, [selectedTable]);

  useEffect(() => {
    if (selectedTable) {
      const fetchItems = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${selectedTable}`);
          const data = await response.json();
          setItems(data);
          setFilteredItems(data);
        } catch (error) {
          console.error(`Error fetching items from ${selectedTable}:`, error);
        }
      };
      fetchItems();
    }
  }, [selectedTable]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems(items);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      setFilteredItems(
        items.filter((item: any) => {
          return Object.values(item).some(value =>
            value?.toString().toLowerCase().includes(lowerCaseQuery)
          );
        })
      );
    }
  }, [searchQuery, items]);

  return (
    <div className="library-container">
      <div className="welcome-message" style={{ backgroundImage: `url(${welcomeBg})` }}>
        <h1>Checkout Your Favorite Items Today!</h1>
      </div>

      <div className="search-bar-container">
        <div className="dropdown-wrapper">
          <label htmlFor="table-select">Select Table:</label>
          <select
            id="table-select"
            value={selectedTable}
            onChange={(e) => {
              setSelectedTable(e.target.value);
              setSelectedOption("");
              setItems([]);
              setSearchQuery("");
            }}
          >
            <option value="">-- Select Table --</option>
            {tables.map((table) => (
              <option key={table} value={table}>{table}</option>
            ))}
          </select>
        </div>

        {selectedTable && (
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
      </div>

      {filteredItems.length > 0 ? (
        <div className="items-container">
          <h3>Items:</h3>
          <ul>
            {filteredItems.map((item: any) => (
              <li key={item.id || item.bookId || item.movieId || item.songId || item.serialNumber}>
                {Object.entries(item).map(([key, value]) => (
                  <span key={key}><strong>{key}:</strong> {String(value)} | </span>
                ))}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default Library;
