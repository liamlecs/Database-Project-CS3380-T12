using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryWebAPI.Data;
using LibraryWebAPI.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LibraryWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {
        private readonly LibraryContext _context;

        public EventController(LibraryContext context)
        {
            _context = context;
        }

        // GET: api/Event
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Event>>> GetEvents()
        {
              var events = await _context.Events.ToListAsync();
            return Ok(events);
        }

        // GET: api/Event/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Event>> GetEvent(int id)
        {
            var eventObj = await _context.Events

                .FirstOrDefaultAsync(m => m.EventId == id);

            if (eventObj == null)
            {
                return NotFound();
            }

            return Ok(eventObj);
        }

        // POST: api/Event
        [HttpPost]
        public async Task<ActionResult<Event>> PostEvent(Event eventObj)
        {
            if (ModelState.IsValid)
            {
                _context.Events.Add(eventObj);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetEvent), new { id = eventObj.EventId }, eventObj);
            }

            return BadRequest(ModelState);
        }

        // PUT: api/Event/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEvent(int id, Event eventObj)
        {
            if (id != eventObj.EventId)
            {
                return BadRequest();
            }

            _context.Entry(eventObj).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EventExists(eventObj.EventId))
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

        // DELETE: api/Event/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            var eventObj = await _context.Events.FindAsync(id);
            if (eventObj == null)
            {
                return NotFound();
            }

            _context.Events.Remove(eventObj);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EventExists(int id)
        {
            return _context.Events.Any(e => e.EventId == id);
        }
    }
}
