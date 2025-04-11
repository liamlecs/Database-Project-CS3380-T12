using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryWebAPI.Data;
using LibraryWebAPI.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace LibraryWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DonationController : ControllerBase
    {
        private readonly LibraryContext _context;

        public DonationController(LibraryContext context)
        {
            _context = context;
        }

        // GET: api/Donation
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Donation>>> GetDonations()
        {
            var donations = await _context.Donations.ToListAsync();
            return Ok(donations);
        }

        // GET: api/Donation/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Donation>> GetDonation(int id)
        {
            var donation = await _context.Donations
                .Include(d => d.Customer)
                .FirstOrDefaultAsync(m => m.DonationId == id);

            if (donation == null)
            {
                return NotFound();
            }

            return Ok(donation);
        }

        // POST: api/Donation
        [HttpPost]
public async Task<ActionResult<Donation>> PostDonation([FromBody] DonationDto donationDto)
{
    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);
    }

    // check if the donor is logged in
    Customer? customer = null;
    if (donationDto.CustomerId.HasValue)
    {
        customer = await _context.Customers.FindAsync(donationDto.CustomerId);
        if (customer == null)
        {
            return BadRequest("No Customer ID found.");
        }
    }

    // Map the DTO to Donation entity
    var donation = new Donation
    {
        CustomerId = donationDto.CustomerId,
        FirstName = donationDto.CustomerId == null ? donationDto.FirstName : customer?.FirstName, // Use provided name for anonymous donors
        LastName = donationDto.CustomerId == null ? donationDto.LastName : customer?.LastName,
        Amount = donationDto.Amount,
        Date = donationDto.Date
    };

    try
    {
        _context.Donations.Add(donation);
        await _context.SaveChangesAsync();
        // Instead of using CreatedAtAction, return a simple OK response:
        return Ok(new { success = true, donationId = donation.DonationId });
    }
    catch (DbUpdateException)
    {
        return StatusCode(500, "An error occurred while saving the donation.");
    }
}

public class DonationRequest
{
    public DonationDto? Donation { get; set; }
}

public class DonationDto
{
    public int? CustomerId { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public double Amount { get; set; }
    public DateOnly Date { get; set; }
}

public class CustomerDto
{
    public int CustomerId { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }
    public int BorrowerTypeId { get; set; }
    public DateTime MembershipStartDate { get; set; }
    public DateTime MembershipEndDate { get; set; }
    public string? AccountPassword { get; set; }
    public DateTime CreatedAt { get; set; }
}

        // PUT: api/Donation/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDonation(int id, Donation donation)
        {
            if (id != donation.DonationId)
            {
                return BadRequest();
            }

            _context.Entry(donation).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DonationExists(id))
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

        // DELETE: api/Donation/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDonation(int id)
        {
            var donation = await _context.Donations.FindAsync(id);
            if (donation == null)
            {
                return NotFound();
            }

            _context.Donations.Remove(donation);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DonationExists(int id)
        {
            return _context.Donations.Any(e => e.DonationId == id);
        }
    }
}
