using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryWebAPI.Data;
using LibraryWebAPI.Models;

namespace LibraryWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MusicController : ControllerBase
    {
        private readonly LibraryContext _context;

        public MusicController(LibraryContext context)
        {
            _context = context;
        }

        // GET: api/Music
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MusicDto>>> GetMusic()
        {
            var musics = await _context.Musics
                .Include(m => m.MusicArtist)  // if needed for additional details
                .Include(m => m.MusicGenre)   // if needed for additional details
                .Include(m => m.Item)         // to get the item details such as Title, availableCopies, Location, TotalCopies
                .Select(m => new MusicDto
                {
                    SongId = m.SongId,
                    ItemId = m.ItemId,
                    // We set Title from the associated Item.
                    Title = m.Item.Title,
                    MusicArtistID = m.MusicArtistId,
                    // Return the actual artist name from the related entity:
                    ArtistName = m.MusicArtist.ArtistName,
                    MusicGenreID = m.MusicGenreId,
                    GenreDescription = m.MusicGenre.Description,
                    TotalCopies = m.Item.TotalCopies,
                    Format = m.Format,
                    CoverImagePath = m.CoverImagePath,
                    availableCopies = m.Item.AvailableCopies,
                    itemLocation = m.Item.Location,
                    ItemTypeID = m.Item.ItemTypeID  // Get this value from the related Item
                })
                .ToListAsync();

            return Ok(musics);
        }

        // GET: api/Music/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Music>> GetMusic(int id)
        {
            var music = await _context.Musics
                .FirstOrDefaultAsync(m => m.SongId == id);

            if (music == null)
            {
                return NotFound();
            }

            return Ok(music);
        }

        // POST: api/Music
        [HttpPost]
        public async Task<ActionResult<Music>> PostMusic(Music music)
        {
            if (ModelState.IsValid)
            {
                _context.Musics.Add(music);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetMusic), new { id = music.SongId }, music);
            }
            return BadRequest();
        }

        // PUT: api/Music/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMusic(int id, Music music)
        {
            if (id != music.SongId)
            {
                return BadRequest();
            }

            try
            {
                _context.Entry(music).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MusicExists(id))
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

        // DELETE: api/Music/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMusic(int id)
        {
            var music = await _context.Musics.FindAsync(id);
            if (music == null)
            {
                return NotFound();
            }

            _context.Musics.Remove(music);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MusicExists(int id)
        {
            return _context.Musics.Any(e => e.SongId == id);
        }

        // POST: api/Music/add-music
        [HttpPost("add-music")]
        public async Task<IActionResult> AddMusic([FromBody] MusicDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Log incoming data for debugging
            Console.WriteLine($"Incoming Music: {System.Text.Json.JsonSerializer.Serialize(model)}");

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // Step 1: Create Item
                var item = new Item
                {
                    Title = model.Title, // Use Title from model (which we are now using instead of SongTitle)
                    TotalCopies = model.TotalCopies,
                    AvailableCopies = model.availableCopies,
                    Location = model.itemLocation,
                    ItemTypeID = model.ItemTypeID
                };

                _context.Items.Add(item);
                await _context.SaveChangesAsync();

                // Step 2: Create Music
                var music = new Music
                {
                    MusicArtistId = model.MusicArtistID,   // directly assign the numeric ID
                    MusicGenreId = model.MusicGenreID,       // directly assign the numeric ID
                    Format = model.Format,
                    CoverImagePath = model.CoverImagePath,
                    ItemId = item.ItemId
                };

                _context.Musics.Add(music);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                return Ok(new { message = "Music added successfully", itemId = item.ItemId });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"Error adding music: {ex.Message}");
                if (ex.InnerException != null) Console.WriteLine($"Inner: {ex.InnerException.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { message = "Error while adding music", error = ex.Message });
            }
        }
    }
}
