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
            var donations = await _context.Donations.ToListAsync(); // must remove .Include(d => d.Customer)
            return Ok(donations);
        }

        // GET: api/Donation/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Donation>> GetDonation(int id)
        {
            var donation = await _context.Donations
                .FirstOrDefaultAsync(m => m.DonationId == id); // must remove .Include(d => d.Customer)

            if (donation == null)
            {
                return NotFound();
            }

            return Ok(donation);
        }

        // POST: api/Donation
        [HttpPost]
        public async Task<ActionResult<Donation>> PostDonation(Donation donation)
        {
            if (ModelState.IsValid)
            {
                _context.Donations.Add(donation);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetDonation), new { id = donation.DonationId }, donation);
            }

            return BadRequest(ModelState);
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
