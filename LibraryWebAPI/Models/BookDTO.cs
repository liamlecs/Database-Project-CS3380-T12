namespace LibraryWebAPI.Models.DTOs
{
    public class BookDTO
    {
        public int BookId { get; set; }
        public string? Title { get; set; } // From Item table
        public string? Author { get; set; } // From BookAuthor table
        public string? ISBN { get; set; } // From Book table
        public string? Genre { get; set; } // From BookGenre table
    }
}