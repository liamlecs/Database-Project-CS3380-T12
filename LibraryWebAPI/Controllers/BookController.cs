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
using Microsoft.Extensions.Configuration;

namespace LibraryWebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookController : ControllerBase
    {
        private readonly LibraryContext _context;
        private readonly IWebHostEnvironment _env;

        private readonly IConfiguration _configuration; // Add this field

        public BookController(LibraryContext context, IWebHostEnvironment env, IConfiguration configuration) // Add IConfiguration to the constructor
        {
            _context = context;
            _env = env;
            _configuration = configuration;  // Set the field from DI
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetBooks()
        {
            var books = await _context.Books
                .Include(b => b.Item)
                .Include(b => b.BookAuthor)
                .Include(b => b.BookGenre)
                .Include(b => b.Publisher)
                .Where(b => b.IsDeactivated == false) // Exclude deactivated books
                // .Include(b=> b.image)
                .Select(b => new
                {
                    b.BookId,
                    b.Isbn,
                    b.YearPublished,
                    itemId = b.Item.ItemId,
                    Title = b.Item.Title,               // from related Item
                    Author = b.BookAuthor.FirstName + " " + b.BookAuthor.LastName,      // from related Author
                    AuthorFirstName = b.BookAuthor.FirstName, // from related Author
                    AuthorLastName = b.BookAuthor.LastName,   // from related Author
                    Genre = b.BookGenre.Description,         // from related Genre
                    Publisher = b.Publisher.PublisherName,  // from related Publisher
                    coverImagePath = b.CoverImagePath, // from related Image            })
                    totalCopies = b.Item.TotalCopies, // from related Item
                    availableCopies = b.Item.AvailableCopies, // from related Item
                    itemLocation = b.Item.Location, // from related Item
                    b.IsDeactivated,
                    itemTypeId = b.Item.ItemTypeID // Get this value from the related Item
                })
                .ToListAsync();

            return Ok(books);
        } // stashed my changes loll

        [HttpGet("{id}")]
public async Task<ActionResult<object>> GetBook(int id)
{
    var book = await _context.Books
        .Include(b => b.Item)
        .Include(b => b.BookAuthor)
        .Include(b => b.BookGenre)
        .Include(b => b.Publisher)
        .Where(b => b.BookId == id && b.IsDeactivated == false) // Exclude deactivated books
        .Select(b => new
        {
            b.BookId,
            b.Isbn,
            b.YearPublished,
            itemId          = b.Item.ItemId,
            Title           = b.Item.Title,
            Author          = b.BookAuthor.FirstName + " " + b.BookAuthor.LastName,
            AuthorFirstName = b.BookAuthor.FirstName, // from related Author
            AuthorLastName = b.BookAuthor.LastName,   // from related Author
            Genre           = b.BookGenre.Description,
            Publisher       = b.Publisher.PublisherName,
            coverImagePath  = b.CoverImagePath,
            availableCopies = b.Item.AvailableCopies,
            totalCopies = b.Item.TotalCopies,
            itemLocation    = b.Item.Location,
            b.IsDeactivated
        })
        .FirstOrDefaultAsync();

    if (book == null) return NotFound();
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
            ItemTypeID = 1 // Assuming 1 is the ID for books in ItemType table.
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

[HttpPut("edit-book/{id}")]
public async Task<IActionResult> EditBookWithItem(int id, [FromBody] BookDTO model)
{
    // 1️⃣ Validate
    if (!ModelState.IsValid)
        return BadRequest(ModelState);

    // 2️⃣ Begin transaction
    await using var tx = await _context.Database.BeginTransactionAsync();
    try
    {
        // 3️⃣ Load tracked Book + its Item
        var book = await _context.Books
                                 .Include(b => b.Item)
                                 .FirstOrDefaultAsync(b => b.BookId == id);
        if (book == null) 
            return NotFound();

        // 4️⃣ Map BookDTO → Item
        book.Item.Title           = model.Title!;
        book.Item.TotalCopies     = model.TotalCopies;
        book.Item.AvailableCopies = Math.Min(
            model.TotalCopies,
            model.AvailableCopies    // ← use the DTO’s value here
        );
        book.Item.Location        = model.Location;

        // 5️⃣ Persist Item changes
        await _context.SaveChangesAsync();

        // 6️⃣ Map BookDTO → Book
        book.Isbn           = model.ISBN;
        book.PublisherId    = model.PublisherID;
        book.BookGenreId    = model.BookGenreID;
        book.BookAuthorId   = model.BookAuthorID;
        book.YearPublished  = model.YearPublished;
        book.CoverImagePath = model.CoverImagePath;

        // 7️⃣ Persist Book changes
        await _context.SaveChangesAsync();

        // 8️⃣ Commit
        await tx.CommitAsync();

        return NoContent();
    }
    catch (Exception ex)
    {
        // 9️⃣ Rollback + error response
        await tx.RollbackAsync();
        return StatusCode(StatusCodes.Status500InternalServerError, new {
            message = "Error updating book",
            error   = ex.Message
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

    try
    {
        // Instantiate BlobStorageService (ideally inject via dependency injection)
        var blobService = new BlobStorageService(_configuration);
        string fileUrl = await blobService.UploadFileAsync(dto.Cover);
        return Ok(new { url = fileUrl });
    }
    catch (Exception ex)
    {
        return StatusCode(StatusCodes.Status500InternalServerError, 
                          new { message = "Image upload failed", error = ex.Message });
    }
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
            // Find the book by ID
            var book = await _context.Books
                .FirstOrDefaultAsync(b => b.BookId == id);

            if (book == null)
            {
                return NotFound();
            }

            // Mark the book as deactivated
            book.IsDeactivated = true; // Set the IsDeactivated field to true
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
