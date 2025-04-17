
namespace LibraryWebAPI.Models;
using Microsoft.EntityFrameworkCore;

[Keyless]
public class WaitlistNotificationDto
{
    public int NotificationId { get; set; }
    public string? Title { get; set; }
    public string? TypeName { get; set; }
    public DateTime? ExpirationDate { get; set; }
}