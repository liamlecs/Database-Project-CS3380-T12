import React, { useState, useEffect } from "react";
import "./MusicForm.css";

const MusicForm: React.FC = () => {
    const [formData, setFormData] = useState({
        title: "",
        upc: "",
        musicArtistID: "",
        musicGenreID: "",
        yearReleased: "",
        format: "",
        coverImagePath: "",
        totalCopies: "",
        location: "",
        itemTypeID: 3,
    });

    const [artists, setArtists] = useState<any[]>([]);
    const [genres, setGenres] = useState<any[]>([]);
    const [newArtistName, setNewArtistName] = useState("");

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [artistRes, genreRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/MusicArtist`),
                    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/MusicGenre`)
                ]);

                if (!artistRes.ok || !genreRes.ok) throw new Error("Fetch failed");

                const artistData = await artistRes.json();
                const genreData = await genreRes.json();

                setArtists(artistData);
                setGenres(genreData);
            } catch (err) {
                console.error("Error fetching dropdown data:", err);
            }
        };

        fetchDropdownData();
    }, []);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const formDataToUpload = new FormData();
            formDataToUpload.append("Cover", file);

            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/Music/upload-cover`,
                    {
                        method: "POST",
                        body: formDataToUpload,
                    }
                );

                if (!res.ok) throw new Error("Upload failed");

                const data = await res.json();
                setFormData((prev) => ({
                    ...prev,
                    coverImagePath: data.url,
                }));
            } catch (err) {
                console.error("Cover upload error:", err);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            let finalArtistID: number;
            if (formData.musicArtistID === "other") {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/MusicArtist`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        artistName: newArtistName
                    })
                });

                if (!res.ok) throw new Error("Failed to create artist");

                const newArtistObj = await res.json();
                finalArtistID = newArtistObj.musicArtistId;
            } else {
                finalArtistID = parseInt(formData.musicArtistID, 10);
            }

            const payload = {
                Title: formData.title,
                UPC: formData.upc,
                MusicArtistID: finalArtistID,
                MusicGenreID: parseInt(formData.musicGenreID, 10),
                // YearReleased: parseInt(formData.yearReleased, 10),
                Format: formData.format,
                CoverImagePath: formData.coverImagePath,
                TotalCopies: parseInt(formData.totalCopies, 10),
                Location: formData.location,
                ItemTypeID: formData.itemTypeID
            };

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/Music/add-music`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            alert("Music added!");

            // Reset form
            setFormData({
                title: "",
                upc: "",
                musicArtistID: "",
                musicGenreID: "",
                yearReleased: "",
                format: "",
                coverImagePath: "",
                totalCopies: "",
                location: "",
                itemTypeID: 3,
            });

            setNewArtistName("");
        } catch (err) {
            console.error("Add music error:", err);
            alert("Failed to add music: " + err);
        }
    };

    return (
        <form className="music-form" onSubmit={handleSubmit}>
            <h2>Add New Music</h2>
            <div className="form-grid">
                <input
                    name="title"
                    placeholder="Album Title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                />
                <input
                    name="upc"
                    placeholder="UPC"
                    value={formData.upc}
                    onChange={handleInputChange}
                    required
                />

                {/* Artist Dropdown */}
                <select
                    name="musicArtistID"
                    value={formData.musicArtistID}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Artist</option>
                    {artists.map((artist) => (
                        <option key={artist.musicArtistId} value={artist.musicArtistId}>
                            {artist.artistName}
                        </option>
                    ))}
                    <option value="other">Other</option>
                </select>

                {/* "Other" Artist Name Input */}
                {formData.musicArtistID === "other" && (
                    <input
                        placeholder="Artist Name"
                        value={newArtistName}
                        onChange={(e) => setNewArtistName(e.target.value)}
                        required
                    />
                )}

                {/* Genre Dropdown */}
                <select
                    name="musicGenreID"
                    value={formData.musicGenreID}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Genre</option>
                    {genres.map((genre) => (
                        <option key={genre.musicGenreId} value={genre.musicGenreId}>
                            {genre.description}
                        </option>
                    ))}
                </select>

                {/* <input
                    name="yearReleased"
                    placeholder="Year Released"
                    type="number"
                    value={formData.yearReleased}
                    onChange={handleInputChange}
                    required
                /> */}
                <input
                    name="format"
                    placeholder="Format (e.g., CD, Digital)"
                    value={formData.format}
                    onChange={handleInputChange}
                    required
                />
                <input
                    name="totalCopies"
                    placeholder="Total Copies"
                    type="number"
                    value={formData.totalCopies}
                    onChange={handleInputChange}
                    required
                />
                {/* <input type="file" accept="image/*" onChange={handleImageUpload} /> */}
                <input
                    name="location"
                    placeholder="Location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <button type="submit">Add Music</button>
        </form>
    );
};

export default MusicForm;
