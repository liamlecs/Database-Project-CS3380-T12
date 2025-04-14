using System;
using System.Collections.Generic;
using System.Text.Json.Serialization; // Use this if you're using System.Text.Json
namespace LibraryWebAPI.Models;

public partial class MovieGenre
{
    public int MovieGenreId { get; set; }

    public string Description { get; set; } = null!;


    [JsonIgnore] // Prevent circular reference when serializing
    public virtual ICollection<Movie> Movies { get; set; } = new List<Movie>();
}
