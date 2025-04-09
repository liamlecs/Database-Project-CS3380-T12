using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryWebAPI.Data;
using LibraryWebAPI.Models;

namespace LibraryWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FineController : ControllerBase
    {
        private readonly LibraryContext _context;

        public FineController(LibraryContext context)
        {
            _context = context;
        }

        // GET: api/Fine
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Fine>>> GetFines()
        {
            var fines = await _context.Fines.ToListAsync();
            return Ok(fines);
        }

        // GET: api/Fine/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Fine>> GetFine(int id)
        {
            var fine = await _context.Fines
                .FirstOrDefaultAsync(m => m.FineId == id);

            if (fine == null)
            {
                return NotFound();
            }

            return Ok(fine);
        }

        [HttpGet("CustomerFines/{email}")]
        public async Task<ActionResult<List<CustomerFineDto>>> GetCustomerFines(string email)
        {
            // ✅ Query the database to find the customer by email
            var fines = await _context.CustomerFines
             .FromSql(
                $@"
SELECT 
            Customer.Email,
            Item.Title,
            ItemType.TypeName,
            Fines.Amount,
            Fines.IssueDate,
            Fines.PaymentStatus
        FROM 
            Customer
        JOIN Fines ON Customer.CustomerID = Fines.CustomerID
        JOIN TRANSACTION_HISTORY ON Fines.TransactionID = TRANSACTION_HISTORY.TransactionID
        JOIN Item ON TRANSACTION_HISTORY.ItemID = Item.ItemID
        JOIN ItemType ON Item.ItemTypeID = ItemType.ItemTypeID
        WHERE Customer.Email = {email}
")
                .ToListAsync();

            return Ok(fines); // Return the customer entity
        }

        // POST: api/Fine
        [HttpPost]
        public async Task<ActionResult<Fine>> PostFine(Fine fine)
        {
            if (ModelState.IsValid)
            {
                _context.Fines.Add(fine);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetFine), new { id = fine.FineId }, fine);
            }
            return BadRequest();
        }

        // PUT: api/Fine/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFine(int id, Fine fine)
        {
            if (id != fine.FineId)
            {
                return BadRequest();
            }

            try
            {
                _context.Entry(fine).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FineExists(id))
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

        // DELETE: api/Fine/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFine(int id)
        {
            var fine = await _context.Fines.FindAsync(id);
            if (fine == null)
            {
                return NotFound();
            }

            _context.Fines.Remove(fine);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FineExists(int id)
        {
            return _context.Fines.Any(e => e.FineId == id);
        }
    }
}
