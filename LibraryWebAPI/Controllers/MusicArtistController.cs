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
public class MusicArtistController : ControllerBase
{
    private readonly LibraryContext _context;

    public MusicArtistController(LibraryContext context)
    {
        _context = context;
    }

    // GET: api/MusicArtist
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MusicArtist>>> GetMusicArtists()
    {
        return await _context.MusicArtists.ToListAsync();
    }

    // GET: api/MusicArtist/5
    [HttpGet("{id}")]
    public async Task<ActionResult<MusicArtist>> GetMusicArtist(int id)
    {
        var artist = await _context.MusicArtists.FindAsync(id);
        if (artist == null)
        {
            return NotFound();
        }
        return artist;
    }

    // POST: api/MusicArtist
    [HttpPost]
    public async Task<ActionResult<MusicArtist>> PostMusicArtist(MusicArtist artist)
    {
        _context.MusicArtists.Add(artist);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetMusicArtist), new { id = artist.MusicArtistId }, artist);
    }

    // PUT: api/MusicArtist/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutMusicArtist(int id, MusicArtist artist)
    {
        if (id != artist.MusicArtistId) return BadRequest();
        _context.Entry(artist).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/MusicArtist/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMusicArtist(int id)
    {
        var artist = await _context.MusicArtists.FindAsync(id);
        if (artist == null) return NotFound();
        _context.MusicArtists.Remove(artist);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
}