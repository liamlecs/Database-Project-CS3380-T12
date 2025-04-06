namespace LibraryWebAPI.Models{
public class MusicDto
{
    public int SongId { get; set; }
    public string? Format { get; set; }
    public string? CoverImagePath { get; set; }
    public string? ArtistName { get; set; }
    public string? GenreDescription { get; set; }
}
}