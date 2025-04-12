using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryWebAPI.Data;
using LibraryWebAPI.Models;
using LibraryWebAPI.DTOs; // Contains UpdateAvailableCopiesDto
using LibraryWebAPI.Services; // Contains IEmailService

namespace LibraryWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly LibraryContext _context;
        private readonly IEmailService _emailService;

        public ItemController(LibraryContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // GET: api/Item
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Item>>> GetItems()
        {
            var items = await _context.Items.ToListAsync();
            return Ok(items);
        }

        // GET: api/Item/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Item>> GetItem(int id)
        {
            var item = await _context.Items.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }
            return Ok(item);
        }

        // POST: api/Item
        [HttpPost]
        public async Task<ActionResult<Item>> PostItem(Item item)
        {
            if (ModelState.IsValid)
            {
                _context.Items.Add(item);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetItem), new { id = item.ItemId }, item);
            }
            return BadRequest();
        }

        // PUT: api/Item/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutItem(int id, Item item)
        {
            if (id != item.ItemId)
            {
                return BadRequest();
            }

            try
            {
                _context.Entry(item).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ItemExists(id))
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

        // DELETE: api/Item/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            var item = await _context.Items.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            _context.Items.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ItemExists(int id)
        {
            return _context.Items.Any(e => e.ItemId == id);
        }

// // PATCH: api/Item/update-copies
// [HttpPatch("update-copies")]
// public async Task<IActionResult> UpdateAvailableCopies([FromBody] UpdateAvailableCopiesDto dto)
// {
//     var item = await _context.Items.FindAsync(dto.ItemId);
//     if (item == null)
//     {
//         return NotFound($"Item with ID {dto.ItemId} not found.");
//     }

//     // Store the original available copies count.
//     int oldAvailableCopies = item.AvailableCopies;
//     var proposedValue = oldAvailableCopies + dto.ChangeInCopies;

//     if (proposedValue < 0)
//     {
//         return BadRequest("Not enough copies available.");
//     }

//     if (proposedValue > item.TotalCopies)
//     {
//         return BadRequest("Cannot exceed total number of copies.");
//     }

//     // Update available copies and commit that change.
//     item.AvailableCopies = proposedValue;
//     await _context.SaveChangesAsync();

//     Console.WriteLine($"oldAvailableCopies = {oldAvailableCopies}, proposedValue = {proposedValue}");

//     // Process waitlist only when going from 0 to a positive number.
//     if (oldAvailableCopies == 0 && proposedValue > 0)
//     {
//         Console.WriteLine("Waitlist block triggered!");

//         // Retrieve active waitlist entries for this item, ordered by ReservationDate.
//         var waitlistEntries = await _context.Waitlists
//             .Where(w => w.ItemId == item.ItemId && w.isReceived == false)
//             .OrderBy(w => w.ReservationDate)
//             .ToListAsync();

//         // For each waitlist entry, process one copy at a time.
//         for (int i = 0; i < waitlistEntries.Count; i++)
//         {
//             // Stop processing if no copies remain.
//             if (item.AvailableCopies <= 0)
//             {
//                 break;
//             }

//             var entry = waitlistEntries[i];

//             // Mark the waitlist entry as received.
//             entry.isReceived = true;

//             // Lookup the customer to retrieve the email and borrower type.
//             var customer = await _context.Customers.FindAsync(entry.CustomerId);

//             // Determine the loan period based on BorrowerTypeID.
//             // Assume: BorrowerTypeID = 1 (default) is Student -> 7 days,
//             //          BorrowerTypeID = 2 is Faculty -> 14 days.
//             int loanPeriod = 7; // default to 7 days for students.
//             if (customer != null && customer.BorrowerTypeId == 2)
//             {
//                 loanPeriod = 14;
//             }

//             DateTime now = DateTime.Now;
//             DateOnly dueDate = DateOnly.FromDateTime(now).AddDays(loanPeriod);
//             DateOnly dateBorrowed = DateOnly.FromDateTime(now);

//             // Create a TransactionHistory record for the assignment.
//             var transaction = new TransactionHistory
//             {
//                 CustomerId = entry.CustomerId,
//                 ItemId = item.ItemId,
//                 DateBorrowed = dateBorrowed,
//                 DueDate = dueDate,
//                 // Add additional properties as needed.
//             };
//             _context.TransactionHistories.Add(transaction);

//             // Decrease the available copies by 1.
//             item.AvailableCopies--;

//             // Send an email notification to the customer.
//             if (customer != null && !string.IsNullOrEmpty(customer.Email))
//             {
//                 await _emailService.SendEmailAsync(
//                     customer.Email,
//                     $"Item '{item.Title}' Now Available!",
//                     $"Good news! A copy of '{item.Title}' has been assigned to you. " +
//                     $"It is due on {dueDate.ToString("MM/dd/yyyy")}. Enjoy!"
//                 );
//             }
//         }

//         // Save the updates for waitlist entries, transaction records, and the modified available copies.
//         await _context.SaveChangesAsync();
//     }

//     return Ok(new
//     {
//         item.ItemId,
//         item.Title,
//         item.AvailableCopies,
//         item.TotalCopies
//     });
// }


    }
}
