using LibraryWebAPI.Data;
using LibraryWebAPI.Models;
using LibraryWebAPI.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryWebAPI.Models.DTOs;

namespace LibraryWebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MovieController : ControllerBase
    {
        private readonly LibraryContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly IConfiguration _configuration;

        public MovieController(LibraryContext context, IWebHostEnvironment env, IConfiguration configuration)
        {
            _context = context;
            _env = env;
            _configuration = configuration;
        }

        // GET: api/Movie
        [HttpGet]
        public async Task<IActionResult> GetMovies()
        {
            var movies = await _context.Movies
                .Include(m => m.MovieDirector)
                .Include(m => m.Item)
                .Include(m => m.MovieGenre)
                .Select(m => new
                {
                    m.MovieId,
                    m.Upc,
                    m.YearReleased,
                    m.Format,
                    m.CoverImagePath,
                    ItemId = m.Item.ItemId,
                    Title = m.Item.Title,
                    Director = m.MovieDirector.FirstName + " " + m.MovieDirector.LastName,
                    DirectorFirstName = m.MovieDirector.FirstName,
                    DirectorLastName = m.MovieDirector.LastName,
                    Genre = m.MovieGenre.Description,
                    TotalCopies = m.Item.TotalCopies,
                    AvailableCopies = m.Item.AvailableCopies,
                    ItemLocation = m.Item.Location
                })
                .ToListAsync();

            return Ok(movies);
        }

        // GET: api/Movie/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMovie(int id)
        {
            var movie = await _context.Movies
                .Include(m => m.Item)
                .Include(m => m.MovieDirector)
                .Include(m => m.MovieGenre)
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
                return BadRequest(ModelState);

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var item = new Item
                {
                    Title = model.Title,
                    TotalCopies = model.TotalCopies,
                    AvailableCopies = model.AvailableCopies,
                    Location = model.Location,
                    ItemTypeID = model.ItemTypeID
                };

                _context.Items.Add(item);
                await _context.SaveChangesAsync();

                var movie = new Movie
                {
                    Upc = model.UPC,
                    MovieDirectorId = model.MovieDirectorID,
                    MovieGenreId = model.MovieGenreID,
                    YearReleased = model.YearReleased,
                    Format = model.Format,
                    CoverImagePath = model.CoverImagePath,
                    ItemId = item.ItemId
                };

                _context.Movies.Add(movie);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                return Ok(new { message = "Movie added successfully", itemId = item.ItemId });
            }
            catch (DbUpdateException dbEx)
            {
                await transaction.RollbackAsync();

                if (dbEx.InnerException is Microsoft.Data.SqlClient.SqlException sqlEx && sqlEx.Number == 2627)
                {
                    return Conflict(new
                    {
                        message = "A movie with this UPC already exists. Please use a unique UPC.",
                        error = sqlEx.Message
                    });
                }

                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    message = "Error while adding movie",
                    error = dbEx.Message
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    message = "Error while adding movie",
                    error = ex.Message
                });
            }
        }

        // PUT: api/Movie/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMovie(int id, [FromBody] MovieDTO model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var movie = await _context.Movies.FindAsync(id);
            if (movie == null)
                return NotFound();

            movie.Upc = model.UPC;
            movie.MovieDirectorId = model.MovieDirectorID;
            movie.MovieGenreId = model.MovieGenreID;
            movie.YearReleased = model.YearReleased;
            movie.Format = model.Format;
            movie.CoverImagePath = model.CoverImagePath;

            var item = await _context.Items.FindAsync(movie.ItemId);
            if (item != null)
            {
                item.Title = model.Title;
                item.TotalCopies = model.TotalCopies;
                item.AvailableCopies = model.AvailableCopies;
                item.Location = model.Location;
            }


            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Movie updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    message = "Error updating movie",
                    error = ex.Message
                });
            }
        }

        // DELETE: api/Movie/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMovie(int id)
        {
            var movie = await _context.Movies.FindAsync(id);
            if (movie == null)
                return NotFound();

            var item = await _context.Items.FindAsync(movie.ItemId);

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                _context.Movies.Remove(movie);
                if (item != null)
                    _context.Items.Remove(item);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { message = "Movie and associated item deleted successfully" });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    message = "Error deleting movie",
                    error = ex.Message
                });
            }
        }

        // POST: api/Movie/upload-cover
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
    }
}
