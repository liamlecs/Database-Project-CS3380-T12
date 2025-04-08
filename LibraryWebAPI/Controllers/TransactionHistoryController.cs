using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryWebAPI.Data;
using LibraryWebAPI.Models;

//MAY NEED TO CHANGE SOME API CONTROLLERS FROM ACTIONRESULT TO LIST, ALSO FIX THE WAY I DETECT THE TYPE OF ITEM SOMEATHING IS -- For Trevor

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
            var counts = await _context.TransactionPopularity.FromSqlRaw("SELECT " +
    "Item.Title, " +
   " COUNT(*) AS count, " +
   "CASE " +
        "WHEN MAX(Movie.MovieID) IS NOT NULL THEN 'Movie' " +
       " WHEN MAX(Music.SongID) IS NOT NULL THEN 'Music' " +
        "WHEN MAX(Book.BookID) IS NOT NULL THEN 'Book' " +
       " WHEN MAX(Technology.DeviceID) IS NOT NULL THEN 'Technology' " +
      "ELSE 'Unknown Table' " +
    "END AS ItemType " +
"FROM TRANSACTION_HISTORY " +
"JOIN Item ON TRANSACTION_HISTORY.ItemID = Item.ItemID " +
"LEFT JOIN Movie ON Item.ItemID = Movie.MovieID " +
"LEFT JOIN Music ON Item.ItemID = Music.SongID " +
"LEFT JOIN Book ON Item.ItemID = Book.BookID " +
"LEFT JOIN Technology ON Item.ItemID = Technology.DeviceID " +
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
                        "WHEN MAX(Music.SongID) IS NOT NULL THEN 'Music' " +
                        "WHEN MAX(Book.BookID) IS NOT NULL THEN 'Book' " +
                        "WHEN MAX(Technology.DeviceID) IS NOT NULL THEN 'Technology' " +
                        "ELSE 'Unknown Table' " +
                    "END AS ItemType " +
                "FROM TRANSACTION_HISTORY " +
                "JOIN Item ON TRANSACTION_HISTORY.ItemID = Item.ItemID " +
                "LEFT JOIN Movie ON Item.ItemID = Movie.MovieID " +
                "LEFT JOIN Music ON Item.ItemID = Music.SongID " +
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
        "WHEN MAX(Mu.SongID) IS NOT NULL THEN 'Music' " +
        "WHEN MAX(B.BookID) IS NOT NULL THEN 'Book' " +
        "WHEN MAX(T.DeviceID) IS NOT NULL THEN 'Technology' " +
        "ELSE 'Unknown Table' " +
    "END AS ItemType " +
"FROM TRANSACTION_HISTORY TH " +
"JOIN Item I ON TH.ItemID = I.ItemID " +
"LEFT JOIN Movie M ON I.ItemID = M.MovieID " +
"LEFT JOIN Music Mu ON I.ItemID = Mu.SongID " +
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
        "WHEN MAX(Mu.SongID) IS NOT NULL THEN 'Music' " +
        "WHEN MAX(B.BookID) IS NOT NULL THEN 'Book' " +
        "WHEN MAX(T.DeviceID) IS NOT NULL THEN 'Technology' " +
        "ELSE 'Unknown Table' " +
    "END AS ItemType " +
"FROM TRANSACTION_HISTORY TH " +
"JOIN Item I ON TH.ItemID = I.ItemID " +
"LEFT JOIN Movie M ON I.ItemID = M.MovieID " +
"LEFT JOIN Music Mu ON I.ItemID = Mu.SongID " +
"LEFT JOIN Book B ON I.ItemID = B.BookID " +
"LEFT JOIN Technology T ON I.ItemID = T.DeviceID " +
"JOIN Fines F ON TH.TransactionID = F.TransactionID " +
"JOIN Customer C ON F.CustomerID = C.CustomerID " +
"JOIN BorrowerType BT ON C.BorrowerTypeID = BT.BorrowerTypeID " +
"WHERE F.PaymentStatus = {0} " +
" GROUP BY " +
    "I.Title, C.Email, C.FirstName, C.LastName, BT.Type, " +
    "TH.DateBorrowed, TH.DueDate, F.Amount, F.PaymentStatus"
, isPaid).ToListAsync();

            if (fines == null)
            {
                return NotFound($"failed to display fines.");
            }

            return Ok(fines);
        }

        [HttpGet("masterTransactionReportConditional")]
        public async Task<ActionResult<MasterTransactionReportDto>> MasterTransactionReportConditional(DateOnly start, DateOnly end)
        {
            var startDateTime = start.ToDateTime(TimeOnly.MinValue);
            var endDateTime = end.ToDateTime(TimeOnly.MaxValue); // or MinValue

            var entity = _context.MasterTransaction.FromSqlRaw("WITH InventoryReport AS (" +
"    SELECT " +
"        GETUTCDATE() AS Timestamp, " +

"        (SELECT COUNT(*) " +
"         FROM Customer " +
"         WHERE {0} < MembershipStartDate AND MembershipStartDate < {1} AND EmailConfirmed = 1) AS RegisteredUsersThatJoined, " +

"        (SELECT COUNT(*) " +
"         FROM Item " +
"         JOIN ItemType ON Item.ItemTypeID = ItemType.ItemTypeID " +
"         WHERE ItemType.TypeName = 'Book') AS BookTitleCount, " +

"        (SELECT SUM(Item.TotalCopies) " +
"         FROM Item " +
"         JOIN ItemType ON Item.ItemTypeID = ItemType.ItemTypeID " +
"         WHERE ItemType.TypeName = 'Book') AS TotalBookCount, " +

"        (SELECT SUM(Item.AvailableCopies) " +
"         FROM Item " +
"         JOIN ItemType ON Item.ItemTypeID = ItemType.ItemTypeID " +
"         WHERE ItemType.TypeName = 'Book') AS AvailableBookCount, " +

"        (SELECT COUNT(*) " +
"         FROM Item " +
"         JOIN ItemType ON Item.ItemTypeID = ItemType.ItemTypeID " +
"         WHERE ItemType.TypeName = 'Movie') AS MovieTitleCount, " +

"        (SELECT SUM(Item.TotalCopies) " +
"         FROM Item " +
"         JOIN ItemType ON Item.ItemTypeID = ItemType.ItemTypeID " +
"         WHERE ItemType.TypeName = 'Movie') AS TotalMovieCount, " +

"        (SELECT SUM(Item.AvailableCopies) " +
"         FROM Item " +
"         JOIN ItemType ON Item.ItemTypeID = ItemType.ItemTypeID " +
"         WHERE ItemType.TypeName = 'Movie') AS AvailableMovieCount, " +

"        (SELECT COUNT(*) " +
"         FROM Item " +
"         JOIN ItemType ON Item.ItemTypeID = ItemType.ItemTypeID " +
"         WHERE ItemType.TypeName = 'Music') AS MusicTitleCount, " +

"        (SELECT SUM(Item.TotalCopies) " +
"         FROM Item " +
"         JOIN ItemType ON Item.ItemTypeID = ItemType.ItemTypeID " +
"         WHERE ItemType.TypeName = 'Music') AS TotalMusicCount, " +

"        (SELECT SUM(Item.AvailableCopies) " +
"         FROM Item " +
"         JOIN ItemType ON Item.ItemTypeID = ItemType.ItemTypeID " +
"         WHERE ItemType.TypeName = 'Music') AS AvailableMusicCount, " +

"        (SELECT COUNT(*) " +
"         FROM Item " +
"         JOIN ItemType ON Item.ItemTypeID = ItemType.ItemTypeID " +
"         WHERE ItemType.TypeName = 'Device') AS TechTitleCount, " +

"        (SELECT SUM(Item.TotalCopies) " +
"         FROM Item " +
"         JOIN ItemType ON Item.ItemTypeID = ItemType.ItemTypeID " +
"         WHERE ItemType.TypeName = 'Device') AS TotalTechCount, " +

"        (SELECT SUM(Item.AvailableCopies) " +
"         FROM Item " +
"         JOIN ItemType ON Item.ItemTypeID = ItemType.ItemTypeID " +
"         WHERE ItemType.TypeName = 'Device') AS AvailableTechCount, " +

"        (SELECT COUNT(*) FROM Fines WHERE Fines.PaymentStatus = 0) AS OutstandingFines, " +

"        (SELECT COUNT(*) FROM Customer WHERE Customer.EmailConfirmed = 1) AS RegisteredUsers, " +

"        (SELECT COUNT(*) FROM TRANSACTION_HISTORY WHERE {0} < DateBorrowed AND DateBorrowed < {1}) AS CheckoutInstances, " +

"        (SELECT COUNT(DISTINCT CustomerID) FROM TRANSACTION_HISTORY WHERE {0} < DateBorrowed AND DateBorrowed < {1}) AS UniqueCustomers " +
") " +

"SELECT *, " +
"       (BookTitleCount + MovieTitleCount + MusicTitleCount + TechTitleCount) AS TotalTitleCount, " +
"       (TotalBookCount + TotalMovieCount + TotalMusicCount + TotalTechCount) AS TotalCopiesCount, " +
"       (AvailableBookCount + AvailableMovieCount + AvailableMusicCount + AvailableTechCount) AS TotalAvailableCount " +
"FROM InventoryReport;"
, startDateTime, endDateTime).AsEnumerable().FirstOrDefault();

            if (entity == null)
            {
                return NotFound($"failed to display fines.");
            }

            entity.TransactionPopularity = await GetTransactionPopularityDataAsync();
            entity.TransactionFine = await GetTransactionFinesDataAsync();

            return Ok(entity);
        }

        [HttpGet("masterTransactionReport")]
        public async Task<ActionResult<MasterTransactionReportDto>> MasterTransactionReport()
        {
            var entity = _context.MasterTransaction.FromSqlRaw("WITH InventoryReport AS (" +
"    SELECT " +
"        GETUTCDATE() AS Timestamp, " +
"        -1 AS RegisteredUsersThatJoined, " +

"        (SELECT COUNT(*) FROM Item JOIN ItemType ON Item.ItemTypeID = ItemType.ItemTypeID WHERE ItemType.TypeName = 'Book') AS BookTitleCount, " +
"        (SELECT SUM(Item.TotalCopies) FROM Item JOIN ItemType ON Item.ItemTypeID = ItemType.ItemTypeID WHERE ItemType.TypeName = 'Book') AS TotalBookCount, " +
"        (SELECT SUM(Item.AvailableCopies) FROM Item JOIN ItemType ON Item.ItemTypeID = ItemType.ItemTypeID WHERE ItemType.TypeName = 'Book') AS AvailableBookCount, " +

"        (SELECT COUNT(*) FROM Item JOIN ItemType ON Item.ItemTypeID = ItemType.ItemTypeID WHERE ItemType.TypeName = 'Movie') AS MovieTitleCount, " +
"        (SELECT SUM(Item.TotalCopies) FROM Item JOIN ItemType ON Item.ItemTypeID = ItemType.ItemTypeID WHERE ItemType.TypeName = 'Movie') AS TotalMovieCount, " +
"        (SELECT SUM(Item.AvailableCopies) FROM Item JOIN ItemType ON Item.ItemTypeID = ItemType.ItemTypeID WHERE ItemType.TypeName = 'Movie') AS AvailableMovieCount, " +

"        (SELECT COUNT(*) FROM Item JOIN ItemType ON Item.ItemTypeID = ItemType.ItemTypeID WHERE ItemType.TypeName = 'Music') AS MusicTitleCount, " +
"        (SELECT SUM(Item.TotalCopies) FROM Item JOIN ItemType ON Item.ItemTypeID = ItemType.ItemTypeID WHERE ItemType.TypeName = 'Music') AS TotalMusicCount, " +
"        (SELECT SUM(Item.AvailableCopies) FROM Item JOIN ItemType ON Item.ItemTypeID = ItemType.ItemTypeID WHERE ItemType.TypeName = 'Music') AS AvailableMusicCount, " +

"        (SELECT COUNT(*) FROM Item JOIN ItemType ON Item.ItemTypeID = ItemType.ItemTypeID WHERE ItemType.TypeName = 'Device') AS TechTitleCount, " +
"        (SELECT SUM(Item.TotalCopies) FROM Item JOIN ItemType ON Item.ItemTypeID = ItemType.ItemTypeID WHERE ItemType.TypeName = 'Device') AS TotalTechCount, " +
"        (SELECT SUM(Item.AvailableCopies) FROM Item JOIN ItemType ON Item.ItemTypeID = ItemType.ItemTypeID WHERE ItemType.TypeName = 'Device') AS AvailableTechCount, " +

"        (SELECT COUNT(*) FROM Fines WHERE Fines.PaymentStatus = 0) AS OutstandingFines, " +
"        (SELECT COUNT(*) FROM Customer WHERE Customer.EmailConfirmed = 1) AS RegisteredUsers, " +
"        (SELECT COUNT(*) FROM TRANSACTION_HISTORY) AS CheckoutInstances, " +
"        (SELECT COUNT(DISTINCT CustomerID) FROM TRANSACTION_HISTORY) AS UniqueCustomers " +
") " +

"SELECT *, " +
"       (BookTitleCount + MovieTitleCount + MusicTitleCount + TechTitleCount) AS TotalTitleCount, " +
"       (TotalBookCount + TotalMovieCount + TotalMusicCount + TotalTechCount) AS TotalCopiesCount, " +
"       (AvailableBookCount + AvailableMovieCount + AvailableMusicCount + AvailableTechCount) AS TotalAvailableCount " +
"FROM InventoryReport;"
).AsEnumerable().FirstOrDefault();

            if (entity == null)
            {
                return NotFound($"failed to display fines.");
            }

            entity.TransactionPopularity = await GetTransactionPopularityDataAsync();
            entity.TransactionFine = await GetTransactionFinesDataAsync();

            return Ok(entity);
        }


        // GET: api/TransactionHistory/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<TransactionHistory>>> GetTransactionHistory(int id)
        {
            try
            {
                // Use raw SQL to retrieve transaction histories for the given CustomerId
                var transactionHistories = await _context.TransactionHistory
                //Selects from the Transaction History and Item Table
                //Then it joins the Item table to get the Title of the item borrowed
                    .FromSqlRaw(@"
                        SELECT
                            I.Title,
                            TH.TransactionId, 
                            TH.CustomerId,
                            TH.ItemId,
                            TH.DateBorrowed, 
                            TH.DueDate, 
                            TH.ReturnDate
                        FROM TRANSACTION_HISTORY TH
                        JOIN Item I ON TH.ItemId = I.ItemId
                        WHERE TH.CustomerId = {0}", id)
                    .ToListAsync();

                // Check if any transaction histories were found
                if (transactionHistories == null || transactionHistories.Count == 0)
                {
                    return NotFound($"No transaction histories found for customer with ID {id}.");
                }

                // Return the list of transaction histories
                return Ok(transactionHistories);
            }
            catch (Exception ex)
            {
                // Log the exception and return a 500 Internal Server Error response
                _logger.LogError($"Error retrieving transaction histories for customer {id}: {ex.Message}");
                return StatusCode(500, "An error occurred while retrieving the transaction histories.");
            }
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


        //USED BY MASTER TRANSACTION ONLY

        private async Task<List<TransactionPopularityDto>> GetTransactionPopularityDataAsync()
        {
            return await _context.TransactionPopularity.FromSqlRaw("SELECT " +
                "Item.Title, " +
                "COUNT(*) AS count, " +
                "CASE " +
                "WHEN MAX(Movie.MovieID) IS NOT NULL THEN 'Movie' " +
                "WHEN MAX(Music.SongID) IS NOT NULL THEN 'Music' " +
                "WHEN MAX(Book.BookID) IS NOT NULL THEN 'Book' " +
                "WHEN MAX(Technology.DeviceID) IS NOT NULL THEN 'Technology' " +
                "ELSE 'Unknown Table' " +
                "END AS ItemType " +
                "FROM TRANSACTION_HISTORY " +
                "JOIN Item ON TRANSACTION_HISTORY.ItemID = Item.ItemID " +
                "LEFT JOIN Movie ON Item.ItemID = Movie.MovieID " +
                "LEFT JOIN Music ON Item.ItemID = Music.SongID " +
                "LEFT JOIN Book ON Item.ItemID = Book.BookID " +
                "LEFT JOIN Technology ON Item.ItemID = Technology.DeviceID " +
                "GROUP BY Item.Title").ToListAsync();
        }

        private async Task<List<TransactionFineDto>> GetTransactionFinesDataAsync()
        {
            return await _context.TransactionFine.FromSqlRaw("SELECT " +
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
                "WHEN MAX(Mu.SongID) IS NOT NULL THEN 'Music' " +
                "WHEN MAX(B.BookID) IS NOT NULL THEN 'Book' " +
                "WHEN MAX(T.DeviceID) IS NOT NULL THEN 'Technology' " +
                "ELSE 'Unknown Table' " +
                "END AS ItemType " +
                "FROM TRANSACTION_HISTORY TH " +
                "JOIN Item I ON TH.ItemID = I.ItemID " +
                "LEFT JOIN Movie M ON I.ItemID = M.MovieID " +
                "LEFT JOIN Music Mu ON I.ItemID = Mu.SongID " +
                "LEFT JOIN Book B ON I.ItemID = B.BookID " +
                "LEFT JOIN Technology T ON I.ItemID = T.DeviceID " +
                "JOIN Fines F ON TH.TransactionID = F.TransactionID " +
                "JOIN Customer C ON F.CustomerID = C.CustomerID " +
                "JOIN BorrowerType BT ON C.BorrowerTypeID = BT.BorrowerTypeID " +
                "GROUP BY " +
                "I.Title, C.Email, C.FirstName, C.LastName, BT.Type, " +
                "TH.DateBorrowed, TH.DueDate, F.Amount, F.PaymentStatus").ToListAsync();
        }





    }
}