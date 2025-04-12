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

[HttpPatch("update-copies")]
public async Task<IActionResult> UpdateAvailableCopies([FromBody] UpdateAvailableCopiesDto dto)
{
    var item = await _context.Items.FindAsync(dto.ItemId);
    if (item == null)
    {
        return NotFound($"Item with ID {dto.ItemId} not found.");
    }

    int oldAvailableCopies = item.AvailableCopies;
    var proposedValue = oldAvailableCopies + dto.ChangeInCopies;

    if (proposedValue < 0)
    {
        return BadRequest("Not enough copies available.");
    }

    if (proposedValue > item.TotalCopies)
    {
        return BadRequest("Cannot exceed total number of copies.");
    }

    // Use ExecuteUpdateAsync to bypass OUTPUT clause
    await _context.Items
        .Where(i => i.ItemId == dto.ItemId)
        .ExecuteUpdateAsync(setters => setters
            .SetProperty(i => i.AvailableCopies, proposedValue));

    // Reload the item to get updated values
    item = await _context.Items.FindAsync(dto.ItemId);

    Console.WriteLine($"oldAvailableCopies = {oldAvailableCopies}, proposedValue = {proposedValue}");

    if (oldAvailableCopies == 0 && proposedValue > 0)
    {
        Console.WriteLine("Waitlist block triggered!");

        var waitlistEntries = await _context.Waitlists
            .Where(w => w.ItemId == item.ItemId && w.isReceived == false)
            .OrderBy(w => w.ReservationDate)
            .ToListAsync();

        foreach (var entry in waitlistEntries)
        {
            if (item.AvailableCopies <= 0)
                break;

            entry.isReceived = true;

            var customer = await _context.Customers.FindAsync(entry.CustomerId);

            int loanPeriod = customer?.BorrowerTypeId == 2 ? 14 : 7;

            DateTime now = DateTime.Now;
            var transaction = new TransactionHistory
            {
                CustomerId = entry.CustomerId,
                ItemId = item.ItemId,
                DateBorrowed = DateOnly.FromDateTime(now),
                DueDate = DateOnly.FromDateTime(now).AddDays(loanPeriod),
            };
            _context.TransactionHistories.Add(transaction);

            // Decrement using ExecuteUpdateAsync to avoid OUTPUT clause
            await _context.Items
                .Where(i => i.ItemId == item.ItemId)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(i => i.AvailableCopies, i => i.AvailableCopies - 1));

            // Reload the item after each update
            item = await _context.Items.FindAsync(dto.ItemId);

            if (customer != null && !string.IsNullOrEmpty(customer.Email))
            {
                await _emailService.SendEmailAsync(
                    customer.Email,
                    $"Item '{item.Title}' Now Available!",
                    $"Good news! A copy of '{item.Title}' has been assigned to you. " +
                    $"It is due on {transaction.DueDate.ToString("MM/dd/yyyy")}. Enjoy!"
                );
            }
        }

        // Save changes for waitlist entries and transactions
        await _context.SaveChangesAsync();
    }

    return Ok(new
    {
        item.ItemId,
        item.Title,
        item.AvailableCopies,
        item.TotalCopies
    });
}


    }
}
