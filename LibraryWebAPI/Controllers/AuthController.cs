using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryWebAPI.Data;
using LibraryWebAPI.Models;
using System.Threading.Tasks;

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

        // 1) Employee Login Endpoint
        [HttpPost("employee-login")]
        public async Task<IActionResult> EmployeeLogin([FromBody] EmployeeLoginDto dto)
        {
            // Look up employee by Username
            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.Username == dto.Username);

            // Validate password
            if (employee == null || employee.AccountPassword != dto.Password)
            {
                return Unauthorized(new { message = "Invalid employee credentials." });
            }

            // Return success
            return Ok(new {
                message = "Employee login successful!",
                isEmployee = true,
                EmployeeID = employee.EmployeeId
            });
        }

        // 2) Customer Login Endpoint
        [HttpPost("customer-login")]
        public async Task<IActionResult> CustomerLogin([FromBody] CustomerLoginDto dto)
        {
            // Look up customer by Email
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email == dto.Email);

            // Validate password
            if (customer == null || customer.AccountPassword != dto.Password)
            {
                return Unauthorized(new { message = "Invalid customer credentials." });
            }

            if (!customer.EmailConfirmed)
            {
                return StatusCode(403, new { message = "Please confirm your email before logging in." });
            }

            // Return success
            return Ok(new {
                message = "Customer login successful!",
                isEmployee = false,
                userId = customer.CustomerId,
                firstName = customer.FirstName,
                lastName = customer.LastName,
                email = customer.Email
            });
        }
    }
}
