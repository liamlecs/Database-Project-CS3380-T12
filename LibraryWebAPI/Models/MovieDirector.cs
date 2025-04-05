namespace LibraryWebAPI.Models;

public partial class MovieDirector
{
    public int MovieDirectorId { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    
    public virtual ICollection<Movie> Movies { get; set; } = new List<Movie>();
}
