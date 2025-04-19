namespace LibraryWebAPI.Models.DTOs
{
    public class BookDTO
    {
        public string? Title { get; set; }
        public string? ISBN { get; set; }
        public int PublisherID { get; set; }
        public int BookGenreID { get; set; }
        public int BookAuthorID { get; set; }
        public int YearPublished { get; set; }
        public string? CoverImagePath { get; set; }
        public int TotalCopies { get; set; }

        public int AvailableCopies { get; set; } // Can choose to auto-set this on insert or allow manual input.
        public string? Location { get; set; }

        public int ItemTypeID { get; set; } 

        public bool IsDeactivated { get; set; } = false;
    }
}