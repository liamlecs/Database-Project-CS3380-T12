import React, { useEffect, useMemo, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import "./Library.css";
import welcomeBg from "../../assets/welcome_background.jpg";
import defaultItemImage from "../../assets/welcome_background.jpg";
import { useCheckout } from "../../contexts/CheckoutContext";

// Read the public asset base URL from an environment variable.
// For example, in production, set VITE_PUBLIC_ASSET_BASE_URL=https://api.yourdomain.com in your environment.
const publicAssetBaseUrl = import.meta.env.VITE_PUBLIC_ASSET_BASE_URL || "";

/**
 * Resolves the cover image URL.
 * - If the URL contains "localhost:5217", replace that part with the public base URL.
 * - Otherwise, return the URL as is.
 */
const resolveCoverImageUrl = (coverImagePath?: string, fallback?: string): string => {
  if (!coverImagePath) {
    return fallback || defaultItemImage;
  }
  
  // If the URL contains the local host, replace it.
  if (coverImagePath.includes("localhost:5217")) {
    return coverImagePath.replace("http://localhost:5217", publicAssetBaseUrl);
  }
  
  // Otherwise, if it is already an absolute URL, return as is.
  // For relative URLs (like "/book_covers/Clean_Code.jpg") return as is.
  return coverImagePath;
};


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
    const [openFineDialog, setOpenFineDialog] = useState(false);
    const [openMaxCheckoutDialog, setOpenMaxCheckoutDialog] = useState(false);
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

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const handleCheckout = async (item: any, category: string) => {

        const customerIdStr = localStorage.getItem("userId");
        if (!customerIdStr) {
          alert("You need to be logged in with a customer account to use this feature. Please log in.");
          return;
        }
        const customerId = Number.parseInt(customerIdStr, 10);
        try {

        const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/Customer/CheckFine/${customerId}`
          );

          const fineCheck = await response.json();

        if(fineCheck.activeFineCount>0)
        setOpenFineDialog(true);
    else{
        
        setItemToCheckout({ ...item, _category: category });
        setOpenDialog(true);
    }
    } catch (err) {
        console.error("Fetch error", err);
      }
    };



    const handleJoinWaitlist = async (item: any) => {
        try {
          // 1. Ensure the customer is logged in.
          const isLoggedIn = localStorage.getItem("isLoggedIn");
          if (isLoggedIn !== "true") {
            alert("You must be logged in to join a waitlist.");
            return;
          }
      
          // 2. Retrieve the CustomerId from localStorage.
          const customerIdStr = localStorage.getItem("userId");
          if (!customerIdStr) {
            alert("No user ID found. Please log in again.");
            return;
          }
          const customerId = parseInt(customerIdStr, 10);
      
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/Customer/CheckFine/${customerId}`
          );

          const fineCheck = await response.json();


          const transactionHistoryResponse = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/TransactionHistory/${customerId}`
          );
      
          let activeTransactions: any[] = [];
      
          if (transactionHistoryResponse.status === 404 || transactionHistoryResponse.status === 204) {
            activeTransactions = [];
          } else if (!transactionHistoryResponse.ok) {
            const errorText = await transactionHistoryResponse.text();
            throw new Error(`Failed to fetch transaction history: ${errorText}`);
          } else {
            activeTransactions = await transactionHistoryResponse.json();
          }
      
          // Count active transactions (items not returned)
          const activeItemCount = activeTransactions.filter(
            (transaction: { returnDate: string | null }) => transaction.returnDate === null
          ).length;

          //retirevie borrower type
          const borrowerTypeId = localStorage.getItem("borrowerTypeId");

          const borrowingLimit = borrowerTypeId === "2" ? 10 : 5;

        if(fineCheck.activeFineCount>0 )
        setOpenFineDialog(true);
    else
    if(activeItemCount>=borrowingLimit){

setOpenMaxCheckoutDialog(true);

    }
      else{

          // 3. Determine the current ItemID (ensure you use the correct property from your item object).
          const currentItemId = item.itemId || item.id;
          if (!currentItemId) {
            alert("No item id available for this item.");
            return;
          }
      
          // 4. Fetch current waitlist entries to check for an existing entry.
          const waitlistResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Waitlist`);
          if (!waitlistResponse.ok) {
            alert("Error checking waitlist. Please try again later.");
            return;
          }
          const existingWaitlists = await waitlistResponse.json();
      
          // 5. Check if this customer is already in the waitlist for the current item and hasn't received the item yet.
          const alreadyWaitlisted = existingWaitlists.some(
            (entry: any) =>
              entry.customerId === customerId &&
              entry.itemId === currentItemId &&
              entry.isReceived === false
          );
          if (alreadyWaitlisted) {
            alert("You are already in the waitlist for this item.");
            return;
          }
      
          // 6. Prepare a new waitlist entry.
          const newWaitlistEntry = {
            customerId,
            itemId: currentItemId,
            reservationDate: new Date().toISOString(), // set current date/time in ISO format
            isReceived: false,
          };
      
          // 7. Send a POST request to join the waitlist.
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Waitlist`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newWaitlistEntry),
          });
      
          // 8. Handle errors from the POST.
          if (!response.ok) {
            const errorData = await response.json();
            console.error("Error details:", errorData);
            throw new Error(`Failed to join the waitlist: ${errorData.title || "Unknown Error"}`);
          }
      
          // 9. Parse the created waitlist record.
          const createdWaitlist = await response.json();
          console.log("Waitlist entry created:", createdWaitlist);
      
          // 10. Notify the user.
          alert("Successfully joined the waitlist!");
        
        }
        
        }
        
        catch (error) {
          console.error("Error joining waitlist:", error);
          alert("There was an error joining the waitlist. Please try again later.");
        }
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
        console.log("Selected item:", item);
        setOpenInfoDialog(true);
    };

    const getDisplayTitle = (item: any, category: string): string => {
        if (!item) return "Untitled";
        if (category === "Book") return `${item.title || "Untitled Book"}\n\nby ${item.author || "Unknown Author"}\n\n(${item.genre || "Unknown Genre"})`;
        if (category === "Movie") {
          const movieTitle = item.item?.title || "Untitled Movie";
          const directorName = item.movieDirector
            ? `${item.movieDirector.firstName} ${item.movieDirector.lastName}`
            : "Unknown Director";
          const genreName = item.movieGenre
            ? item.movieGenre.description
            : "Unknown Genre";
        
          return `${movieTitle}\n\nby ${directorName}\n\n(${genreName})`;
        }
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
                <div className="carousel-header" style={{ 
    display: "flex", 
    justifyContent: "center",  // Changed from space-between to center
    alignItems: "center",
    width: "100%",
    padding: "0 1rem"  // Optional: Add some side padding
}}>
                    <h3>{title}</h3>
                    {/* <a href="#" style={{ fontSize: "0.9rem" }}>View All</a> */}
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
                                            src={resolveCoverImageUrl(item.coverImagePath ?? item.imageUrl ?? defaultItemImage)}
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
        <div className="library-container" style={{ marginTop: "80px" }}>
            <div className="welcome-message" style={{ backgroundImage: `url(${welcomeBg})` }}>
                <h1>Your Gateway to Discovery and Innovation!</h1>
            </div>

            <div className="search-bar-container-row">
                <select value={selectedTable} onChange={(e) => { setSelectedTable(e.target.value); setItems([]); setSearchQuery(""); }}>
                    <option value="">-- Select Table --</option>
                    {tables.map((table) => <option key={table} value={table}>{table}</option>)}
                </select>
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
  
  {/* Conditionally show fields only if they exist */}
  {(selectedItem?.author) && (
    <p><strong>Author:</strong> {selectedItem?.author}</p>
  )}
  
  {selectedItem?.isbn && (
    <p><strong>ISBN:</strong> {selectedItem.isbn}</p>
  )}

    {selectedItem?.publisher && (
        <p><strong>Publisher:</strong> {selectedItem.publisher}</p>
    )}
    
    {(selectedItem?.director) && (
        <p><strong>Director:</strong> {selectedItem?.director}</p>
    )}
    
    {(selectedItem?.artistName) && (
        <p><strong>Artist:</strong> {selectedItem?.artistName}</p>
    )}

    {(selectedItem?.format) && (
            <p><strong>Format:</strong> {selectedItem?.format}</p>
    )}
    
    {(selectedItem?.manufacturerName) && (
        <p><strong>Manufacturer:</strong> {selectedItem?.manufacturerName}</p>
    )}

    {(selectedItem?.modelNumber) && (
            <p><strong>Model Number:</strong> {selectedItem?.modelNumber}</p>
    )}

    {(selectedItem?.upc) && (
            <p><strong>UPC:</strong> {selectedItem?.upc}</p>
    )}

    {(selectedItem?.deviceTypeName) && (
            <p><strong>Device Type:</strong> {selectedItem?.deviceTypeName}</p>
    )}


  
  {(selectedItem?.genre || selectedItem?.genreDescription) && (
    <p><strong>Genre:</strong> {selectedItem?.genre ?? selectedItem?.genreDescription}</p>
  )}
  
  {selectedItem?.availableCopies !== undefined && (
    <p><strong>Available Copies:</strong> {selectedItem.availableCopies}</p>
  )}
  
  {selectedItem?.itemLocation && (
    <p><strong>Item Location:</strong> {selectedItem.itemLocation}</p>
  )}
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
                {/* If no copies are available, show "Join Waitlist" */}
                {selectedItem?.availableCopies === 0 && (
                    <Button
                    onClick={() => {
                        handleJoinWaitlist(selectedItem); // Implement this function to handle waitlist logic
                        setOpenInfoDialog(false);
                    }}
                    variant="contained"
                    color="secondary"
                    >
                    Join Waitlist
                    </Button>
                )}
                </DialogActions>
            </Dialog>

            <Dialog open={openFineDialog} onClose={() => setOpenFineDialog(false)}>
  <DialogTitle>Unpaid Fine Detected</DialogTitle>
  <DialogContent>
    <Typography>
      You currently have an unpaid fine. Please resolve your fine before checking out any new items.
    </Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenFineDialog(false)} color="primary">
      OK
    </Button>
  </DialogActions>
</Dialog>

<Dialog open={openMaxCheckoutDialog} onClose={() => setOpenMaxCheckoutDialog(false)}>
  <DialogTitle>Maximum Borrowing Limit Reached</DialogTitle>
  <DialogContent>
    <Typography>
      You currently have have reached your borrowing limit. Please return one of your current checkouts before joining a waitlist.
    </Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenMaxCheckoutDialog(false)} color="primary">
      OK
    </Button>
  </DialogActions>
</Dialog>

        </div>
    );
};

export default Library;
