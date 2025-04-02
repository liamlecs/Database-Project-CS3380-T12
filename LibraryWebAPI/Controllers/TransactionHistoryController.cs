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
        private readonly ILogger<TransactionHistoryController> _logger;

        public TransactionHistoryController(LibraryContext context, ILogger<TransactionHistoryController> logger)
        {
            _logger = logger;
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

[HttpGet("popularityConditional")]
public async Task<ActionResult<TransactionHistory>> GetBookPopularityConditional([FromQuery] DateTime dateFilter)
{

if (dateFilter == default)
    {
        _logger.LogError("Invalid or missing dateFilter: {DateFilter}", dateFilter);
        return BadRequest("Invalid date format. Ensure you're passing a valid date.");
    }

_logger.LogInformation("Received request for popularityConditional with date: {DateFilter}", dateFilter);

    var counts = await _context.TransactionPopularityConditional
        .FromSqlRaw("SELECT " +
            "Item.Title, " +
            "COUNT(*) AS count, " +
            "CASE " +
                "WHEN MAX(Movie.MovieID) IS NOT NULL THEN 'Movie' " +
                "WHEN MAX(Music.MusicID) IS NOT NULL THEN 'Music' " +
                "WHEN MAX(Book.BookID) IS NOT NULL THEN 'Book' " +
                "WHEN MAX(Technology.DeviceID) IS NOT NULL THEN 'Technology' " +
                "ELSE 'Unknown Table' " +
            "END AS ItemType " +
        "FROM TRANSACTION_HISTORY " +
        "JOIN Item ON TRANSACTION_HISTORY.ItemID = Item.ItemID " +
        "LEFT JOIN Movie ON Item.ItemID = Movie.MovieID " +
        "LEFT JOIN Music ON Item.ItemID = Music.MusicID " +
        "LEFT JOIN Book ON Item.ItemID = Book.BookID " +
        "LEFT JOIN Technology ON Item.ItemID = Technology.DeviceID " +
        "WHERE TRANSACTION_HISTORY.DateBorrowed > {0} " +  // Using parameterized query
        "GROUP BY Item.Title;", dateFilter)
        .ToListAsync();

    if (counts == null || counts.Count == 0)
    {
        return NotFound("No recent transactions found.");
    }

    return Ok(counts);
}

[HttpGet("withFine")]
 public async Task<ActionResult<TransactionHistory>> GetTransactionWithFine()
        {
            var fines = await _context.TransactionFine.FromSqlRaw("SELECT " + 
    "I.Title, " + 
    "C.Email, " + 
    "C.FirstName, " + 
    "C.LastName, " + 
    "BT.Type, " + 
    "TH.DateBorrowed, " + 
    "TH.DueDate, " + 
    "F.Amount, " + 
    "F.PaymentStatus, " + 
    "CASE " + 
        "WHEN MAX(M.MovieID) IS NOT NULL THEN 'Movie' " + 
        "WHEN MAX(Mu.MusicID) IS NOT NULL THEN 'Music' " + 
        "WHEN MAX(B.BookID) IS NOT NULL THEN 'Book' " + 
        "WHEN MAX(T.DeviceID) IS NOT NULL THEN 'Technology' " + 
        "ELSE 'Unknown Table' " + 
    "END AS ItemType " + 
"FROM TRANSACTION_HISTORY TH " + 
"JOIN Item I ON TH.ItemID = I.ItemID " + 
"LEFT JOIN Movie M ON I.ItemID = M.MovieID " + 
"LEFT JOIN Music Mu ON I.ItemID = Mu.MusicID " + 
"LEFT JOIN Book B ON I.ItemID = B.BookID " + 
"LEFT JOIN Technology T ON I.ItemID = T.DeviceID " + 
"JOIN Fines F ON TH.TransactionID = F.TransactionID " + 
"JOIN Customer C ON F.CustomerID = C.CustomerID " + 
"JOIN BorrowerType BT ON C.BorrowerTypeID = BT.BorrowerTypeID " + 
"GROUP BY " + 
    "I.Title, C.Email, C.FirstName, C.LastName, BT.Type, " + 
    "TH.DateBorrowed, TH.DueDate, F.Amount, F.PaymentStatus"
).ToListAsync();

 if (fines == null)
            {
                return NotFound($"failed to display fines.");
            }

            return Ok(fines);
        }

[HttpGet("withFineConditional")]
 public async Task<ActionResult<TransactionHistory>> GetTransactionWithFineConditional(bool isPaid)
        {
            var fines = await _context.TransactionFineConditional.FromSqlRaw("SELECT " + 
    "I.Title, " + 
    "C.Email, " + 
    "C.FirstName, " + 
    "C.LastName, " + 
    "BT.Type, " + 
    "TH.DateBorrowed, " + 
    "TH.DueDate, " + 
    "F.Amount, " + 
    "F.PaymentStatus, " + 
    "CASE " + 
        "WHEN MAX(M.MovieID) IS NOT NULL THEN 'Movie' " + 
        "WHEN MAX(Mu.MusicID) IS NOT NULL THEN 'Music' " + 
        "WHEN MAX(B.BookID) IS NOT NULL THEN 'Book' " + 
        "WHEN MAX(T.DeviceID) IS NOT NULL THEN 'Technology' " + 
        "ELSE 'Unknown Table' " + 
    "END AS ItemType " + 
"FROM TRANSACTION_HISTORY TH " + 
"JOIN Item I ON TH.ItemID = I.ItemID " + 
"LEFT JOIN Movie M ON I.ItemID = M.MovieID " + 
"LEFT JOIN Music Mu ON I.ItemID = Mu.MusicID " + 
"LEFT JOIN Book B ON I.ItemID = B.BookID " + 
"LEFT JOIN Technology T ON I.ItemID = T.DeviceID " + 
"JOIN Fines F ON TH.TransactionID = F.TransactionID " + 
"JOIN Customer C ON F.CustomerID = C.CustomerID " + 
"JOIN BorrowerType BT ON C.BorrowerTypeID = BT.BorrowerTypeID " + 
"WHERE F.PaymentStatus = {0} " +
" GROUP BY " + 
    "I.Title, C.Email, C.FirstName, C.LastName, BT.Type, " + 
    "TH.DateBorrowed, TH.DueDate, F.Amount, F.PaymentStatus"
,isPaid).ToListAsync();

 if (fines == null)
            {
                return NotFound($"failed to display fines.");
            }

            return Ok(fines);
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
