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
    public class BookGenreController : ControllerBase
    {
        private readonly LibraryContext _context;

        public BookGenreController(LibraryContext context)
        {
            _context = context;
        }

        // GET: api/BookGenre
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookGenre>>> GetBookGenres()
        {
            return await _context.BookGenres.ToListAsync();
        }

        // GET: api/BookGenre/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BookGenre>> GetBookGenre(int id)
        {
            var bookGenre = await _context.BookGenres
                .FirstOrDefaultAsync(m => m.BookGenreId == id);

            if (bookGenre == null)
            {
                return NotFound();
            }

            return bookGenre;
        }

        // POST: api/BookGenre
        [HttpPost]
        public async Task<ActionResult<BookGenre>> PostBookGenre(BookGenre bookGenre)
        {
            if (ModelState.IsValid)
            {
                _context.BookGenres.Add(bookGenre);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetBookGenre), new { id = bookGenre.BookGenreId }, bookGenre);
            }

            return BadRequest(ModelState);
        }

        // PUT: api/BookGenre/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBookGenre(int id, BookGenre bookGenre)
        {
            if (id != bookGenre.BookGenreId)
            {
                return BadRequest();
            }

            _context.Entry(bookGenre).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookGenreExists(id))
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

        // DELETE: api/BookGenre/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBookGenre(int id)
        {
            var bookGenre = await _context.BookGenres.FindAsync(id);
            if (bookGenre == null)
            {
                return NotFound();
            }

            _context.BookGenres.Remove(bookGenre);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BookGenreExists(int id)
        {
            return _context.BookGenres.Any(e => e.BookGenreId == id);
        }
    }
}
