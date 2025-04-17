using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryWebAPI.Data;
using LibraryWebAPI.Models;
using System.Threading.Tasks;
using LibraryWebAPI.Services;

namespace LibraryWebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly LibraryContext _context;

        public AuthController(LibraryContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
    {
        if (dto.Mode == "employee")
        {
            // 1) Employee flow
            var emp = await _context.Employees
                                    .FirstOrDefaultAsync(e => e.Username == dto.Username);
            if (emp == null || emp.AccountPassword != dto.Password)
                return Unauthorized(new { message = "Invalid employee credentials." });

            return Ok(new {
                message       = "Employee login successful!",
                isEmployee    = true,
                username      = emp.Username,
                EmployeeID    = emp.EmployeeId,
                firstName     = emp.FirstName,
                lastName      = emp.LastName,
                birthDate     = emp.BirthDate?.ToString("yyyy-MM-dd")
            });
        }
        else if (dto.Mode == "customer")
        {
            // 2) Customer flow
            var cust = await _context.Customers
                                     .FirstOrDefaultAsync(c => c.Email == dto.Email && c.IsActive);
            if (cust == null || cust.AccountPassword != dto.Password)
                return Unauthorized(new { message = "Invalid customer credentials or account deactivated" });

            if (!cust.EmailConfirmed)
                return StatusCode(403, new { message = "Please confirm your email before logging in." });

            return Ok(new {
                message      = "Customer login successful!",
                isEmployee   = false,
                userId       = cust.CustomerId,
                firstName    = cust.FirstName,
                lastName     = cust.LastName,
                email        = cust.Email,
                borrowerTypeId = cust.BorrowerTypeId
            });
        }

        return BadRequest(new { message = "Login mode must be either 'customer' or 'employee'" });
    }

        // // 1) Employee Login Endpoint
        // [HttpPost("employee-login")]
        // public async Task<IActionResult> EmployeeLogin([FromBody] EmployeeLoginDto dto)
        // {
        //     // Look up employee by Username
        //     var employee = await _context.Employees
        //         .FirstOrDefaultAsync(e => e.Username == dto.Username);

        //     // Validate password
        //     if (employee == null || employee.AccountPassword != dto.Password)
        //     {
        //         return Unauthorized(new { message = "Invalid employee credentials." });
        //     }

        //     // Return success
        //     return Ok(new {
        //         message = "Employee login successful!",
        //         isEmployee = true,
        //         username = employee.Username,
        //         debugTime = DateTime.Now.ToString(), // something obviously new
        //         EmployeeID = employee.EmployeeId,
        //         firstName = employee.FirstName,
        //         lastName = employee.LastName,
        //         birthDate = employee.BirthDate?.ToString("yyyy-MM-dd")
        //     });
        // }

        [HttpPost("forgot-password")]
public async Task<IActionResult> ForgotPassword(
    [FromBody] ForgotPasswordDto dto,
    [FromServices] IEmailService emailService)
{
    // Look for an active customer account with the provided email
    var customer = await _context.Customers
        .FirstOrDefaultAsync(c => c.Email == dto.Email && c.IsActive);

    // Always return a generic response so as not to reveal whether the email exists
    if (customer == null)
    {
        return Ok(new { message = "If an account with that email exists, you will receive password reset instructions." });
    }

    // Generate a secure token (for example, using a GUID)
    var token = Guid.NewGuid().ToString();

    // Store the token and set an expiration (e.g., 1 hour)
    customer.ResetPasswordToken = token;
    customer.ResetPasswordTokenExpiration = DateTime.UtcNow.AddHours(1);
    await _context.SaveChangesAsync();

    // Build a password reset link (adjust the URL as needed for your frontend)
    var resetLink = $"https://e-libraryuh.vercel.app/ResetPassword?token={token}";

    // Prepare email contents
    string subject = "Password Reset Request";
    string body = $"You have requested to reset your password. Please click the link below to reset your password:\n\n" +
                  $"{resetLink}\n\n" +
                  "This link is valid for 1 hour. If you did not request a password reset, please ignore this email.";

    // Send email using your EmailService
    await emailService.SendEmailAsync(dto.Email, subject, body);

    return Ok(new { message = "If an account with that email exists, you will receive password reset instructions." });
}

[HttpPost("reset-password")]
public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
{
    // Verify token is valid and not expired
    var customer = await _context.Customers.FirstOrDefaultAsync(c =>
        c.ResetPasswordToken == dto.Token &&
        c.ResetPasswordTokenExpiration.HasValue &&
        c.ResetPasswordTokenExpiration.Value > DateTime.UtcNow);

    if (customer == null)
    {
        return BadRequest(new { message = "Invalid or expired token." });
    }

    // IMPORTANT: In production, hash the new password before storing it
    customer.AccountPassword = dto.NewPassword;

    // Clear the token and its expiration once used
    customer.ResetPasswordToken = null;
    customer.ResetPasswordTokenExpiration = null;

    await _context.SaveChangesAsync();

    return Ok(new { message = "Password reset successful." });
}


        // // 2) Customer Login Endpoint
        // [HttpPost("customer-login")]
        // public async Task<IActionResult> CustomerLogin([FromBody] CustomerLoginDto dto)
        // {
        //     // Look up customer by Email
        //     var customer = await _context.Customers
        //         .FirstOrDefaultAsync(c => c.Email == dto.Email && c.IsActive);

        //     // Validate password
        //     if (customer == null || customer.AccountPassword != dto.Password)
        //     {
        //         return Unauthorized(new { message = "Invalid customer credentials or account deactivated" });
        //     }

        //     if (!customer.EmailConfirmed)
        //     {
        //         return StatusCode(403, new { message = "Please confirm your email before logging in." });
        //     }

        //     // Return success
        //     return Ok(new {
        //         message = "Customer login successful!",
        //         isEmployee = false,
        //         userId = customer.CustomerId,
        //         firstName = customer.FirstName,
        //         lastName = customer.LastName,
        //         email = customer.Email,
        //         borrowerTypeId = customer.BorrowerTypeId
        //     });
        // }
        
    }
}
