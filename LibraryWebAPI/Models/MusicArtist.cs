namespace LibraryWebAPI.Models
{
    public partial class MusicArtist
    {
        public int MusicArtistId { get; set; }

        public string ArtistName { get; set; } = string.Empty;

        public virtual ICollection<Music> Musics { get; set; } = new List<Music>();
    }
}
