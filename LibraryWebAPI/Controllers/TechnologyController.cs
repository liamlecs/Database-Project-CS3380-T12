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
    public class TechnologyController : ControllerBase
    {
        private readonly LibraryContext _context;

        public TechnologyController(LibraryContext context)
        {
            _context = context;
        }

        // GET: api/Technology
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Technology>>> GetTechnologies()
        {
            var technologies = await _context.Technologies.Include(t => t.Device).ToListAsync();
            return Ok(technologies);
        }

        // GET: api/Technology/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Technology>> GetTechnology(int id)
        {
            var technology = await _context.Technologies
                .Include(t => t.Device)
                .FirstOrDefaultAsync(m => m.DeviceId == id);

            if (technology == null)
            {
                return NotFound();
            }

            return Ok(technology);
        }

        // POST: api/Technology
        [HttpPost]
        public async Task<ActionResult<Technology>> PostTechnology(Technology technology)
        {
            if (ModelState.IsValid)
            {
                _context.Add(technology);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetTechnology), new { id = technology.DeviceId }, technology);
            }

            return BadRequest(ModelState);
        }

        // PUT: api/Technology/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTechnology(int id, Technology technology)
        {
            if (id != technology.DeviceId)
            {
                return BadRequest();
            }

            _context.Entry(technology).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TechnologyExists(id))
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

        // DELETE: api/Technology/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTechnology(int id)
        {
            var technology = await _context.Technologies.FindAsync(id);
            if (technology == null)
            {
                return NotFound();
            }

            _context.Technologies.Remove(technology);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TechnologyExists(int id)
        {
            return _context.Technologies.Any(e => e.DeviceId == id);
        }
    }
}
