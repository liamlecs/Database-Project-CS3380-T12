using System;
using System.Collections.Generic;

namespace LibraryWebAPI.Models;

public partial class MusicGenre
{
    public int MusicGenreId { get; set; }

    public string Description { get; set; } = null!;

    public virtual ICollection<Music> Musics { get; set; } = new List<Music>();
}
