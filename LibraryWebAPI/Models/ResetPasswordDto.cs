namespace LibraryWebAPI.Models
{
    public class ResetPasswordDto
    {
        public required string Token { get; set; }
        public required string NewPassword { get; set; }
    }
}
