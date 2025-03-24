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

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            // check if it's an employee login
            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.Username == loginDto.Email);
            
            if (employee != null)
            {
                if (employee.AccountPassword != loginDto.Password)
                {
                    return Unauthorized("Invalid email or password.");
                }

                // Return employee-specific response
                return Ok(new {
                    message = "Employee login successful!",
                    isEmployee = true,
                    userId = employee.EmployeeId
                });
            }

            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email == loginDto.Email);

            if (customer == null)
            {
                return Unauthorized("Invalid email or password.");
            }

            if (customer.AccountPassword != loginDto.Password)
            {
                return Unauthorized("Invalid email or password.");
            }

            if (!customer.EmailConfirmed)
            {
                return StatusCode(403, "Please confirm your email before logging in.");
            }

            // Return success or generate a token
            return Ok("Login successful!");
        }
    }
}
