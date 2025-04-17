namespace LibraryWebAPI.Models
{
public class LoginRequestDto
{
    /// <summary>
    /// "customer" or "employee"
    /// </summary>
    public string Mode { get; set; } = "";

    /// <summary>
    /// only used when Mode == "customer"
    /// </summary>
    public string? Email { get; set; }

    /// <summary>
    /// only used when Mode == "employee"
    /// </summary>
    public string? Username { get; set; }

    public string Password { get; set; } = "";
}
}
