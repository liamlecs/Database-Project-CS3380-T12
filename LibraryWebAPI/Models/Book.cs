namespace LibraryWebAPI.Models
{
    public class Book
    {
        public required int BookId { get; set; }
        public required int ISBN { get; set; }
        public required int PublisherId { get; set; }
        public required int BookGenreId { get; set; }
        public required int BookAuthorId { get; set; }
        public required int YearPublished { get; set; }
    }
}
