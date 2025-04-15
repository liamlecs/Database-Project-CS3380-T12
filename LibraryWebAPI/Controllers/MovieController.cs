using LibraryWebAPI.Data;
using LibraryWebAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryWebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MovieController : ControllerBase
    {
        private readonly LibraryContext _context;
        private readonly IWebHostEnvironment _env;

        public MovieController(LibraryContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: api/Movie
        [HttpGet]
        public async Task<IActionResult> GetMovies()
        {
            var movies = await _context.Movies
                .Include(m => m.MovieDirector) // Include related MovieDirector
                .Include(m => m.Item) // Optionally include the Item record to get the title.
                .Include(m => m.MovieGenre) // Include related MovieGenre
                .ToListAsync();
            return Ok(movies);
        }

        // GET: api/Movie/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMovie(int id)
        {
            var movie = await _context.Movies
                .Include(m => m.Item)
                .Include(m => m.MovieDirector) // Include related MovieDirector
                .Include(m => m.MovieGenre) // Include related MovieGenre
                .FirstOrDefaultAsync(m => m.MovieId == id);

            if (movie == null)
            {
                return NotFound();
            }
            return Ok(movie);
        }

        // POST: api/Movie/add-movie
        [HttpPost("add-movie")]
        public async Task<IActionResult> AddMovie([FromBody] MovieDTO model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Use a transaction to ensure both Item and Movie are added together.
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // 1. Create the Item record.
                var item = new Item
                {
                    Title = model.Title,              // Title is stored in Item.
                    TotalCopies = model.TotalCopies,
                    AvailableCopies = model.TotalCopies,
                    Location = model.Location,
                    ItemTypeID = model.ItemTypeID       // For Movies, e.g. 2.
                };

                _context.Items.Add(item);
                await _context.SaveChangesAsync(); // item.ItemId is generated.

                // 2. Create the Movie record.
                var movie = new Movie
                {
                    Upc = model.UPC,
                    MovieDirectorId = model.MovieDirectorID,
                    MovieGenreId = model.MovieGenreID,
                    YearReleased = model.YearReleased,
                    Format = model.Format,
                    CoverImagePath = model.CoverImagePath,
                    ItemId = item.ItemId              // Note: property is "ItemId" on Movie.
                };

                _context.Movies.Add(movie);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                return Ok(new { message = "Movie added successfully", itemId = item.ItemId });
            }
                catch (DbUpdateException dbEx)
            {
                await transaction.RollbackAsync();

                // Check if the inner exception is a SQL exception and if it indicates a unique constraint violation (error number 2627)
                if (dbEx.InnerException is Microsoft.Data.SqlClient.SqlException sqlEx && sqlEx.Number == 2627)
                {
                    return Conflict(new 
                    { 
                        message = "A movie with this UPC already exists. Please use a unique UPC.", 
                        error = sqlEx.Message 
                    });
                }
                return StatusCode(StatusCodes.Status500InternalServerError,
                                new { message = "Error while adding movie", error = dbEx.Message });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(StatusCodes.Status500InternalServerError,
                                  new { message = "Error while adding movie", error = ex.Message });
            }
        }

        // PUT: api/Movie/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMovie(int id, [FromBody] MovieDTO model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Retrieve the movie record.
            var movie = await _context.Movies.FindAsync(id);
            if (movie == null)
            {
                return NotFound();
            }

            // Update movie-specific properties.
            movie.Upc = model.UPC;
            movie.MovieDirectorId = model.MovieDirectorID;
            movie.MovieGenreId = model.MovieGenreID;
            movie.YearReleased = model.YearReleased;
            movie.Format = model.Format;
            movie.CoverImagePath = model.CoverImagePath;

            // Also update the associated Item record for the Title, Copies, and Location.
            var item = await _context.Items.FindAsync(movie.ItemId);
            if (item != null)
            {
                item.Title = model.Title;
                item.TotalCopies = model.TotalCopies;
                item.AvailableCopies = model.TotalCopies;
                item.Location = model.Location;
                // ItemTypeID generally remains unchanged.
            }

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Movie updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                                  new { message = "Error updating movie", error = ex.Message });
            }
        }

        // DELETE: api/Movie/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMovie(int id)
        {
            var movie = await _context.Movies.FindAsync(id);
            if (movie == null)
            {
                return NotFound();
            }

            // Retrieve the associated Item record.
            var item = await _context.Items.FindAsync(movie.ItemId);

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                _context.Movies.Remove(movie);
                if (item != null)
                {
                    _context.Items.Remove(item);
                }
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { message = "Movie and associated item deleted successfully" });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(StatusCodes.Status500InternalServerError,
                                  new { message = "Error deleting movie", error = ex.Message });
            }
        }
    }
}
