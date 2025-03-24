namespace LibraryWebAPI.Models
{
    public class ConfirmEmailDto
    {
        public string Email { get; set; } = string.Empty;
        public string ConfirmationCode { get; set; } = string.Empty;
    }
}
