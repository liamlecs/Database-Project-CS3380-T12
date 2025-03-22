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
    public class BookAuthorController : ControllerBase
    {
        private readonly LibraryContext _context;

        public BookAuthorController(LibraryContext context)
        {
            _context = context;
        }

        // GET: api/BookAuthor
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookAuthor>>> GetBookAuthors()
        {
            return await _context.BookAuthors.ToListAsync();
        }

        // GET: api/BookAuthor/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BookAuthor>> GetBookAuthor(int id)
        {
            var bookAuthor = await _context.BookAuthors
                .FirstOrDefaultAsync(m => m.BookAuthorId == id);

            if (bookAuthor == null)
            {
                return NotFound();
            }

            return bookAuthor;
        }

        // POST: api/BookAuthor
        [HttpPost]
        public async Task<ActionResult<BookAuthor>> PostBookAuthor(BookAuthor bookAuthor)
        {
            if (ModelState.IsValid)
            {
                _context.BookAuthors.Add(bookAuthor);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetBookAuthor), new { id = bookAuthor.BookAuthorId }, bookAuthor);
            }

            return BadRequest(ModelState);
        }

        // PUT: api/BookAuthor/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBookAuthor(int id, BookAuthor bookAuthor)
        {
            if (id != bookAuthor.BookAuthorId)
            {
                return BadRequest();
            }

            _context.Entry(bookAuthor).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookAuthorExists(id))
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

        // DELETE: api/BookAuthor/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBookAuthor(int id)
        {
            var bookAuthor = await _context.BookAuthors.FindAsync(id);
            if (bookAuthor == null)
            {
                return NotFound();
            }

            _context.BookAuthors.Remove(bookAuthor);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BookAuthorExists(int id)
        {
            return _context.BookAuthors.Any(e => e.BookAuthorId == id);
        }
    }
}
