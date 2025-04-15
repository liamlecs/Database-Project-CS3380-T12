namespace LibraryWebAPI.Models
{
    public class MusicDto
    {
        // This property represents the unique identifier for the item record.
        public int ItemId { get; set; }
        
        // This represents the unique identifier for the song, if applicable.
        public int SongId { get; set; }
        
        // Instead of having SongTitle, we’ll now use Title so it matches the front end.
        public string Title { get; set; } = string.Empty;  
        
        // Foreign key ID for the Music Artist.
        public int MusicArtistID { get; set; }
        
        // Foreign key ID for the Music Genre.
        public int MusicGenreID { get; set; }

        public string ArtistName { get; set; } = string.Empty;
        public string GenreDescription { get; set; } = string.Empty;

        
        // Total copies available for this music record.
        public int TotalCopies { get; set; }
        
        // Format could be "CD", "Digital", "Vinyl", etc. – keep this optional.
        public string? Format { get; set; }
        
        // The URL or path to the cover image.
        public string? CoverImagePath { get; set; }
        
        // The number of copies currently available.
        public int availableCopies { get; set; }
        
        // The physical location of the item.
        public string? itemLocation { get; set; }
        
        // For Music, we assume ItemTypeID is 3.
        public int ItemTypeID { get; set; } = 3;
    }
}

