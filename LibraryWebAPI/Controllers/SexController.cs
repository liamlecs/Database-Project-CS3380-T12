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
    public class SexController : ControllerBase
    {
        private readonly LibraryContext _context;

        public SexController(LibraryContext context)
        {
            _context = context;
        }

        // GET: api/Sex
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Sex>>> GetSexes()
        {
            var sexes = await _context.Sexes.ToListAsync();
            return Ok(sexes);
        }

        // GET: api/Sex/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Sex>> GetSex(int id)
        {
            var sex = await _context.Sexes.FindAsync(id);

            if (sex == null)
            {
                return NotFound();
            }

            return Ok(sex);
        }

        // POST: api/Sex
        [HttpPost]
        public async Task<ActionResult<Sex>> PostSex(Sex sex)
        {
            if (ModelState.IsValid)
            {
                _context.Sexes.Add(sex);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetSex), new { id = sex.SexID }, sex);
            }

            return BadRequest();
        }

        // PUT: api/Sex/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSex(int id, Sex sex)
        {
            if (id != sex.SexID)
            {
                return BadRequest();
            }

            try
            {
                _context.Entry(sex).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SexExists(id))
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

        // DELETE: api/Sex/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSex(int id)
        {
            var sex = await _context.Sexes.FindAsync(id);
            if (sex == null)
            {
                return NotFound();
            }

            _context.Sexes.Remove(sex);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SexExists(int id)
        {
            return _context.Sexes.Any(e => e.SexID == id);
        }
    }
}
