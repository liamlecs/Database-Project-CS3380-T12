import React, { useState, useEffect, useMemo } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import "./Library.css";
import welcomeBg from "../../assets/welcome_background.jpg";

const Library: React.FC = () => {
    // Search and filter state
    const [selectedTable, setSelectedTable] = useState<string>("");
    const [selectedField, setSelectedField] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Data fetched from endpoints for each row
    const [allItems, setAllItems] = useState<Record<string, any[]>>({
        Book: [],
        Movie: [],
        Music: [],
        Technology: [],
    });

    // Checkout dialog and cart state
    const [openDialog, setOpenDialog] = useState(false);
    const [itemToCheckout, setItemToCheckout] = useState<any>(null);
    const [checkoutCart, setCheckoutCart] = useState<any[]>([]);
    const [openCheckoutPage, setOpenCheckoutPage] = useState(false);

    // Carousel pagination state: 7 items per view, maximum 21 items per category
    const [rowPage, setRowPage] = useState<Record<string, number>>({
        Book: 0,
        Movie: 0,
        Music: 0,
        Technology: 0,
    });
    const itemsPerRowView = 7;
    const maxRowItems = 21;

    // Table names and field options for search dropdowns
    const tables = ["Book", "Movie", "Music", "Technology"];
    const fieldOptions: Record<string, string[]> = {
        Book: ["ISBN", "Title", "Author", "Publisher", "Genre"],
        Movie: ["Title", "Director", "Genre"],
        Music: ["Song Title", "Artist", "Genre"],
        Technology: ["Item Name", "Serial Number", "Brand"],
    };

    // Fetch search items when a table is selected
    useEffect(() => {
        if (!selectedTable) {
            setItems([]);
            return;
        }
        const fetchItems = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/${selectedTable}`
                );
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

    // Fetch data for each row using its corresponding endpoint
    useEffect(() => {
        const fetchAllItems = async () => {
            try {
                const data = await Promise.all(
                    tables.map(async (table) => {
                        const response = await fetch(
                            `${import.meta.env.VITE_API_BASE_URL}/api/${table}`
                        );
                        return { [table]: await response.json() };
                    })
                );
                const fetchedData = Object.assign({}, ...data);
                console.log("Fetched all items:", fetchedData);
                setAllItems(fetchedData);
            } catch (error) {
                console.error("Error fetching all items:", error);
            }
        };
        fetchAllItems();
    }, []);

    // Filter search results based on query
    const filteredItems = useMemo(() => {
        if (!searchQuery.trim()) return items;
        const lowerCaseQuery = searchQuery.toLowerCase();
        return items.filter((item) =>
            Object.values(item).some((value) =>
                String(value ?? "").toLowerCase().includes(lowerCaseQuery)
            )
        );
    }, [searchQuery, items]);

    // Carousel pagination handlers for each row
    const handleRowNext = (category: string, totalPages: number) => {
        setRowPage((prev) => {
            const current = prev[category] || 0;
            if (current < totalPages - 1) {
                return { ...prev, [category]: current + 1 };
            }
            return prev;
        });
    };

    const handleRowPrev = (category: string) => {
        setRowPage((prev) => {
            const current = prev[category] || 0;
            if (current > 0) {
                return { ...prev, [category]: current - 1 };
            }
            return prev;
        });
    };

    // Checkout handlers
    const handleCheckout = (item: any) => {
        setItemToCheckout(item);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setItemToCheckout(null);
    };

    const handleConfirmCheckout = () => {
        if (itemToCheckout) {
            setCheckoutCart((prev) => [...prev, itemToCheckout]);
        }
        setOpenDialog(false);
    };

    /**
     * Renders a single carousel row for a given category.
     * Displays up to 21 items (sliced into pages of 7).
     * If fewer than 7 items exist on a page, empty placeholders fill the row.
     */
    const renderCardRow = (title: string, rowItems: any[]) => {
        const currentPage = rowPage[title] || 0;
        const limitedItems = rowItems.slice(0, maxRowItems);
        const totalPages = Math.ceil(limitedItems.length / itemsPerRowView);
        const startIndex = currentPage * itemsPerRowView;
        const currentRowItems = limitedItems.slice(startIndex, startIndex + itemsPerRowView);

        // Fill with empty placeholders if necessary
        const filledItems = [...currentRowItems];
        while (filledItems.length < itemsPerRowView) {
            filledItems.push(null);
        }

        return (
            <div className="carousel-row" key={title}>
                <div className="carousel-header">
                    <h3>{title}</h3>
                    <a href="#!" className="view-all-link">View All</a>
                </div>
                <div className="carousel-container">
                    <button
                        className="carousel-arrow left"
                        onClick={() => handleRowPrev(title)}
                        disabled={currentPage === 0}
                    >
                        &lt;
                    </button>
                    <div className="carousel-track">
                        {filledItems.map((item, index) => {
                            if (item) {
                                return (
                                    <div
                                        className="carousel-item"
                                        key={item.id || item.bookId || item.movieId || item.songId || item.serialNumber || index}
                                    >
                                        <div className="item-image-wrapper">
                                            <img
                                                src={item.imageUrl || "/path/to/default/image.jpg"}
                                                alt={item.title || "Item image"}
                                                className="item-image"
                                            />
                                        </div>
                                        <div className="item-info">
                                            <h4 className="item-title">
                                                {item.title || item.name || "Untitled"}
                                            </h4>
                                            {item.author && (
                                                <p className="item-author">by {item.author}</p>
                                            )}
                                            {item.director && (
                                                <p className="item-author">Director: {item.director}</p>
                                            )}
                                            {item.artist && (
                                                <p className="item-author">Artist: {item.artist}</p>
                                            )}
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleCheckout(item)}
                                                style={{ marginTop: "0.5rem" }}
                                            >
                                                Checkout
                                            </Button>
                                        </div>
                                    </div>
                                );
                            } else {
                                return (
                                    <div className="carousel-item empty" key={`empty-${index}`}>
                                        <p>Empty</p>
                                    </div>
                                );
                            }
                        })}
                    </div>
                    <button
                        className="carousel-arrow right"
                        onClick={() => handleRowNext(title, totalPages)}
                        disabled={currentPage >= totalPages - 1 || totalPages === 0}
                    >
                        &gt;
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="library-container">
            {/* Top Banner */}
            <div className="welcome-message" style={{ backgroundImage: `url(${welcomeBg})` }}>
                <h1>Checkout Your Favorite Items Today!</h1>
                <Button variant="contained" color="secondary" onClick={() => setOpenCheckoutPage(true)}>
                    View Cart ({checkoutCart.length})
                </Button>
            </div>

            {/* Search & Filter Section */}
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

            {/* Search Results */}
            {loading ? (
                <p>Loading...</p>
            ) : searchQuery && filteredItems.length > 0 ? (
                <div className="search-results-container">
                    <h3>Search Results:</h3>
                    <div className="search-results-row">
                        {filteredItems.map((item) => (
                            <div
                                className="search-result-card"
                                key={item.id || item.bookId || item.movieId || item.songId || item.serialNumber}
                            >
                                <img
                                    className="search-result-image"
                                    src={item.imageUrl || "/path/to/default/image.jpg"}
                                    alt={item.title || "Item image"}
                                />
                                <div className="search-result-title">{item.title}</div>
                                {item.author && <div className="search-result-author">by {item.author}</div>}
                                {item.director && <div className="search-result-author">Director: {item.director}</div>}
                                {item.artist && <div className="search-result-author">Artist: {item.artist}</div>}
                                <Button variant="contained" color="primary" onClick={() => handleCheckout(item)}>
                                    Checkout
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                searchQuery && <p>No results found.</p>
            )}

            {/* Render each category row using data from the endpoints */}
            {Object.entries(allItems).map(([category, items]) =>
                renderCardRow(category, items)
            )}

            {/* Checkout Confirmation Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Confirm Checkout</DialogTitle>
                <DialogContent>
                    <p>
                        Do you want to checkout the item: <strong>{itemToCheckout?.title}</strong>?
                    </p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmCheckout} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Checkout Cart Modal */}
            <Dialog open={openCheckoutPage} onClose={() => setOpenCheckoutPage(false)} fullWidth maxWidth="md">
                <DialogTitle>Shopping Cart</DialogTitle>
                <DialogContent>
                    {checkoutCart.length === 0 ? (
                        <p>Your shopping cart is empty.</p>
                    ) : (
                        <table className="checkout-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {checkoutCart.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.title}</td>
                                        <td>
                                            {Object.entries(item)
                                                .filter(([key]) => key !== "title")
                                                .map(([key, value]) => (
                                                    <span key={key}>
                                                        <strong>{key}:</strong> {String(value)}{" "}
                                                    </span>
                                                ))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCheckoutPage(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Library;
