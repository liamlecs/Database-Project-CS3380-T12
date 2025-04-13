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
    public class WaitlistController : ControllerBase
    {
        private readonly LibraryContext _context;

        public WaitlistController(LibraryContext context)
        {
            _context = context;
        }

        // GET: api/Waitlist
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Waitlist>>> GetWaitlists()
        {
            var waitlists = await _context.Waitlists


                .ToListAsync();
            return Ok(waitlists);
        }

        // GET: api/Waitlist/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Waitlist>> GetWaitlist(int id)
        {
            var waitlist = await _context.Waitlists


                .FirstOrDefaultAsync(m => m.WaitlistId == id);

            if (waitlist == null)
            {
                return NotFound();
            }

            return Ok(waitlist);
        }

        [HttpGet("CustomerWaitlists/{email}")]
        public async Task<ActionResult<List<CustomerWaitlistDto>>> GetCustomerWaitlists(string email)
        {
            // ✅ Query the database to find the customer by email
            var waitlists = await _context.CustomerWaitlists
             .FromSql(
                $@"
SELECT 
    Customer.Email,
    Item.Title,
    ItemType.TypeName,
    Waitlist.ReservationDate,
    CASE 
        WHEN Waitlist.IsReceived = 1 THEN -1
        ELSE (
            SELECT COUNT(*)+1 
            FROM Waitlist w2
            WHERE w2.ItemID = Waitlist.ItemID
              AND w2.IsReceived = 0
              AND w2.ReservationDate < Waitlist.ReservationDate
        )
    END AS WaitlistPosition
FROM 
    Customer
JOIN Waitlist ON Customer.CustomerID = Waitlist.CustomerID
JOIN Item ON Waitlist.ItemID = Item.ItemID
JOIN ItemType ON Item.ItemTypeID = ItemType.ItemTypeID
WHERE Customer.Email = {email}
")
                .ToListAsync();

            return Ok(waitlists);
        }

        [HttpGet("detailed")]
        public async Task<ActionResult<IEnumerable<WaitlistReport>>> GetDetailedWaitlists()
        {
            var results = await _context.Set<WaitlistReport>().FromSqlRaw(@"
        SELECT 
            w.WaitlistId AS WaitlistId,
            w.CustomerId AS CustomerId,
            w.ItemId AS ItemId,
            c.FirstName AS FirstName,
            c.LastName AS LastName,
            it.TypeName AS ItemType,
            i.Title AS Title,
            w.ReservationDate AS ReservationDate,
            w.IsReceived AS IsReceived
        FROM Waitlist w
        JOIN Customer c ON w.CustomerId = c.CustomerID
        JOIN Item i ON w.ItemId = i.ItemId
        JOIN ItemType it ON i.ItemTypeID = it.ItemTypeID
    ").ToListAsync();

            return Ok(results);
        }

        // POST: api/Waitlist
        [HttpPost]
        public async Task<ActionResult<Waitlist>> PostWaitlist([FromBody] Waitlist waitlist)
        {

            if (ModelState.IsValid)
            {



                _context.Waitlists.Add(waitlist);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetWaitlist), new { id = waitlist.WaitlistId }, waitlist);
            }

            return BadRequest();
        }

        // PUT: api/Waitlist/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutWaitlist(int id, [FromBody] Waitlist waitlist)
        {
            if (id != waitlist.WaitlistId)
            {
                return BadRequest();
            }

            try
            {
                _context.Entry(waitlist).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WaitlistExists(id))
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

        // DELETE: api/Waitlist/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWaitlist(int id)
        {
            var waitlist = await _context.Waitlists.FindAsync(id);
            if (waitlist == null)
            {
                return NotFound();
            }

            _context.Waitlists.Remove(waitlist);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool WaitlistExists(int id)
        {
            return _context.Waitlists.Any(e => e.WaitlistId == id);
        }
    }
}
