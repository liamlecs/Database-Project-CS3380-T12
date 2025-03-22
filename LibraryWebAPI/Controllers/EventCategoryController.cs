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
    public class EventCategoryController : ControllerBase
    {
        private readonly LibraryContext _context;

        public EventCategoryController(LibraryContext context)
        {
            _context = context;
        }

        // GET: api/EventCategory
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EventCategory>>> GetEventCategories()
        {
            var eventCategories = await _context.EventCategories.ToListAsync();
            return Ok(eventCategories);
        }

        // GET: api/EventCategory/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EventCategory>> GetEventCategory(int id)
        {
            var eventCategory = await _context.EventCategories
                .FirstOrDefaultAsync(m => m.CategoryId == id);

            if (eventCategory == null)
            {
                return NotFound();
            }

            return Ok(eventCategory);
        }

        // POST: api/EventCategory
        [HttpPost]
        public async Task<ActionResult<EventCategory>> PostEventCategory(EventCategory eventCategory)
        {
            if (ModelState.IsValid)
            {
                _context.EventCategories.Add(eventCategory);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetEventCategory), new { id = eventCategory.CategoryId }, eventCategory);
            }
            return BadRequest();
        }

        // PUT: api/EventCategory/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEventCategory(int id, EventCategory eventCategory)
        {
            if (id != eventCategory.CategoryId)
            {
                return BadRequest();
            }

            try
            {
                _context.Entry(eventCategory).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EventCategoryExists(id))
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

        // DELETE: api/EventCategory/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEventCategory(int id)
        {
            var eventCategory = await _context.EventCategories.FindAsync(id);
            if (eventCategory == null)
            {
                return NotFound();
            }

            _context.EventCategories.Remove(eventCategory);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EventCategoryExists(int id)
        {
            return _context.EventCategories.Any(e => e.CategoryId == id);
        }
    }
}
