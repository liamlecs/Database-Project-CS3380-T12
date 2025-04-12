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
        public class ReactivationRequestDto
        {
            public required string Email { get; set; }
        }

        [HttpPost("RequestReactivate")]
        public async Task<IActionResult> RequestReactivate([FromBody] ReactivationRequestDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email))
            {
                return BadRequest("Email is required.");
            }
            
            // Find the deactivated customer by email.
            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == dto.Email && !c.IsActive);
            if (customer == null)
            {
                return NotFound("No deactivated account found with that email.");
            }
            
            // Generate a reactivation code. For instance, a 6-character alphanumeric string.
            string reactivationCode = Guid.NewGuid().ToString("N").Substring(0, 6).ToUpper();
            customer.ReactivationCode = reactivationCode;
            
            await _context.SaveChangesAsync();
            
            // Prepare and send the reactivation email.
            string subject = "Reactivate Your E-Library Account";
            string body = $@"
        Hi {customer.FirstName},

        You have requested to reactivate your account. Please use the following reactivation code to reactivate your account:

        Reactivation Code: {reactivationCode}

        To reactivate your account, please visit:
        https://database-project-cs-3380-t12.vercel.app/reactivateaccount

        Thank you!";
            
            await _emailService.SendEmailAsync(customer.Email, subject, body);
            
            return Ok("Reactivation code sent. Please check your email.");
        }

        
        public class ReactivationDto
        {
            public required string  Email { get; set; }
            public required string ReactivationCode { get; set; }
        }

        [HttpPost("ReactivateAccount")]
        public async Task<IActionResult> ReactivateAccount([FromBody] ReactivationDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.ReactivationCode))
            {
                return BadRequest("Both email and reactivation code are required.");
            }
            
            // Find the deactivated customer by email.
            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == dto.Email && !c.IsActive);
            if (customer == null)
            {
                return NotFound("No deactivated account found with that email.");
            }
            
            if (!string.Equals(customer.ReactivationCode, dto.ReactivationCode, StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("Invalid reactivation code.");
            }
            
            // Reactivate the account.
            customer.IsActive = true;
            customer.ReactivationCode = null; // Clear the code.
            await _context.SaveChangesAsync();
            
            return Ok("Account reactivated successfully.");
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

        // DELETE: api/Customer/soft/5
        [HttpDelete("soft/{id}")]
        public async Task<IActionResult> SoftDeleteCustomer(int id)
        {
            // Find the customer by ID.
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
                return NotFound();
            }

            // Instead of removing the customer, set IsActive to false.
            customer.IsActive = false;
            
            // Save the changes to the database.
            await _context.SaveChangesAsync();

            // Prepare the deactivation email.
            string subject = "Your E-Library Account Has Been Deactivated";
            string body = $@"
        Hi {customer.FirstName},

        Your E-Library account associated with {customer.Email} has been deactivated.

        If you believe this is a mistake or you wish to regain access, please visit our reactivation page:
        https://database-project-cs-3380-t12.vercel.app/requestreactivation

        Thank you for using E-Library.

        Best regards,
        The E-Library Team
        ";

    // Send the email to the customer.
    await _emailService.SendEmailAsync(customer.Email, subject, body);

            // Optionally, you can return NoContent or Ok with a message.
            return NoContent();
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

        [HttpGet("CheckFine/{id}")]
        public async Task<ActionResult<CustomerFineCheck>> CheckFine(int id)
        {
            // ✅ Query the database to find the customer by email
            var result = await _context.CheckFine
             .FromSqlRaw(
                @"SELECT COUNT(Fines.FineID) AS ActiveFineCount
                    FROM Fines, Customer
                WHERE Customer.CustomerID = {0} AND Fines.CustomerID = Customer.CustomerID AND Fines.PaymentStatus = '0'"
             , id)
                .FirstOrDefaultAsync();

            if (result == null)
            {
                return NotFound($"Customer with id {id} not found.");
            }

            return Ok(result); // Return the customer entity
        }


        [HttpGet("by-email/{email}")]
        public async Task<ActionResult<Customer>> GetCustomerByEmail(string email)
        {
            // ✅ Query the database to find the customer by email
            var customer = await _context.CustomerReports
             .FromSqlRaw(
                "SELECT Customer.Email, Customer.FirstName, Customer.LastName, BorrowerType.Type, Customer.MembershipStartDate, Customer.MembershipEndDate, BorrowerType.BorrowingLimit, Customer.EmailConfirmed " +
             "FROM Customer, BorrowerType " +
             "WHERE Email = {0} AND Customer.BorrowerTypeID = BorrowerType.BorrowerTypeID"
             , email)
                .FirstOrDefaultAsync();

            if (customer == null)
            {
                return NotFound($"Customer with email {email} not found.");
            }

            return Ok(customer); // Return the customer entity
        }

        [HttpGet("CustomerDetails")]
        public async Task<ActionResult<List<CustomerReportDto>>> CustomerDetails()
        {
            var customers = await _context.CustomerReports
                .FromSqlRaw(@"
                    SELECT 
                    c.Email,
                    c.FirstName,
                    c.LastName,
                    c.BorrowerTypeID,
                    b.Type AS [Type],
                    c.MembershipStartDate,
                    c.MembershipEndDate,
                    b.BorrowingLimit,
                    c.EmailConfirmed
                    FROM Customer c
                    INNER JOIN BorrowerType b
                    ON c.BorrowerTypeID = b.BorrowerTypeID
                ")
                .ToListAsync();

            if (customers == null || customers.Count == 0)
            {
                return NotFound($"No customers found.");
            }

            return Ok(customers);
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
