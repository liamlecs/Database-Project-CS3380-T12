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


        [HttpGet("waitlist-status/{customerId}")]
public async Task<IActionResult> GetWaitlistStatus(int customerId)
{
    var notifications = await _context.Set<WaitlistNotificationDto>().FromSqlRaw(@"
        SELECT
            wn.NotificationId,
            i.Title,
            it.TypeName,
            DATEADD(DAY, 2, wn.ProcessedDate) AS ExpirationDate
        FROM WaitlistNotifications wn
        JOIN Item i ON wn.ItemId = i.ItemID
        JOIN ItemType it ON i.ItemTypeID = it.ItemTypeID
        WHERE wn.CustomerId = {0}
          AND wn.UserResponded = 0
          AND wn.EmailSent = 1
    ", customerId).ToListAsync();

    return Ok(notifications);
}


[HttpPost("waitlist-accept/{notificationId}")]
public async Task<IActionResult> AcceptWaitlist(int notificationId)
{
    var notification = await _context.WaitlistNotifications
        .FirstOrDefaultAsync(n => n.NotificationId == notificationId);

    if (notification == null)
        return NotFound();

    notification.UserResponded = true;
    notification.UserAccepted = true;

    var customer = await _context.Customers
        .Include(c => c.BorrowerType)
        .FirstOrDefaultAsync(c => c.CustomerId == notification.CustomerId);

    if (customer == null)
        return NotFound("Customer not found");

    int loanPeriod = customer.BorrowerType.LoanPeriod;

var transaction = new TransactionHistory
    {
        CustomerId = notification.CustomerId,
        ItemId = notification.ItemId,
DateBorrowed = DateOnly.FromDateTime(DateTime.Today),
DueDate = DateOnly.FromDateTime(DateTime.Today.AddDays(loanPeriod))

    };

    // Save notification + transaction together
    await _context.SaveChangesAsync(); // update the notification first

    // Call the private method
    return await PostTransactionHistoryPrivate(transaction);
}


[HttpPost("waitlist-reject/{notificationId}")]
public async Task<IActionResult> RejectWaitlist(int notificationId)
{
    try
    {
    var notification = await _context.WaitlistNotifications
        .FirstOrDefaultAsync(n => n.NotificationId == notificationId);

    if (notification == null)
        return NotFound($"Notification with ID {notificationId} not found.");

// Mark as responded
notification.UserResponded = true;
await _context.SaveChangesAsync();
    // Do not set UserAccepted — it stays false by default

// Find the associated item
    await _context.Database.ExecuteSqlRawAsync(
            "UPDATE Item SET AvailableCopies = AvailableCopies + 1 WHERE ItemID = {0}",
            notification.ItemId
        );

    return Ok();
}
catch (Exception ex)
    {
        // Log error (use your actual logger if available)
        Console.WriteLine($"Error in RejectWaitlist: {ex.Message}");
        return StatusCode(500, "An error occurred while rejecting the waitlist notification.");
    }
    }

[HttpPost("waitlist-globaltimeout")]
public async Task<IActionResult> GlobalTimeoutExpiredWaitlists()
{
    var now = DateTime.UtcNow;

    var expiredNotifications = await _context.WaitlistNotifications
        .Where(n =>
            n.ProcessedDate.HasValue &&
            !n.UserResponded &&
            n.EmailSent &&
            n.ProcessedDate.Value.AddDays(2) <= now
        )
        .ToListAsync();

    var itemIds = expiredNotifications.Select(n => n.ItemId).Distinct();

    foreach (var itemId in itemIds)
    {
        await _context.Database.ExecuteSqlRawAsync(
            "UPDATE Item SET AvailableCopies = AvailableCopies + 1 WHERE ItemID = {0}",
            itemId
        );
    }

    return Ok(new { FreedItems = itemIds.Count() });
}

[HttpPost("waitlist-timeout/{customerId}")]
public async Task<IActionResult> UserTimeoutExpiredWaitlists(int customerId)
{
    var now = DateTime.UtcNow;

    var expiredUserNotifications = await _context.WaitlistNotifications
        .Where(n =>
            n.CustomerId == customerId &&
            n.ProcessedDate.HasValue &&
            !n.UserResponded &&
            n.EmailSent &&
            n.ProcessedDate.Value.AddDays(2) <= now
        )
        .ToListAsync();

    foreach (var notification in expiredUserNotifications)
    {
        notification.UserResponded = true;
    }

    await _context.SaveChangesAsync();

    return Ok(new { MarkedExpired = expiredUserNotifications.Count });
}


        private async Task<IActionResult> PostTransactionHistoryPrivate(TransactionHistory transactionHistory)
{
    if (ModelState.IsValid)
    {
        _context.TransactionHistories.Add(transactionHistory);
        await _context.SaveChangesAsync();
        return Ok();
    }

    return BadRequest();
}


    }
}
