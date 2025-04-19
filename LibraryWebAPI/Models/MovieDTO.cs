namespace LibraryWebAPI.Models
{
public class MovieDTO
{
    public required string Title { get; set; }
    public required string UPC { get; set; }                  // Unique Product Code
    public int MovieDirectorID { get; set; }         // FK reference to a Movie Director table
    public int MovieGenreID { get; set; }            // FK reference to a Movie Genre table
    public int YearReleased { get; set; }
    public required string Format { get; set; }               // E.g. DVD, Blu-ray, Digital
    public required string CoverImagePath { get; set; }
    public int TotalCopies { get; set; }
    public int AvailableCopies { get; set; }
    public required string Location { get; set; }
    public int ItemTypeID { get; set; } = 2;          // Assuming 2 represents Movies

    public bool IsDeactivated { get; set; } = false;
}

}
