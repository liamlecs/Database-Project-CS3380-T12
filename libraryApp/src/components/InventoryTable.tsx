import React, { useEffect, useState } from "react";
import "./UserProfile.css";
import { DataGrid } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";

function mapItemType(typeID: number | string) {
    const id = Number(typeID); // force string like "1" into number 1
    switch (id) {
        case 1:
            return "Book";
        case 2:
            return "Movie";
        case 3:
            return "Music";
        case 4:
            return "Technology";
        default:
            return "Unknown";
    }
}

    interface InventoryItem {
        itemID: number;
        title: string;
        itemTypeID: number;
        availabilityStatus: string;
        location?: string;
        totalCopies: number;
        availableCopies: number;
    }



export default function InventoryTable() {
    const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);

    const [itemTypeFilter, setItemTypeFilter] = useState("all");
    const [availabilityFilter, setAvailabilityFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        async function fetchInventory() {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Item`);
                if (!res.ok) throw new Error("Failed to fetch inventory");
                const data = await res.json();
                setInventoryData(data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchInventory();
    }, []);


    const filteredInventory = inventoryData.filter((item) => {
        const matchesTitle = item.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = itemTypeFilter === "all" || item.itemTypeID === Number(itemTypeFilter);
        const matchesAvailability =
            availabilityFilter === "all" || item.availabilityStatus === availabilityFilter;
        return matchesTitle && matchesType && matchesAvailability;
    });

    return (
        <div className="inventory-section">
            <h2>Inventory</h2>

            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                <TextField
                    label="Search by Title"
                    size="small"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ minWidth: 250 }}
                />

                <FormControl size="small" style={{ minWidth: 150 }}>
                    <Select
                        value={itemTypeFilter}
                        onChange={(e) => setItemTypeFilter(e.target.value)}
                        displayEmpty
                    >
                        <MenuItem value="all">All Types</MenuItem>
                        <MenuItem value={1}>Book</MenuItem>
                        <MenuItem value={2}>Movie</MenuItem>
                        <MenuItem value={3}>Music</MenuItem>
                        <MenuItem value={4}>Technology</MenuItem>
                    </Select>
                </FormControl>

                <FormControl size="small" style={{ minWidth: 150 }}>
                    <Select
                        value={availabilityFilter}
                        onChange={(e) => setAvailabilityFilter(e.target.value)}
                        displayEmpty
                    >
                        <MenuItem value="all">All Statuses</MenuItem>
                        <MenuItem value="Available">Available</MenuItem>
                        <MenuItem value="Reserved">Reserved</MenuItem>
                    </Select>
                </FormControl>
            </div>

            <div style={{ height: 600, width: "100%" }}>
                <DataGrid
                    rows={filteredInventory.map((item, index) => ({
                        id: item.itemID || index,
                        title: item.title,
                        itemType: mapItemType(item.itemTypeID),
                        availabilityStatus: item.availabilityStatus,
                        location: item.location || "N/A",
                        totalCopies: item.totalCopies,
                        availableCopies: item.availableCopies,
                    }))}
                    columns={[
                        { field: "title", headerName: "Title", flex: 2 },
                        { field: "itemType", headerName: "Type", flex: 1 },
                        { field: "availabilityStatus", headerName: "Status", flex: 1 },
                        { field: "location", headerName: "Location", flex: 1 },
                        { field: "totalCopies", headerName: "Total Copies", flex: 1 },
                        { field: "availableCopies", headerName: "Available Copies", flex: 1 },
                    ]}
                    pageSizeOptions={[10, 20, 30]}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 20, page: 0 } },
                    }}
                    disableRowSelectionOnClick
                />
            </div>
        </div>
    );
}
