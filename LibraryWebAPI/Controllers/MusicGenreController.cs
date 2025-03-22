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
    public class MusicGenreController : ControllerBase
    {
        private readonly LibraryContext _context;

        public MusicGenreController(LibraryContext context)
        {
            _context = context;
        }

        // GET: api/MusicGenre
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MusicGenre>>> GetMusicGenres()
        {
            var musicGenres = await _context.MusicGenres.ToListAsync();
            return Ok(musicGenres);
        }

        // GET: api/MusicGenre/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MusicGenre>> GetMusicGenre(int id)
        {
            var musicGenre = await _context.MusicGenres.FirstOrDefaultAsync(m => m.MusicGenreId == id);
            if (musicGenre == null)
            {
                return NotFound();
            }

            return Ok(musicGenre);
        }

        // POST: api/MusicGenre
        [HttpPost]
        public async Task<ActionResult<MusicGenre>> PostMusicGenre(MusicGenre musicGenre)
        {
            if (ModelState.IsValid)
            {
                _context.MusicGenres.Add(musicGenre);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetMusicGenre), new { id = musicGenre.MusicGenreId }, musicGenre);
            }

            return BadRequest();
        }

        // PUT: api/MusicGenre/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMusicGenre(int id, MusicGenre musicGenre)
        {
            if (id != musicGenre.MusicGenreId)
            {
                return BadRequest();
            }

            try
            {
                _context.Entry(musicGenre).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MusicGenreExists(id))
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

        // DELETE: api/MusicGenre/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMusicGenre(int id)
        {
            var musicGenre = await _context.MusicGenres.FindAsync(id);
            if (musicGenre == null)
            {
                return NotFound();
            }

            _context.MusicGenres.Remove(musicGenre);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MusicGenreExists(int id)
        {
            return _context.MusicGenres.Any(e => e.MusicGenreId == id);
        }
    }
}
