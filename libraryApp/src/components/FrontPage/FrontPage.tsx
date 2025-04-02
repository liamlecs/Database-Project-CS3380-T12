import React, { useState, useEffect, useMemo } from "react";
import "./FrontPage.css";
import welcomeBg from "../../assets/welcome_background.jpg";

const Library: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [selectedField, setSelectedField] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [allItems, setAllItems] = useState<Record<string, any[]>>({
    Book: [],
    Movie: [],
    Music: [],
    Technology: [],
  });

  const tables = ["Book", "Movie", "Music", "Technology"];
  const fieldOptions: Record<string, string[]> = {
    Book: ["ISBN", "Title", "Author", "Publisher", "Genre"],
    Movie: ["Title", "Director", "Genre"],
    Music: ["Song Title", "Artist", "Genre"],
    Technology: ["Item Name", "Serial Number", "Brand"],
  };

  useEffect(() => {
    if (!selectedTable) return setItems([]);
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${selectedTable}`);
        setItems(await response.json());
      } catch (error) {
        console.error(`Error fetching items from ${selectedTable}:`, error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [selectedTable]);

  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const data = await Promise.all(
          tables.map(async (table) => {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${table}`);
            return { [table]: await response.json() };
          })
        );
        setAllItems(Object.assign({}, ...data));
      } catch (error) {
        console.error("Error fetching all items:", error);
      }
    };
    fetchAllItems();
  }, []);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const lowerCaseQuery = searchQuery.toLowerCase();
    return items.filter((item) =>
      Object.values(item).some((value) =>
        String(value ?? "").toLowerCase().includes(lowerCaseQuery)
      )
    );
  }, [searchQuery, items]);

  const renderCardRow = (title: string, items: any[]) => (
    <div className="card-row">
      <h3>{title}</h3>
      <div className="card-container">
        {items.map((item) => (
          <div className="card" key={item.id || item.bookId || item.movieId || item.songId || item.serialNumber}>
            {Object.entries(item).map(([key, value]) => (
              <p key={key}>
                <strong>{key}:</strong> {String(value)}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="library-container">
      <div className="welcome-message" style={{ backgroundImage: `url(${welcomeBg})` }}>
        <h1>Checkout Your Favorite Items Today!</h1>
      </div>

      <div className="search-bar-container-row">
        <div className="dropdown-wrapper">
          <label htmlFor="table-select">Select Table:</label>
          <select
            id="table-select"
            value={selectedTable}
            onChange={(e) => {
              setSelectedTable(e.target.value);
              setSelectedField("");
              setItems([]);
              setSearchQuery("");
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

        {selectedTable && (
          <div className="dropdown-wrapper">
            <label htmlFor="field-select">Select Field:</label>
            <select
              id="field-select"
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
            >
              <option value="">-- Select Field --</option>
              {fieldOptions[selectedTable]?.map((field) => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Start typing to search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : searchQuery && filteredItems.length > 0 ? (
        <div className="items-container">
          <h3>Items:</h3>
          <div className="books-section">
            <div className="book-row">
              {filteredItems.map((item) => (
                <div className="book-card" key={item.id || item.bookId || item.movieId || item.songId || item.serialNumber}>
                  <img
                    className="book-image"
                    src={item.imageUrl || "/path/to/default/image.jpg"}
                    alt={item.title || "Item image"}
                  />
                  <div className="book-title">{item.title}</div>
                  <div className="book-author">{item.author || item.artist || item.director}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        searchQuery && <p>No results found.</p>
      )}

      {Object.entries(allItems).map(([category, items]) => renderCardRow(category, items))}
    </div>
  );
};

export default Library;
