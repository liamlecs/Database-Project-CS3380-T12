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
    public class MovieGenreController : ControllerBase
    {
        private readonly LibraryContext _context;

        public MovieGenreController(LibraryContext context)
        {
            _context = context;
        }

        // GET: api/MovieGenre
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MovieGenre>>> GetMovieGenres()
        {
            var movieGenres = await _context.MovieGenres.ToListAsync();
            return Ok(movieGenres);
        }

        // GET: api/MovieGenre/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MovieGenre>> GetMovieGenre(int id)
        {
            var movieGenre = await _context.MovieGenres.FindAsync(id);

            if (movieGenre == null)
            {
                return NotFound();
            }

            return Ok(movieGenre);
        }

        // POST: api/MovieGenre
        [HttpPost]
        public async Task<ActionResult<MovieGenre>> PostMovieGenre(MovieGenre movieGenre)
        {
            if (ModelState.IsValid)
            {
                _context.MovieGenres.Add(movieGenre);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetMovieGenre), new { id = movieGenre.MovieGenreId }, movieGenre);
            }

            return BadRequest(ModelState);
        }

        // PUT: api/MovieGenre/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMovieGenre(int id, MovieGenre movieGenre)
        {
            if (id != movieGenre.MovieGenreId)
            {
                return BadRequest();
            }

            _context.Entry(movieGenre).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MovieGenreExists(id))
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

        // DELETE: api/MovieGenre/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMovieGenre(int id)
        {
            var movieGenre = await _context.MovieGenres.FindAsync(id);
            if (movieGenre == null)
            {
                return NotFound();
            }

            _context.MovieGenres.Remove(movieGenre);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MovieGenreExists(int id)
        {
            return _context.MovieGenres.Any(e => e.MovieGenreId == id);
        }
    }
}
