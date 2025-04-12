using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryWebAPI.Data;
using LibraryWebAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using LibraryWebAPI.Models.DTOs;

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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetBooks()
        {
            var books = await _context.Books
                .Include(b => b.Item)
                .Include(b => b.BookAuthor)
                .Include(b => b.BookGenre)
                .Include(b => b.Publisher)
                // .Include(b=> b.image)
                .Select(b => new
                {
                    b.BookId,
                    b.Isbn,
                    b.YearPublished,
                    itemId = b.Item.ItemId,
                    Title = b.Item.Title,               // from related Item
                    Author = b.BookAuthor.FirstName + " " + b.BookAuthor.LastName,      // from related Author
                    Genre = b.BookGenre.Description,         // from related Genre
                    Publisher = b.Publisher.PublisherName,  // from related Publisher
                    coverImagePath = b.CoverImagePath, // from related Image            })
                    availableCopies = b.Item.AvailableCopies, // from related Item
                    itemLocation = b.Item.Location, // from related Item
                })
                .ToListAsync();

            return Ok(books);
        } // stashed my changes loll


        // GET: api/Book/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Book>> GetBook(int id)
        {
            var book = await _context.Books.FindAsync(id);

            if (book == null)
            {
                return NotFound();
            }

            return Ok(book);
        }

        // // POST: api/Book
        // [HttpPost]
        // public async Task<ActionResult<Book>> PostBook(Book book)
        // {
        //     _context.Books.Add(book);
        //     await _context.SaveChangesAsync();

        //     return CreatedAtAction(nameof(GetBook), new { id = book.BookId }, book);
        // }

        [HttpPost("add-book")]
        public async Task<IActionResult> AddBookWithItem([FromBody] BookDTO model)
        {
            var item = new Item {
                Title = model.Title!,
                AvailabilityStatus = "Available",
                TotalCopies = model.TotalCopies,
                AvailableCopies = model.TotalCopies,
                Location = model.Location,
                ItemTypeID = 1
            };

            _context.Items.Add(item);
            await _context.SaveChangesAsync();

            var book = new Book {
                Isbn = model.ISBN,
                PublisherId = model.PublisherID,
                BookGenreId = model.BookGenreID,
                BookAuthorId = model.BookAuthorID,
                YearPublished = model.YearPublished,
                CoverImagePath = model.CoverImagePath,
                ItemID = item.ItemId
            };

            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Book and Item added successfully", itemId = item.ItemId });
        }


        // PUT: api/Book/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBook(int id, Book book)
        {
            if (id != book.BookId)
            {
                return BadRequest();
            }

            _context.Entry(book).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Book/5
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
