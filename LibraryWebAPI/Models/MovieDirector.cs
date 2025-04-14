using System.Text.Json.Serialization; // Use this if you're using System.Text.Json
namespace LibraryWebAPI.Models;

public partial class MovieDirector
{
    public int MovieDirectorId { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    
    [JsonIgnore]
    public virtual ICollection<Movie> Movies { get; set; } = new List<Movie>();
}
