using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryWebAPI.Data;
using LibraryWebAPI.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LibraryWebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookController : ControllerBase
    {
        private readonly LibraryContext _context;

        public BookController(LibraryContext context)
        {
            _context = context;
        }

        // GET: api/Book (fetch all books)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Book>>> GetBooks()
        {
            var books = await _context.Books
                .Include(b => b.BookAuthor)
                .Include(b => b.BookGenre)
                .Include(b => b.Publisher)
                .ToListAsync();  // Return the full Book model, including navigation properties

            if (books == null || !books.Any())
            {
                return NotFound();
            }

            return Ok(books);  // Return the full Book model
        }


        // GET: api/Book/{id} (fetch single book by ID)
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetBook(int id)
        {
            var book = await _context.Books
                .Include(b => b.BookAuthor)
                .Include(b => b.BookGenre)
                .Include(b => b.Publisher)
                .Where(b => b.BookId == id)
                .Select(b => new 
                {
                    b.BookId,
                    Title = $"ISBN: {b.Isbn}",
                    Author = $"{b.BookAuthor.FirstName} {b.BookAuthor.LastName}",
                    ImageUrl = "",  // Placeholder for book image
                    // IsCheckedOut = b.IsCheckedOut ? "true" : "false"
                })
                .FirstOrDefaultAsync();

            if (book == null)
            {
                return NotFound();
            }

            return Ok(book);
        }

        // POST: api/Book (create a new book)
        [HttpPost]
        public async Task<ActionResult<Book>> PostBook(Book book)
        {
            // Ensure related entities exist
            var author = await _context.BookAuthors.FindAsync(book.BookAuthorId);
            var genre = await _context.BookGenres.FindAsync(book.BookGenreId);
            var publisher = await _context.Publishers.FindAsync(book.PublisherId);

            if (author == null || genre == null || publisher == null)
            {
                return BadRequest("Invalid author, genre, or publisher.");
            }

            // Assign related entities to the book
            book.BookAuthor = author;
            book.BookGenre = genre;
            book.Publisher = publisher;

            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBook), new { id = book.BookId }, book);
        }

        // PUT: api/Book/{id} (update an existing book)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBook(int id, Book book)
        {
            if (id != book.BookId)
            {
                return BadRequest();
            }

            // Ensure related entities exist
            var author = await _context.BookAuthors.FindAsync(book.BookAuthorId);
            var genre = await _context.BookGenres.FindAsync(book.BookGenreId);
            var publisher = await _context.Publishers.FindAsync(book.PublisherId);

            if (author == null || genre == null || publisher == null)
            {
                return BadRequest("Invalid author, genre, or publisher.");
            }

            // Update relationships
            book.BookAuthor = author;
            book.BookGenre = genre;
            book.Publisher = publisher;

            _context.Entry(book).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Book/{id} (delete a book by ID)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound();
            }

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
