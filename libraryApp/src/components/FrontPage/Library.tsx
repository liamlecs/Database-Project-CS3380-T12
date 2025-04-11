import React, { useEffect, useMemo, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import "./Library.css";
import welcomeBg from "../../assets/welcome_background.jpg";
import defaultItemImage from "../../assets/welcome_background.jpg";
import { useCheckout } from "../../contexts/CheckoutContext";

const tables = ["Book", "Movie", "Music", "Technology"];

const fieldOptions: Record<string, string[]> = {
    Book: ["ISBN", "Title", "Author", "Publisher", "Genre"],
    Movie: ["Title", "Director", "Genre"],
    Music: ["Song Title", "Artist", "Genre"],
    Technology: ["Item Name", "Serial Number", "Brand"],
};

const itemsPerRowView = 7;
const maxRowItems = 21;

const Library: React.FC = () => {
    const [selectedTable, setSelectedTable] = useState<string>("");
    const [selectedField, setSelectedField] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [items, setItems] = useState<any[]>([]);
    const [allItems, setAllItems] = useState<Record<string, any[]>>({ Book: [], Movie: [], Music: [], Technology: [] });
    const [rowPage, setRowPage] = useState<Record<string, number>>({ Book: 0, Movie: 0, Music: 0, Technology: 0 });
    const [openDialog, setOpenDialog] = useState(false);
    const [itemToCheckout, setItemToCheckout] = useState<any>(null);
    const [openInfoDialog, setOpenInfoDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const { addToCart, userType } = useCheckout();

    useEffect(() => {
        if (!selectedTable) return;
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${selectedTable}`)
            .then((res) => res.json())
            .then((data) => setItems(data))
            .catch((err) => console.error(err));
    }, [selectedTable]);

    useEffect(() => {
        Promise.all(
            tables.map((table) =>
                fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${table}`)
                    .then((res) => res.json())
                    .then((data) => ({ [table]: data }))
            )
        )
            .then((results) => setAllItems(Object.assign({}, ...results)))
            .catch((err) => console.error(err));
    }, []);

    const filteredItems = useMemo(() => {
        if (!searchQuery.trim()) return items;
        const q = searchQuery.toLowerCase();
        return items.filter((item) => Object.values(item).some((val) => String(val ?? "").toLowerCase().includes(q)));
    }, [searchQuery, items]);

    const handleRowNext = (category: string, totalPages: number) => {
        setRowPage((prev) => ({ ...prev, [category]: Math.min(prev[category] + 1, totalPages - 1) }));
    };

    const handleRowPrev = (category: string) => {
        setRowPage((prev) => ({ ...prev, [category]: Math.max(prev[category] - 1, 0) }));
    };

    const handleCheckout = (item: any, category: string) => {
        setItemToCheckout({ ...item, _category: category });
        setOpenDialog(true);
    };

    const handleConfirmCheckout = () => {
          // 1. Check if the user is logged in using localStorage.
        if (localStorage.getItem("isLoggedIn") !== "true") {
            alert("Sorry, you need to be logged in as a customer to checkout an item. Please try again");
            // Optionally close the checkout dialog and reset the checkout state.
            setOpenDialog(false);
            setItemToCheckout(null);
            return;
        }

        if (itemToCheckout) {
            const now = new Date();
            const dueDate = new Date(now);
            // Retrieve the user type stored in localStorage (e.g., "customer" or "faculty").
            const storedUserType = localStorage.getItem("userType");

            // Adjust due dates based on the user type. Adjust the numbers below as needed.
            dueDate.setDate(now.getDate() + (storedUserType === "faculty" ? 14 : 7));

            addToCart({
                ItemID: itemToCheckout.itemId || itemToCheckout.id || 0,
                ItemType: itemToCheckout._category,
                Title: getDisplayTitle(itemToCheckout, itemToCheckout._category),
                CheckoutDate: now.toISOString().split("T")[0],
                DueDate: dueDate.toISOString().split("T")[0],
            });
        }
        setOpenDialog(false);
        setItemToCheckout(null);
    };

    const handleCardClick = (item: any, category: string) => {
        setSelectedItem({ ...item, _category: category });
        setOpenInfoDialog(true);
    };

    const getDisplayTitle = (item: any, category: string): string => {
        if (!item) return "Untitled";
        if (category === "Book") return `${item.title || "Untitled Book"}\n\nby ${item.author || "Unknown Author"}\n\n(${item.genre || "Unknown Genre"})`;
        if (category === "Movie") return `${item.title || "Untitled Movie"}\n\nby ${item.director || "Unknown Director"}\n\n(${item.genre || "Unknown Genre"})`;
        if (category === "Music") return `${item.songTitle || "Untitled Song"}\n\nby ${item.artistName || "Unknown Artist"}\n\n(${item.genreDescription || "Unknown Genre"})`;
        if (category === "Technology") return `${item.title || "Untitled Device"}\n\n${item.manufacturerName || "Unknown Brand"}`;
        return item.title || "Untitled";
    };

    const renderCardRow = (title: string, rowItems: any[]) => {
        const currentPage = rowPage[title] || 0;
        const limitedItems = rowItems.slice(0, maxRowItems);
        const totalPages = Math.ceil(limitedItems.length / itemsPerRowView);
        const startIndex = currentPage * itemsPerRowView;
        const currentRowItems = limitedItems.slice(startIndex, startIndex + itemsPerRowView);
        const filledItems = [...currentRowItems];
        while (filledItems.length < itemsPerRowView) filledItems.push(null);

        return (
            <div className="carousel-row" key={title} style={{ padding: "1rem", border: "1px solid #ddd", marginBottom: "1rem" }}>
                <div className="carousel-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3>{title}</h3>
                    <a href="#" style={{ fontSize: "0.9rem" }}>View All</a>
                </div>
                <div className="carousel-container" style={{ display: "flex", alignItems: "center" }}>
                    <button onClick={() => handleRowPrev(title)} disabled={currentPage === 0}>&lt;</button>
                    <div className="carousel-track" style={{ display: "flex", gap: "1rem", overflowX: "auto", flex: 1 }}>
                        {filledItems.map((item, index) => (
                            <div
                                key={`${title}-${index}`}
                                style={{
                                    width: "160px",
                                    minHeight: "260px",
                                    borderRadius: "12px",
                                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                    overflow: "hidden",
                                    padding: "0",
                                    backgroundColor: "#fff",
                                    textAlign: "center",
                                    transition: "transform 0.3s ease-in-out",
                                    cursor: item ? "pointer" : "default",
                                }}
                                onClick={() => item && handleCardClick(item, title)}
                                onMouseEnter={(e) => item && (e.currentTarget.style.transform = "scale(1.05)")}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
                            >
                                {item ? (
                                    <>
                                        <img
                                            src={item.coverImagePath ?? item.imageUrl ?? defaultItemImage}
                                            alt={getDisplayTitle(item, title)}
                                            style={{ width: "100%", height: "180px", objectFit: "cover", borderBottom: "1px solid #ccc" }}
                                        />
                                        <h4 style={{ fontSize: "0.85rem", margin: "0.5rem", fontWeight: 500, color: "#333", whiteSpace: "pre-line" }}>
                                            {getDisplayTitle(item, title)}
                                        </h4>
                                    </>
                                ) : (
                                    <div style={{ color: "#aaa", paddingTop: "2rem" }}>Empty</div>
                                )}
                            </div>
                        ))}
                    </div>
                    <button onClick={() => handleRowNext(title, totalPages)} disabled={currentPage >= totalPages - 1}>
                        &gt;
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="library-container">
            <div className="welcome-message" style={{ backgroundImage: `url(${welcomeBg})` }}>
                <h1>Checkout Your Favorite Items Today!</h1>
            </div>

            <div className="search-bar-container-row">
                <select value={selectedTable} onChange={(e) => { setSelectedTable(e.target.value); setItems([]); setSearchQuery(""); }}>
                    <option value="">-- Select Table --</option>
                    {tables.map((table) => <option key={table} value={table}>{table}</option>)}
                </select>
                {selectedTable && (
                    <select value={selectedField} onChange={(e) => setSelectedField(e.target.value)}>
                        <option value="">-- Select Field --</option>
                        {fieldOptions[selectedTable].map((field) => <option key={field}>{field}</option>)}
                    </select>
                )}
                <input type="text" placeholder="Start typing to search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>

            {searchQuery && selectedTable && filteredItems.length > 0 && (
                <div className="search-results-row">
                    {filteredItems.map((item, index) => (
                        <div className="search-result-card" key={`${selectedTable}-${index}`}>
                            <img loading="lazy" src={item.coverImagePath ?? item.imageUrl ?? defaultItemImage} alt="preview" className="search-result-image" />
                            <div className="search-result-title">{getDisplayTitle(item, selectedTable)}</div>
                            <Button onClick={() => handleCheckout(item, selectedTable)}>Checkout</Button>
                        </div>
                    ))}
                </div>
            )}

            {Object.entries(allItems).map(([category, items]) => renderCardRow(category, items))}

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Confirm Checkout</DialogTitle>
                <DialogContent>
                    <img
                        src={itemToCheckout?.coverImagePath ?? itemToCheckout?.imageUrl ?? defaultItemImage}
                        alt={(itemToCheckout?.title || itemToCheckout?.songTitle) ?? "Item Cover"}
                        style={{
                            maxWidth: "120px",
                            height: "auto",
                            marginBottom: "1rem",
                            borderRadius: "8px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                        }}
                    />
                    Do you want to checkout: <strong>{itemToCheckout?.title || itemToCheckout?.songTitle }</strong>?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleConfirmCheckout}>Confirm</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openInfoDialog} onClose={() => setOpenInfoDialog(false)}>
                <DialogTitle>{(selectedItem?.title || selectedItem?.songTitle) ?? "Item Details"}</DialogTitle>
                <DialogContent>
                    <img
                        src={selectedItem?.coverImagePath ?? selectedItem?.imageUrl ?? defaultItemImage}
                        alt={selectedItem?.title ?? "Item Cover"}
                        style={{
                            maxWidth: "120px",
                            height: "auto",
                            marginBottom: "1rem",
                            borderRadius: "8px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                        }}
                    />
                    <h3 style={{ marginBottom: "0.5rem" }}>{getDisplayTitle(selectedItem, selectedItem?._category)}</h3>
                    <p><strong>Author/Director:</strong> {selectedItem?.author ?? selectedItem?.director ?? selectedItem?.artistName ?? selectedItem?.manufacturerName ?? "Unknown"}</p>
                    <p><strong>Genre:</strong> {selectedItem?.genre ?? selectedItem?.genreDescription ?? "N/A"}</p>
                    <p><strong>Available Copies:</strong> {selectedItem?.availableCopies ?? "Unknown"}</p>
                    <p><strong>Item Location:</strong> {selectedItem?.itemLocation ?? "Unknown"}</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenInfoDialog(false)}>Close</Button>
                    <Button
                        onClick={() => {
                            handleCheckout(selectedItem, selectedItem._category);
                            setOpenInfoDialog(false);
                        }}
                        disabled={selectedItem?.availableCopies === 0}
                        variant="contained"
                        color="primary"
                    >
                        Checkout
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Library;