public class SearchResultDTO
{
    public int Id { get; set; }  // Generic ID (BookID, MovieID, etc.)
    public string? Title { get; set; }  // Book Title, Movie Title, etc.
    public string? Category { get; set; }  // "Book", "Movie", "Music", "Technology"
    public string? Description { get; set; }  // Optional (e.g., book summary, movie synopsis)
    public string? AdditionalInfo { get; set; }  // Author Name, Director, Manufacturer, etc.
    public DateTime? ReleaseDate { get; set; }  // Optional
}
