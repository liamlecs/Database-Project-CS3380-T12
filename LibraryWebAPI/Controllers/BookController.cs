using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryWebAPI.Data;
using LibraryWebAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using LibraryWebAPI.Models.DTOs;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Threading.Tasks;

namespace LibraryWebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookController : ControllerBase
    {
        private readonly LibraryContext _context;
        private readonly IWebHostEnvironment _env;

        public BookController(LibraryContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
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
    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);
    }

    // Begin a database transaction to ensure both insertions succeed together.
    using var transaction = await _context.Database.BeginTransactionAsync();

    try
    {
        // Create the Item first.
        var item = new Item
        {
            Title = model.Title!,
            // Do not set computed fields such as AvailabilityStatus if the database calculates these.
            TotalCopies = model.TotalCopies,
            AvailableCopies = model.TotalCopies,
            Location = model.Location,
            ItemTypeID = 1 // Assuming 1 is the ID for books in your ItemType table.
        };

        _context.Items.Add(item);
        await _context.SaveChangesAsync(); // Saves to generate the ItemId.

        // Create the Book record referencing the newly created item.
        var book = new Book
        {
            Isbn = model.ISBN,
            PublisherId = model.PublisherID,
            BookGenreId = model.BookGenreID,
            BookAuthorId = model.BookAuthorID,
            YearPublished = model.YearPublished,
            CoverImagePath = model.CoverImagePath,
            ItemID = item.ItemId   // Foreign key reference to the created item.
        };

        _context.Books.Add(book);
        await _context.SaveChangesAsync();

        // Commit the transaction.
        await transaction.CommitAsync();

        return Ok(new { message = "Book and Item added successfully", itemId = item.ItemId });
    }
    catch (Exception ex)
    {
        await transaction.RollbackAsync();
        return StatusCode(StatusCodes.Status500InternalServerError, new { 
            message = "Error while adding book", 
            error = ex.Message 
        });
    }
}

        
        [HttpPost("upload-cover")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadCover([FromForm] CoverUploadDto dto)
        {
            if (dto?.Cover == null || dto.Cover.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            // Define the folder where files will be stored
            var uploadsFolder = Path.Combine(_env.ContentRootPath, "UploadedFiles", "BookCovers");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            // Generate a unique filename
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.Cover.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await dto.Cover.CopyToAsync(stream);
            }

            var fileUrl = $"{Request.Scheme}://{Request.Host}/uploads/book_covers/{fileName}";
            return Ok(new { url = fileUrl });
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
