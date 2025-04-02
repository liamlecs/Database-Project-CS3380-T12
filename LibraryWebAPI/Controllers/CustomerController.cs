using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryWebAPI.Data;
using LibraryWebAPI.Models;
using LibraryWebAPI.Services; // <-- Important for IEmailService
using System;
using System.Threading.Tasks;

namespace LibraryWebAPI.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly LibraryContext _context;
        private readonly IEmailService _emailService; // Now we actually inject it

        public CustomerController(LibraryContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterCustomerDto dto)
        {
            // 1. Check for missing fields
            if (string.IsNullOrWhiteSpace(dto.FirstName) ||
                string.IsNullOrWhiteSpace(dto.LastName) ||
                string.IsNullOrWhiteSpace(dto.Email) ||
                string.IsNullOrWhiteSpace(dto.Password))
            {
                return BadRequest("Please fill out all required fields.");
            }

            // 2. Validate email domain
            if (!dto.Email.Contains('@'))
            {
                return BadRequest("Invalid email format.");
            }
            string[] parts = dto.Email.Split('@');
            if (parts.Length < 2)
            {
                return BadRequest("Invalid email format.");
            }
            string domain = parts[1].ToLower();
            string[] allowedDomains = { "cougarnet.uh.edu", "uh.edu" };
            if (Array.IndexOf(allowedDomains, domain) < 0)
            {
                return BadRequest("Email must end in @cougarnet.uh.edu or @uh.edu.");
            }
            int borrowerTypeId = domain == "cougarnet.uh.edu" ? 1 : 2;

            // 3. Set timestamps and convert to DateOnly for membership dates
            DateTime now = DateTime.UtcNow;
            DateOnly startDate = DateOnly.FromDateTime(now);
            DateOnly endDate = startDate.AddYears(2);

            // 4. Generate a confirmation code (e.g., a 6-character code)
            string confirmationCode = Guid.NewGuid().ToString("N").Substring(0, 6).ToUpper();

            // 5. Create new Customer, including confirmation code
            var newCustomer = new Customer
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                BorrowerTypeId = borrowerTypeId,
                CreatedAt = now,
                MembershipStartDate = startDate,
                MembershipEndDate = endDate,
                AccountPassword = HashPassword(dto.Password),
                EmailConfirmationCode = confirmationCode,
                EmailConfirmed = false
            };

            _context.Customers.Add(newCustomer);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return BadRequest("Sorry, this email has already been used.");
            }

            // 6. Prepare and send confirmation email
            string subject = "Welcome to E-Library!";
            string body = $@"
Hi {dto.FirstName},

Your account has been successfully created.
Your email confirmation code is: {confirmationCode}

Please confirm your email by entering this code in our confirmation page: https://database-project-cs-3380-t12.vercel.app/confirm

Borrower Type: {(borrowerTypeId == 1 ? "Student" : "Faculty")}
Membership Start Date: {startDate}
Membership End Date: {endDate}

Thank you for registering!
";

            // Now we actually send the email
            await _emailService.SendEmailAsync(dto.Email, subject, body);

            return Ok("Registration successful. A confirmation email has been sent.");
        }

        [HttpPost("confirm")]
        public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.ConfirmationCode))
            {
                return BadRequest("Email and confirmation code are required.");
            }

            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == dto.Email);
            if (customer == null)
            {
                return NotFound("Customer not found.");
            }

            if (customer.EmailConfirmationCode != dto.ConfirmationCode)
            {
                return BadRequest("Invalid confirmation code.");
            }

            customer.EmailConfirmed = true;
            customer.EmailConfirmationCode = null; // Optionally clear the code

            await _context.SaveChangesAsync();

            return Ok("Email confirmed successfully.");
        }
        private string HashPassword(string plainPassword)
        {
            // TODO: Implement secure password hashing (e.g., BCrypt)
            return plainPassword;
        }
        // GET: api/Customer
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers()
        {
            var customers = await _context.Customers.ToListAsync();
            return Ok(customers);
        }
                // GET: api/Customer/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> GetCustomer(int id)
        {
            var customer = await _context.Customers
                
                .FirstOrDefaultAsync(m => m.CustomerId == id);

            if (customer == null)
            {
                return NotFound();
            }

            return Ok(customer);
        }

        [HttpGet("by-email/{email}")]
        public async Task<ActionResult<Customer>> GetCustomerByEmail(string email)
        {
            // ✅ Query the database to find the customer by email
            var customer = await _context.CustomerReports
             .FromSqlRaw(
                "SELECT Customer.Email, Customer.FirstName, Customer.LastName, BorrowerType.Type, Customer.MembershipStartDate, Customer.MembershipEndDate, BorrowerType.BorrowingLimit, Customer.EmailConfirmed " +
             "FROM Customer, BorrowerType "+
             "WHERE Email = {0} AND Customer.BorrowerTypeID = BorrowerType.BorrowerTypeID"
             , email)
                .FirstOrDefaultAsync();

            if (customer == null)
            {
                return NotFound($"Customer with email {email} not found.");
            }

            return Ok(customer); // Return the customer entity
        }

                // POST: api/Customer
        [HttpPost]
        public async Task<ActionResult<Customer>> PostCustomer(Customer customer)
        {
            if (ModelState.IsValid)
            {
                _context.Customers.Add(customer);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetCustomer), new { id = customer.CustomerId }, customer);
            }
            return BadRequest();
        }

                // PUT: api/Customer/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCustomer(int id, Customer customer)
        {
            if (id != customer.CustomerId)
            {
                return BadRequest();
            }

            try
            {
                _context.Entry(customer).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomerExists(id))
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
                private bool CustomerExists(int id)
        {
            return _context.Customers.Any(e => e.CustomerId == id);
        }

        // DELETE: api/Customer/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
                return NotFound();
            }

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}
