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
    public class MovieController : ControllerBase
    {
        private readonly LibraryContext _context;

        public MovieController(LibraryContext context)
        {
            _context = context;
        }

        // // GET: api/Movie
        // [HttpGet]
        // public async Task<ActionResult<IEnumerable<Movie>>> GetMovies()
        // {
        //     // No .Include statements, fetching only Movie data
        //     var movies = await _context.Movies.ToListAsync();

        //     return Ok(movies);
        // }

        [HttpGet]
    public async Task<ActionResult<IEnumerable<MovieDTO>>> GetMovies()
    {
        var movies = await _context.Movies
            .Include(m => m.MovieDirector)
            .Include(m => m.MovieGenre)
            .Include(m => m.Item) // Include the Item table to get available copies
            .Select(m => new MovieDTO
            {
                MovieId = m.MovieId,
                Title = m.Item.Title, // fk to referenced Item table
                UPC = m.Upc ?? "N/A",
                Format = m.Format ?? "N/A",
                YearReleased = m.YearReleased,
                Director = m.MovieDirector.FirstName + " " + m.MovieDirector.LastName,
                Genre = m.MovieGenre.Description,
                CoverImagePath = m.CoverImagePath!,
                ItemId = m.ItemId,
                availableCopies = m.Item.AvailableCopies, // fk to referenced Item table
                itemLocation = m.Item.Location! // fk to referenced Item table

            })
            .ToListAsync();

        return Ok(movies);
    }

        // GET: api/Movie/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Movie>> GetMovie(int id)
        {
            var movie = await _context.Movies
                .FirstOrDefaultAsync(m => m.MovieId == id); // No .Include statements

            if (movie == null)
            {
                return NotFound();
            }

            return Ok(movie);
        }

        // POST: api/Movie
        [HttpPost]
        public async Task<ActionResult<Movie>> PostMovie(Movie movie)
        {
            if (ModelState.IsValid)
            {
                _context.Movies.Add(movie);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetMovie), new { id = movie.MovieId }, movie);
            }

            return BadRequest(ModelState);
        }

        // PUT: api/Movie/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMovie(int id, Movie movie)
        {
            if (id != movie.MovieId)
            {
                return BadRequest();
            }

            _context.Entry(movie).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MovieExists(id))
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

        // DELETE: api/Movie/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMovie(int id)
        {
            var movie = await _context.Movies.FindAsync(id);
            if (movie == null)
            {
                return NotFound();
            }

            _context.Movies.Remove(movie);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MovieExists(int id)
        {
            return _context.Movies.Any(e => e.MovieId == id);
        }
    }
}
