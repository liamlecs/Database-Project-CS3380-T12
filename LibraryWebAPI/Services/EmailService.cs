using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;

namespace LibraryWebAPI.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;
        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            var smtpHost = _config["Smtp:Host"];
            if (!int.TryParse(_config["Smtp:Port"], out var smtpPort))
            {
                throw new InvalidOperationException("Invalid or missing SMTP port configuration.");
            }
            var smtpUser = _config["Smtp:Username"];
            var smtpPass = _config["Smtp:Password"];
            var fromAddress = _config["Smtp:From"];

            using var message = new MailMessage();
            message.To.Add(to);
            message.Subject = subject;
            message.Body = body;
            message.IsBodyHtml = false;
            if (string.IsNullOrWhiteSpace(fromAddress))
            {
                throw new InvalidOperationException("The 'From' address is not configured or is invalid.");
            }
            message.From = new MailAddress(fromAddress);

            using var client = new SmtpClient(smtpHost, smtpPort)
            {
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(smtpUser, smtpPass),
                EnableSsl = true // for port 587
            };

            await client.SendMailAsync(message);
        }
    }
}
