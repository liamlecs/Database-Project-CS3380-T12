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
    public class TransactionHistoryController : ControllerBase
    {
        private readonly LibraryContext _context;

        public TransactionHistoryController(LibraryContext context)
        {
            _context = context;
        }

        // GET: api/TransactionHistory
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TransactionHistory>>> GetTransactionHistories()
        {
            var transactionHistories = await _context.TransactionHistories
                .ToListAsync();
            return Ok(transactionHistories);
        }

[HttpGet("popularity")]
 public async Task<ActionResult<TransactionHistory>> GetBookPopularity()
        {
            var counts = await _context.TransactionPopularity.FromSqlRaw("SELECT "+ 
    "Item.Title, "+
   " COUNT(*) AS count, "+
   "CASE "+
        "WHEN MAX(Movie.MovieID) IS NOT NULL THEN 'Movie' "+
       " WHEN MAX(Music.MusicID) IS NOT NULL THEN 'Music' "+
        "WHEN MAX(Book.BookID) IS NOT NULL THEN 'Book' "+
       " WHEN MAX(Technology.DeviceID) IS NOT NULL THEN 'Technology' "+
      "ELSE 'Unknown Table' "+
    "END AS ItemType "+
"FROM TRANSACTION_HISTORY "+
"JOIN Item ON TRANSACTION_HISTORY.ItemID = Item.ItemID "+
"LEFT JOIN Movie ON Item.ItemID = Movie.MovieID "+
"LEFT JOIN Music ON Item.ItemID = Music.MusicID "+
"LEFT JOIN Book ON Item.ItemID = Book.BookID "+
"LEFT JOIN Technology ON Item.ItemID = Technology.DeviceID "+
"GROUP BY Item.Title"
).ToListAsync();

 if (counts == null)
            {
                return NotFound($"failed to display counts.");
            }

            return Ok(counts);
        }

        // GET: api/TransactionHistory/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TransactionHistory>> GetTransactionHistory(int id)
        {
            var transactionHistory = await _context.TransactionHistories
                .FirstOrDefaultAsync(m => m.TransactionId == id);

            if (transactionHistory == null)
            {
                return NotFound();
            }

            return Ok(transactionHistory);
        }

        // POST: api/TransactionHistory
        [HttpPost]
        public async Task<ActionResult<TransactionHistory>> PostTransactionHistory(TransactionHistory transactionHistory)
        {
            if (ModelState.IsValid)
            {
                _context.TransactionHistories.Add(transactionHistory);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetTransactionHistory), new { id = transactionHistory.TransactionId }, transactionHistory);
            }

            return BadRequest();
        }

        // PUT: api/TransactionHistory/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTransactionHistory(int id, TransactionHistory transactionHistory)
        {
            if (id != transactionHistory.TransactionId)
            {
                return BadRequest();
            }

            try
            {
                _context.Entry(transactionHistory).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TransactionHistoryExists(id))
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

        // DELETE: api/TransactionHistory/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransactionHistory(int id)
        {
            var transactionHistory = await _context.TransactionHistories.FindAsync(id);
            if (transactionHistory == null)
            {
                return NotFound();
            }

            _context.TransactionHistories.Remove(transactionHistory);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TransactionHistoryExists(int id)
        {
            return _context.TransactionHistories.Any(e => e.TransactionId == id);
        }
    }
}
