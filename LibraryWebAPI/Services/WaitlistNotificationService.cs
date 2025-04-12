using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using LibraryWebAPI.Data;
using LibraryWebAPI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

public class WaitlistNotification
{
            [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int NotificationId { get; set; }
    public int WaitlistId { get; set; }
    public int CustomerId { get; set; }
    public int ItemId { get; set; }
    public DateTime? DueDate { get; set; }
    public bool EmailSent { get; set; }
    public DateTime? ProcessedDate { get; set; }
}

public class WaitlistNotificationService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<WaitlistNotificationService> _logger;
    private readonly IEmailService _emailService;

    public WaitlistNotificationService(IServiceScopeFactory scopeFactory, ILogger<WaitlistNotificationService> logger, IEmailService emailService)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
        _emailService = emailService;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = _scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<LibraryContext>();

            var pending = await context.WaitlistNotifications
                .Where(n => n.EmailSent == false)
                .ToListAsync(stoppingToken);

            foreach (var notification in pending)
            {
                try
                {
                    var customer = await context.Customers
                        .FirstOrDefaultAsync(c => c.CustomerId == notification.CustomerId, stoppingToken);

                    if (customer != null)
                    {
                        var subject = "Your reserved item is now available!";
                        var body = $"Hello {customer.FirstName},\n\nYour reserved item is now available.It is due on {notification.DueDate:MMMM dd, yyyy}. Have a good day!";

                        await _emailService.SendEmailAsync(customer.Email, subject, body);

                        notification.EmailSent = true;
                        context.Update(notification);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Failed to process notification ID {notification.NotificationId}");
                }
            }

            await context.SaveChangesAsync(stoppingToken);
            await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken); // adjust interval as needed
        }
    }
}
