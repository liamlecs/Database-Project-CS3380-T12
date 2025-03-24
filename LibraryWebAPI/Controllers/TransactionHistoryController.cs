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
