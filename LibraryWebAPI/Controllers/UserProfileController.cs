using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryWebAPI.Models;
using LibraryWebAPI.Data;

namespace LibraryWebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserProfileController : ControllerBase
    {
        private readonly LibraryContext _context;

        public UserProfileController(LibraryContext context)
        {
            _context = context;
        }

        [HttpGet("{type}/{id}")]
        public async Task<IActionResult> GetUserProfile(string type, int id)
        {
            if (type.ToLower() == "customer")
            {
                var customer = await _context.Customers
                    .Include(c => c.Fines)
                    .Include(c => c.TransactionHistories)
                    .Include(c => c.Waitlists)
                    .FirstOrDefaultAsync(c => c.CustomerId == id);

                if (customer == null) return NotFound();

                return Ok(new
                {
                    Name = customer.FirstName + " " + customer.LastName,
                    Email = customer.Email,
                    Role = "Student",
                    password = customer.AccountPassword,
                    MemberSince = customer.MembershipStartDate,
                    MembershipExpires = customer.MembershipEndDate,
                    fines = customer.Fines,
                    //checkedBooks = customer,
                    transcActHistory = customer.TransactionHistories,
                    waitLists = customer.Waitlists
                });
            }
            else if (type.ToLower() == "employee")
            {
                var employee = await _context.Employees.FindAsync(id);
                if (employee == null) return NotFound();

                return Ok(new
                {
                    Name = employee.FirstName + " " + employee.LastName,
                    Email = employee.Username,
                    Role = "Faculty",
                    password = employee.AccountPassword,
                });
            }

            return BadRequest("Invalid user type");
        }
        [HttpGet("customers")]
        public async Task<IActionResult> GetAllCustomers()
        {
            var customers = await _context.Customers
                .Select(c => new
                {
                    c.CustomerId,
                    Name = c.FirstName + " " + c.LastName,
                    c.Email,
                    c.AccountPassword,
                    Role = "Student",
                    MemberSince = c.MembershipStartDate,
                    MembershipExpires = c.MembershipEndDate,
                    c.Fines,
                    //checkedBooks = 
                    c.TransactionHistories,
                    c.Waitlists
                })
                .ToListAsync();

            return Ok(customers);
        }
        [HttpPut("customer/{id}")]
        public async Task<IActionResult> UpdateCustomer(int id, [FromBody] CustomerUpdateDTO updatedCustomer)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null) return NotFound();

            customer.FirstName = updatedCustomer.FirstName;
            customer.LastName = updatedCustomer.LastName;
            customer.Email = updatedCustomer.Email;
            customer.AccountPassword = updatedCustomer.Password;
           customer.MembershipStartDate = updatedCustomer.MembershipStartDate.HasValue
        ? DateOnly.FromDateTime(updatedCustomer.MembershipStartDate.Value)
        : customer.MembershipStartDate;

    customer.MembershipEndDate = updatedCustomer.MembershipEndDate.HasValue
        ? DateOnly.FromDateTime(updatedCustomer.MembershipEndDate.Value)
        : customer.MembershipEndDate;

            if (updatedCustomer.MembershipEndDate.HasValue)
            {
                customer.MembershipEndDate = DateOnly.FromDateTime(updatedCustomer.MembershipEndDate.Value);
            }
            await _context.SaveChangesAsync();
            return Ok(customer);
        }

    }
}