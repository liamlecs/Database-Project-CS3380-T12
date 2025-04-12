using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryWebAPI.Data;
using LibraryWebAPI.Models;
using LibraryWebAPI.Services; // <-- Important for IEmailService
using System;
using System.Threading.Tasks;

namespace LibraryWebAPI.Controllers{
[Route("api/[controller]")]
[ApiController]
public class MovieDirectorController : ControllerBase
{
    private readonly LibraryContext _context;

    public MovieDirectorController(LibraryContext context)
    {
        _context = context;
    }

    // GET: api/MovieDirector
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MovieDirector>>> GetMovieDirectors()
    {
        return await _context.MovieDirector.ToListAsync();
    }

    // GET: api/MovieDirector/5
    [HttpGet("{id}")]
    public async Task<ActionResult<MovieDirector>> GetMovieDirector(int id)
    {
        var director = await _context.MovieDirector.FindAsync(id);
        if (director == null)
        {
            return NotFound();
        }
        return director;
    }

    // POST: api/MovieDirector
    [HttpPost]
    public async Task<ActionResult<MovieDirector>> PostMovieDirector(MovieDirector director)
    {
        _context.MovieDirector.Add(director);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetMovieDirector), new { id = director.MovieDirectorId }, director);
    }

    // PUT: api/MovieDirector/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutMovieDirector(int id, MovieDirector director)
    {
        if (id != director.MovieDirectorId) return BadRequest();
        _context.Entry(director).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/MovieDirector/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMovieDirector(int id)
    {
        var director = await _context.MovieDirector.FindAsync(id);
        if (director == null) return NotFound();
        _context.MovieDirector.Remove(director);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
}