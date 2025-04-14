import React, { useState, useEffect } from "react";
import "./MusicForm.css"; // Reusing the same styles as BookForm

const MusicForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    musicArtistId: "", // Dropdown with the artist's numeric ID
    musicGenreID: "", // Numeric IDs for genres
    format: "",
    coverImagePath: "",
    totalCopies: "",
    location: "",
    itemTypeID: 3, // Fixed for Music
  });

  const [artists, setArtists] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);

  const [newArtistName, setNewArtistName] = useState(""); // Single field for artist name

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [artistRes, genreRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/MusicArtist`),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/MusicGenre`),
        ]);

        if (!artistRes.ok || !genreRes.ok) {
          throw new Error("Failed to fetch dropdown options");
        }

        const artistData = await artistRes.json();
        const genreData = await genreRes.json();

        //See what backend is returning
        //console.log("Artist data:", artistData);
        //console.log("Genre data:", genreData);

        setArtists(artistData);
        setGenres(genreData);
      } catch (err) {
        console.error("Dropdown fetch error:", err);
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
          `${import.meta.env.VITE_API_BASE_URL}/api/Book/upload-cover`,
          {
            method: "POST",
            body: formDataToUpload,
          }
        );

        if (!res.ok) {
          throw new Error("Image upload failed");
        }

        const data = await res.json();
        setFormData((prev) => ({
          ...prev,
          coverImagePath: data.url,
        }));
      } catch (err) {
        console.error("Error uploading cover image:", err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let finalArtistID: number;
      if (formData.musicArtistId === "other") {
        const createArtistRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/MusicArtist`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: newArtistName, // Use single name field
            }),
          }
        );
        if (!createArtistRes.ok) {
          throw new Error("Failed to create Artist");
        }
        const newArtistObj = await createArtistRes.json();
        finalArtistID = newArtistObj.musicArtistId;
      } else {
        finalArtistID = parseInt(formData.musicArtistId, 10);
      }

      const finalGenreID = parseInt(formData.musicGenreID, 10);
      const finalTotalCopies = parseInt(formData.totalCopies, 10);

      const payload = {
        Title: formData.title,
        musicArtistId: finalArtistID,
        MusicGenreID: finalGenreID,
        Format: formData.format,
        CoverImagePath: formData.coverImagePath,
        TotalCopies: finalTotalCopies,
        Location: formData.location,
        ItemTypeID: formData.itemTypeID,
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

      alert("Music added successfully!");

      setFormData({
        title: "",
        musicArtistId: "",
        musicGenreID: "",
        format: "",
        coverImagePath: "",
        totalCopies: "",
        location: "",
        itemTypeID: 3,
      });
      setNewArtistName(""); // Reset new artist name
    } catch (err) {
      console.error("Error adding music:", err);
      alert("Failed to add music: " + err);
    }
  };

  return (
    <form className="music-form" onSubmit={handleSubmit}>
      <h2 style={{ textAlign: "center", width: "100%" }}>Add New Music</h2>
      <div className="form-grid">
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />

        <select
          name="musicArtistId"
          value={formData.musicArtistId}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Artist</option>
          {artists.map((artist) => (
            <option
              key={artist.musicArtistId}
              value={artist.musicArtistId}
            >
              {artist.artistName} {/* Use single name field */}
            </option>
          ))}
          <option value="other">Other</option>
        </select>
        {formData.musicArtistId === "other" && (
          <input
            type="text"
            placeholder="Artist Name"
            value={newArtistName}
            onChange={(e) => setNewArtistName(e.target.value)}
            required
          />
        )}

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

        <input type="file" accept="image/*" onChange={handleImageUpload} />

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