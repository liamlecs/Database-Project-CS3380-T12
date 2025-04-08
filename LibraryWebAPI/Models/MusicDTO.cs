namespace LibraryWebAPI.Models{
public class MusicDto
{
    public int itemId { get; set; }
    public int SongId { get; set; }
    public string? Format { get; set; }
    public string? CoverImagePath { get; set; }
    public string? ArtistName { get; set; }
    virtual public string? SongTitle { get; set; }
    public string? GenreDescription { get; set; }
}
}