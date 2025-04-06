namespace LibraryWebAPI.Models
{
    public partial class MusicArtist
    {
        public int MusicArtistId { get; set; }

        public string ArtistName { get; set; } = null!;

        public virtual ICollection<Music> Musics { get; set; } = new List<Music>();
    }
}
