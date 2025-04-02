import React, { useState, useEffect, useMemo } from "react";
import "./FrontPage.css";
import welcomeBg from "../../assets/welcome_background.jpg";


const Library: React.FC = () => {
  const [tables] = useState(["Book", "Movie", "Music", "Technology"]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [selectedField, setSelectedField] = useState<string>("");
  const [items, setItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(false);


  const [bookItems, setBookItems] = useState<any[]>([]);
  const [movieItems, setMovieItems] = useState<any[]>([]);
  const [musicItems, setMusicItems] = useState<any[]>([]);
  const [technologyItems, setTechnologyItems] = useState<any[]>([]);

  // ------------------------------------ Search components ---------------------------------------------
  const fieldOptions: Record<string, string[]> = {
    Book: ["ISBN", "Title", "Author", "Publisher", "Genre"],
    Movie: ["Title", "Director", "Genre"],
    Music: ["Song Title", "Artist", "Genre"],
    Technology: ["Item Name", "Serial Number", "Brand"],
  };


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


  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return [];


    const lowerCaseQuery = searchQuery.toLowerCase();
    return items.filter((item: any) => {
      return Object.values(item).some((value) => {
        const stringValue = String(value ?? "").toLowerCase();
        return stringValue.includes(lowerCaseQuery);
      });
    });
  }, [searchQuery, items]);


  //---------------------------------------------------------------------------------------


  // --------------------------------------   Item Cards ---------------------------/


  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const bookResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Book`);
        const bookData = await bookResponse.json();
        setBookItems(bookData);

        const movieResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Movie`);
        const movieData = await movieResponse.json();
        setMovieItems(movieData);

        const musicResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Music`);
        const musicData = await musicResponse.json();
        setMusicItems(musicData);

        const technologyResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Technology`);
        const technologyData = await technologyResponse.json();
        setTechnologyItems(technologyData);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchAllItems();
  }, []);

  const renderCardRow = (title: string, items: any[]) => (
    <div className="card-row">
      <h3>{title}</h3>
      <div className="card-container">
        {items.map((item: any) => (
          <div className="card" key={item.id || item.bookId || item.movieId || item.songId || item.serialNumber}>
            {Object.entries(item).map(([key, value]) => (
              <p key={key}><strong>{key}:</strong> {String(value)}</p>
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
              setSelectedField(""); // reset field when switching tables
              setItems([]); // clear items when switching tables
              setSearchQuery(""); // reset search when switching tables
            }}
          >
            <option value="">-- Select Table --</option>
            {tables.map((table) => (
              <option key={table} value={table}>{table}</option>
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
                <option key={field} value={field}>{field}</option>
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
      ) : (
        searchQuery && filteredItems.length > 0 ? (
          <div className="items-container">
            <h3>Items:</h3>
            <div className="books-section">
              <div className="book-row">
                {filteredItems.map((item: any) => (
                  <div className="book-card" key={item.id || item.bookId || item.movieId || item.songId || item.serialNumber}>
                    <img
                      className="book-image"
                      src={item.imageUrl || "/path/to/default/image.jpg"} // Make sure to handle missing images
                      alt={item.title || "Item image"}
                    />
                    <div className="book-title">{item.title}</div>
                    <div className="book-author">{item.author || item.artist || item.director}</div>
                    {/* Add more item details as necessary */}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          searchQuery && <p>No results found.</p>
        )
      )}

      {/* Render the items for each category */}
      {renderCardRow("Books", bookItems)}
      {renderCardRow("Movies", movieItems)}
      {renderCardRow("Music", musicItems)}
      {renderCardRow("Technology", technologyItems)}

    </div>
  );
};


export default Library;

