using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryWebAPI.Data;
using LibraryWebAPI.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LibraryWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly LibraryContext _context;

        public EmployeeController(LibraryContext context)
        {
            _context = context;
        }

        // GET: api/Employee
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
        {
            var employees = await _context.Employees
                .Include(e => e.Supervisor)
                .ToListAsync();
            return Ok(employees);
        }

        // GET: api/Employee/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployee(int id)
        {
            var employee = await _context.Employees
                .Include(e => e.Supervisor)
                .FirstOrDefaultAsync(e => e.EmployeeId == id);

            if (employee == null)
            {
                return NotFound();
            }

            return Ok(new
            {
                employeeID = employee.EmployeeId,
                firstName = employee.FirstName,
                lastName = employee.LastName,
                birthDate = employee.BirthDate?.ToString("yyyy-MM-dd"),
                supervisorID = employee.SupervisorId,
                username = employee.Username
            });
        }

        // POST: api/Employee
        [HttpPost]
        public async Task<ActionResult> PostEmployee([FromBody] EmployeeCreateDto employeeDto)
        {
            if (employeeDto == null)
            {
                return BadRequest("Employee data is required.");
            }

            // Create a new Employee object
            var employee = new Employee
            {
                FirstName = employeeDto.FirstName,
                LastName = employeeDto.LastName,
                BirthDate = DateOnly.Parse(employeeDto.BirthDate),
                SupervisorId = employeeDto.SupervisorId,
                Username = employeeDto.Username,
                // You can also assign the password here.
                // It is recommended to hash the password before storing.
                AccountPassword = employeeDto.Password 
            };

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            // Return the created employee with HTTP 201
            return CreatedAtAction(nameof(GetEmployee), new { id = employee.EmployeeId }, new
            {
                employeeID = employee.EmployeeId,
                firstName = employee.FirstName,
                lastName = employee.LastName,
                birthDate = employee.BirthDate?.ToString("yyyy-MM-dd"),
                supervisorID = employee.SupervisorId,
                username = employee.Username
            });
        }

        // DELETE: api/Employee/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
            {
                return NotFound(new { message = "Employee not found." });
            }

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Employee deleted successfully." });
        }

        [HttpPut("{id}/password")]
        public async Task<IActionResult> UpdatePassword(int id, [FromBody] PasswordUpdateDto passwordDto)
        {
            // Validate password match
            if (passwordDto.NewPassword != passwordDto.ConfirmPassword)
            {
                return BadRequest("New password and confirmation do not match");
            }

            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
            {
                return NotFound();
            }

            // Verify old password (plain text comparison)
            if (passwordDto.OldPassword != employee.AccountPassword)
            {
                return BadRequest("Invalid old password");
            }

            // Update password
            employee.AccountPassword = passwordDto.NewPassword;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return Ok(new { message = "Password updated" }); // Return JSON response
        }

        // PUT: api/Employee/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEmployee(int id, [FromBody] EmployeeUpdateDto employeeDto)
        {
            if (id != employeeDto.EmployeeId)
            {
                return BadRequest();
            }

            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
            {
                return NotFound();
            }

            employee.FirstName = employeeDto.FirstName;
            employee.LastName = employeeDto.LastName;
            employee.BirthDate = DateOnly.Parse(employeeDto.BirthDate);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        private bool EmployeeExists(int id)
        {
            return _context.Employees.Any(e => e.EmployeeId == id);
        }
    }

    // DTO for updating an employee (existing code)
    public class EmployeeUpdateDto
    {
        public int EmployeeId { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string BirthDate { get; set; }
    }

        public class PasswordUpdateDto
    {
        public required string OldPassword { get; set; }
        public required string NewPassword { get; set; }
        public required string ConfirmPassword { get; set; }
    }

    

    // New DTO for creating a new employee
    public class EmployeeCreateDto
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        // BirthDate as a string in "yyyy-MM-dd" format.
        public required string BirthDate { get; set; }
        public int? SupervisorId { get; set; }
        public required string Username { get; set; }
        public required string Password { get; set; }
    }
}
