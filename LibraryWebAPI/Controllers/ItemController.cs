using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryWebAPI.Data;
using LibraryWebAPI.Models;
using LibraryWebAPI.DTOs; // Make sure this is added if you're using a DTO folder


namespace LibraryWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly LibraryContext _context;

        public ItemController(LibraryContext context)
        {
            _context = context;
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
    


        // PATCH: api/Item/update-copies
        [HttpPatch("update-copies")]
        public async Task<IActionResult> UpdateAvailableCopies([FromBody] UpdateAvailableCopiesDto dto)
        {
            var item = await _context.Items.FindAsync(dto.ItemId);
            if (item == null)
            {
                return NotFound($"Item with ID {dto.ItemId} not found.");
            }

            var proposedValue = item.AvailableCopies + dto.ChangeInCopies;

            if (proposedValue < 0)
            {
                return BadRequest("Not enough copies available.");
            }

            if (proposedValue > item.TotalCopies)
            {
                return BadRequest("Cannot exceed total number of copies.");
            }

            item.AvailableCopies = proposedValue;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}




