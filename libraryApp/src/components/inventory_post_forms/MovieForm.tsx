import React, { useState, useEffect } from "react";
import "./MovieForm.css"; // Using the same styles as the BookForm

const MovieForm: React.FC = () => {
  // Form state: keys align with MovieDTO properties.
  const [formData, setFormData] = useState({
    title: "",
    upc: "",
    movieDirectorID: "",  // We'll use a dropdown with the director's numeric ID.
    movieGenreID: "",     // Now only numeric IDs; no "other" option.
    yearReleased: "",
    format: "",
    coverImagePath: "",
    totalCopies: "",
    location: "",
    itemTypeID: 2,  // Fixed for Movies.
  });

  // Dropdown data arrays for directors and genres.
  const [directors, setDirectors] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);

  // State for "Other" for director only.
  const [newDirectorFirstName, setNewDirectorFirstName] = useState("");
  const [newDirectorLastName, setNewDirectorLastName] = useState("");

  // Fetch dropdown options on mount.
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [directorRes, genreRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/MovieDirector`),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/MovieGenre`)
        ]);

        if (!directorRes.ok || !genreRes.ok) {
          throw new Error("Failed to fetch dropdown options");
        }

        const directorData = await directorRes.json();
        const genreData = await genreRes.json();

        // console.log("Director data:", directorData);
        // console.log("Genre data:", genreData);

        setDirectors(directorData);
        setGenres(genreData);
      } catch (err) {
        console.error("Dropdown fetch error:", err);
      }
    };

    fetchDropdownData();
  }, []);

  // Common input change handler.
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // File upload handler for cover image.
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
        console.log("DEBUG: coverImagePath=", data.url);
        setFormData((prev) => ({
          ...prev,
          coverImagePath: data.url,
        }));
      } catch (err) {
        console.error("Error uploading cover image:", err);
      }
    }
  };

  // Form submission handler.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Resolve movie director.
      let finalDirectorID: number;
      if (formData.movieDirectorID === "other") {
        const createDirectorRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/MovieDirector`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: newDirectorFirstName,
            lastName: newDirectorLastName
          })
        });
        if (!createDirectorRes.ok) {
          throw new Error("Failed to create Director");
        }
        const newDirectorObj = await createDirectorRes.json();
        finalDirectorID = newDirectorObj.movieDirectorId;
      } else {
        finalDirectorID = parseInt(formData.movieDirectorID, 10);
      }

      // Note: With genres we no longer allow "Other"
      const finalGenreID = parseInt(formData.movieGenreID, 10);
      const finalYearReleased = parseInt(formData.yearReleased, 10);
      const finalTotalCopies = parseInt(formData.totalCopies, 10);

      const payload = {
        Title: formData.title,
        UPC: formData.upc,
        MovieDirectorID: finalDirectorID,
        MovieGenreID: finalGenreID,
        YearReleased: finalYearReleased,
        Format: formData.format,
        CoverImagePath: formData.coverImagePath,
        TotalCopies: finalTotalCopies,
        Location: formData.location,
        ItemTypeID: formData.itemTypeID
      };

      console.log("Final payload:", payload);


      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/Movie/add-movie`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Something went wrong. Please try again.");
        return;
      }

      alert("Movie added successfully!");

      // Reset the form.
      setFormData({
        title: "",
        upc: "",
        movieDirectorID: "",
        movieGenreID: "",
        yearReleased: "",
        format: "",
        coverImagePath: "",
        totalCopies: "",
        location: "",
        itemTypeID: 2,
      });
      // Clear new director fields.
      setNewDirectorFirstName("");
      setNewDirectorLastName("");
    } catch (err) {
      console.error("Error adding movie:", err);
      alert("Failed to add movie: " + err);
    }
  };

  return (
    <form className="movie-form" onSubmit={handleSubmit}>
      <h2 style={{ textAlign: "center", width: "100%" }}>Add New Movie</h2>
      <div className="form-grid">
        <input
          name="title"
          placeholder="Title"
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

        {/* Movie Director Dropdown */}
        <select
          name="movieDirectorID"
          value={formData.movieDirectorID}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Director</option>
          {directors.map((director) => (
            <option
              key={director.movieDirectorId}
              value={director.movieDirectorId} // Numeric ID used as value.
            >
              {director.firstName} {director.lastName}
            </option>
          ))}
          <option value="other">Other</option>
        </select>
        {formData.movieDirectorID === "other" && (
          <>
            <input
              type="text"
              placeholder="Director's First Name"
              value={newDirectorFirstName}
              onChange={(e) => setNewDirectorFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Director's Last Name"
              value={newDirectorLastName}
              onChange={(e) => setNewDirectorLastName(e.target.value)}
              required
            />
          </>
        )}

        {/* Movie Genre Dropdown */}
        <select
          name="movieGenreID"
          value={formData.movieGenreID}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Genre</option>
          {genres.map((genre) => (
            <option key={genre.movieGenreId} value={genre.movieGenreId}>
              {genre.description}
            </option>
          ))}
        </select>

        <input
          name="yearReleased"
          placeholder="Year Released"
          type="number"
          value={formData.yearReleased}
          onChange={handleInputChange}
          required
        />
        <input
          name="format"
          placeholder="Format (e.g., DVD, Blu-ray)"
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
       <input
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleInputChange}
          required
        />
        <input type="file" accept="image/*" onChange={handleImageUpload} />

 
      </div>
      <button type="submit">Add Movie</button>
    </form>
  );
};

export default MovieForm;
