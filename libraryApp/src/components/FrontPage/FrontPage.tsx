import React, { useState, useEffect, useMemo } from "react";
import "./FrontPage.css";
import welcomeBg from "../../assets/welcome_background.jpg";

const Library: React.FC = () => {
  const [tables] = useState(["Book", "Movies", "Music", "Technology"]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [items, setItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedTable) {
      setItems([]);
      return;
    }

    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${selectedTable}`);
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error(`Error fetching items from ${selectedTable}:`, error);
        setItems([]);
      }
      setLoading(false);
    };

    fetchItems();
  }, [selectedTable]);

  // Memoized filtering function
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return []; // No search query → Show nothing

    const lowerCaseQuery = searchQuery.toLowerCase();
    return items.filter((item: any) => {
      return Object.values(item).some((value) => {
        const stringValue = String(value ?? "").toLowerCase();
        return stringValue.includes(lowerCaseQuery);
      });
    });
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
              setSearchQuery(""); // Reset search when switching tables
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
              placeholder="Start typing to search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        searchQuery && filteredItems.length > 0 ? ( // Only show items if user has typed something
          <div className="items-container">
            <h3>Items:</h3>
            <ul>
              {filteredItems.map((item: any) => (
                <li key={item.id || item.bookId || item.movieId || item.songId || item.serialNumber}>
                  {Object.entries(item).map(([key, value]) => (
                    <span key={key}><strong>{key}:</strong> {String(value ?? "N/A")} | </span>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          searchQuery && <p>No results found.</p> // Show "No results found" only if searchQuery is not empty
        )
      )}
    </div>
  );
};

export default Library;
