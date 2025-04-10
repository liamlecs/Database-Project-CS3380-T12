namespace LibraryWebAPI.Models
{
    public class MovieDTO
    {
        public int MovieId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string UPC { get; set; } = string.Empty;
        public string Format { get; set; } = string.Empty;
        public int YearReleased { get; set; }
        public string Director { get; set; } = "Unknown Director";
        public string Genre { get; set; } = "Unknown Genre";
        public string CoverImagePath { get; set; } = string.Empty;

        public int availableCopies { get; set; }

        public string itemLocation { get; set; } = string.Empty;
        
        public int ItemId { get; set; }
    }
}
