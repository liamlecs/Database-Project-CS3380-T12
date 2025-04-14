namespace LibraryWebAPI.Models
{

    public class MusicDto
    {
        public int itemId { get; set; }
        public int SongId { get; set; }
        public string? Format { get; set; }
        public string? CoverImagePath { get; set; }
        public required string ArtistName { get; set; }
        virtual public string? SongTitle { get; set; }
        public required string GenreDescription { get; set; }
        public int availableCopies { get; set; }

        public string? itemLocation { get; set; }

        public int ItemTypeID { get; set; } = 3; // Assuming 3 is the ID for Music
    }

}
