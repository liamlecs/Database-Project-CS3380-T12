import React, { useState, useEffect } from 'react';
import './FrontPage.css';
import welcomeBg from "../../assets/welcome_background.jpg";

const Library: React.FC = () => {
  const [tables] = useState(["Book", "Movies", "Music", "Technology"]); // Static list of table names
  const [selectedTable, setSelectedTable] = useState<string>(""); // Selected table from the first dropdown
  const [secondDropdownOptions, setSecondDropdownOptions] = useState<string[]>([]); // Options for the second dropdown
  const [selectedOption, setSelectedOption] = useState<string>(""); // Selected option from the second dropdown
  const [items, setItems] = useState<any[]>([]); // Items fetched from the selected table
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query input by the user
  const [filteredItems, setFilteredItems] = useState<any[]>([]); // Filtered items based on the search query

  // Update second dropdown options based on the selected table
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

  // Fetch items from the selected table
  useEffect(() => {
    if (selectedTable) {
      const fetchItems = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${selectedTable}`);
          const data = await response.json();
          setItems(data);
          setFilteredItems(data); // Initialize filtered items with all fetched items
        } catch (error) {
          console.error(`Error fetching items from ${selectedTable}:`, error);
        }
      };

      fetchItems();
    }
  }, [selectedTable]);

  // Filter items based on the search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems(items); // Reset to all items if search query is empty
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      setFilteredItems(
        items.filter((item: any) => {
          switch (selectedOption) {
            case "Title":
              return item.title?.toLowerCase().includes(lowerCaseQuery);
            case "Author":
              return item.author?.toLowerCase().includes(lowerCaseQuery);
            case "ISBN":
              return item.isbn?.toLowerCase().includes(lowerCaseQuery);
            case "Genre":
              return item.genre?.toLowerCase().includes(lowerCaseQuery);
            case "Director":
              return item.director?.toLowerCase().includes(lowerCaseQuery);
            case "MovieID":
              return item.movieId?.toLowerCase().includes(lowerCaseQuery);
            case "Artist":
              return item.artist?.toLowerCase().includes(lowerCaseQuery);
            case "SongID":
              return item.songId?.toLowerCase().includes(lowerCaseQuery);
            case "Item Name":
              return item.name?.toLowerCase().includes(lowerCaseQuery);
            case "Brand Name":
              return item.brand?.toLowerCase().includes(lowerCaseQuery);
            case "Serial Number":
              return item.serialNumber?.toLowerCase().includes(lowerCaseQuery);
            default:
              return false;
          }
        })
      );
    }
  }, [searchQuery, selectedOption, items]);

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
        <h1>Checkout Your Favorite Items Today!</h1>
      </div>

      <div className="search-bar-container">
        {/* First Dropdown: Select Table */}
        <div>
          <label htmlFor="table-select">Select Table:</label>
          <select
            id="table-select"
            value={selectedTable}
            onChange={(e) => {
              setSelectedTable(e.target.value);
              setSelectedOption(""); // Reset second dropdown selection
              setItems([]); // Reset items when table changes
              setSearchQuery(""); // Reset search query
            }}
          >
            <option value="">-- Select Table --</option>
            {tables.map((table) => (
              <option key={table} value={table}>
                {table}
              </option>
            ))}
          </select>
        </div>

        {/* Second Dropdown: Select Option */}
        {selectedTable && (
          <div>
            <label htmlFor="option-select">Select Option:</label>
            <select
              id="option-select"
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <option value="">-- Select Option --</option>
              {secondDropdownOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Search Bar */}
        {selectedOption && (
          <div>
            <label htmlFor="search-input">Search:</label>
            <input
              id="search-input"
              type="text"
              placeholder={`Search by ${selectedOption}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Display Filtered Items */}
      {filteredItems.length > 0 && (
        <div>
          <h3>Items:</h3>
          <ul>
            {filteredItems.map((item: any) => (
              <li key={item.id || item.bookId || item.movieId || item.songId || item.serialNumber}>
                {selectedOption === "Title" && item.title}
                {selectedOption === "Author" && item.author}
                {selectedOption === "ISBN" && item.isbn}
                {selectedOption === "Genre" && item.genre}
                {selectedOption === "Director" && item.director}
                {selectedOption === "MovieID" && item.movieId}
                {selectedOption === "Artist" && item.artist}
                {selectedOption === "SongID" && item.songId}
                {selectedOption === "Item Name" && item.name}
                {selectedOption === "Brand Name" && item.brand}
                {selectedOption === "Serial Number" && item.serialNumber}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Library;