using System;
using System.Collections.Generic;

namespace LibraryWebAPI.Models;

public partial class Movie
{
    public int MovieId { get; set; }           // Primary key
    public string Upc { get; set; } = null!;   // Unique code, like ISBN
    public int MovieDirectorId { get; set; }   // Foreign key to MovieDirector
    public int MovieGenreId { get; set; }      // Foreign key to MovieGenre
    public int YearReleased { get; set; }      // Required year
    public string? Format { get; set; }        // Optional: DVD, Blu-Ray, Digital
    public string? CoverImagePath { get; set; } // Optional: path to image
    public int ItemId { get; set; }            // Foreign key to Item

    public virtual MovieDirector MovieDirector { get; set; } = null!;
    public virtual MovieGenre MovieGenre { get; set; } = null!;
    public virtual Item Item { get; set; } = null!;

    public bool IsDeactivated { get; set; } = false;
}