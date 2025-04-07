import React, { useEffect, useMemo, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import "./Library.css";
import welcomeBg from "../../assets/welcome_background.jpg";
import defaultItemImage from "../../assets/welcome_background.jpg";




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
    const [checkoutCart, setCheckoutCart] = useState<any[]>([]);
    const [openCheckoutPage, setOpenCheckoutPage] = useState(false);




    useEffect(() => {
        if (!selectedTable) return;
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${selectedTable}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("[Fetched selected table items]", data);
                setItems(data);
            })
            .catch((err) => console.error(err));
    }, [selectedTable]);




    useEffect(() => {
        Promise.all(
            tables.map((table) =>
                fetch(`${import.meta.env.VITE_API_BASE_URL}/api/${table}`)
                    .then((res) => res.json())
                    .then((data) => {
                        console.log(`[Fetched ${table}]`, data);
                        return { [table]: data };
                    })
            )
        )
            .then((results) => {
                const merged = Object.assign({}, ...results);
                console.log("[Merged all items]", merged); // for debugging purposes
                setAllItems(merged);
            })
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
        if (itemToCheckout) setCheckoutCart((prev) => [...prev, itemToCheckout]);
        setOpenDialog(false);
        setItemToCheckout(null);
    };




    const getDisplayTitle = (item: any, category: string): string => {
        if (!item) return "Untitled";

        if (category === "Book") {
            const title = item.title || "Untitled Book";
            const author = item.author || "Unknown Author";
            const genre = item.genre || "Unknown Genre";
            return `${title} \n \n \n by ${author} \n \n \n (${genre})`;
        }


        if (category === "Movie"){
            const title = item.title || "Untited Movie";
            const director = item.director || "Unknown Director";
            const genre = item.genre || "Unknown Genre";
            return `${title} \n \n \n  by ${director} \n \n \n (${genre})`;
        } 


        if (category === "Music"){
            const title = item.songTitle || "Untitled Song";
            const artist = item.artistName || "Unknown Artist";
            const genre = item.genreDescription || "Unknown Genre";
            return `${title} \n \n \n by ${artist} \n \n \n (${genre})`;
        }
        
        if (category === "Technology"){
            const title = item.title || "Untitled Device";
            const brand = item.manufacturerName || "Unknown Brand";
            return `${title} \n \n \n ${brand}`;

        } 

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
                            title={`${item?.title?? item?.songTitle ?? "Untitled"} by ${item?.author ?? item?.artistName ?? item?.manufacturerName ?? "Unknown"} (${item?.genre ?? item?.genreDescription ?? "Unknown Genre"})`}
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
                            onMouseEnter={(e) => item && (e.currentTarget.style.transform = "scale(1.05)")}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
                            >
                            {item ? (
                                <>
                                <img
                                    src={item.coverImagePath ?? item.imageUrl ?? defaultItemImage}
                                    alt={getDisplayTitle(item, title)}
                                    style={{
                                    width: "100%",
                                    height: "180px",
                                    objectFit: "cover",
                                    borderBottom: "1px solid #ccc",
                                    }}
                                />
                                <h4
                                    style={{
                                    fontSize: "0.85rem",
                                    margin: "0.5rem",
                                    fontWeight: 500,
                                    color: "#333",
                                    whiteSpace: "pre-line",
                                    }}
                                >
                                    {getDisplayTitle(item, title)}
                                </h4>
                                <Button
                                    size="small"
                                    variant="contained"
                                    style={{
                                    backgroundColor: "#0077cc",
                                    marginBottom: "0.5rem",
                                    padding: "0.3rem 0.7rem",
                                    fontSize: "0.75rem",
                                    }}
                                    onClick={() => handleCheckout(item, title)}
                                >
                                    Checkout
                                </Button>
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
                <Button onClick={() => setOpenCheckoutPage(true)}>View Cart ({checkoutCart.length})</Button>
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




                <input
                    type="text"
                    placeholder="Start typing to search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>




            {searchQuery && selectedTable && filteredItems.length > 0 && (
                <div className="search-results-row">
                    {filteredItems.map((item, index) => (
                        <div className="search-result-card" key={`${selectedTable}-${index}`}>

                                <img
                                loading="lazy"
                                src={item.coverImagePath ?? item.imageUrl ?? defaultItemImage}
                                alt="preview"
                                className="search-result-image"
                                />

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
                    Do you want to checkout: <strong>{itemToCheckout?.title}</strong>?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleConfirmCheckout}>Confirm</Button>
                </DialogActions>
            </Dialog>




            <Dialog open={openCheckoutPage} onClose={() => setOpenCheckoutPage(false)}>
                <DialogTitle>Cart</DialogTitle>
                <DialogContent>
                    {checkoutCart.length === 0 ? <p>Your cart is empty.</p> : (
                        <ul>
                            {checkoutCart.map((item, i) => (
                                <li key={i}>{getDisplayTitle(item, item._category)}</li>
                            ))}
                        </ul>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCheckoutPage(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};


export default Library;
