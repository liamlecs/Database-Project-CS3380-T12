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
    public class TechnologyController : ControllerBase
    {
        private readonly LibraryContext _context;

        public TechnologyController(LibraryContext context)
        {
            _context = context;
        }

        // GET: api/Technology
        [HttpGet]
        
        public async Task<ActionResult<IEnumerable<TechnologyDto>>> GetTechnologies()
        {
            var technologies = await _context.Technologies
                .Include(t => t.DeviceType)
                .Include(t => t.Manufacturer)
                .Include(t => t.Item)
                .Select(t => new TechnologyDto
                {
                    DeviceId = t.DeviceId,
                    DeviceTypeID = t.DeviceType!.DeviceTypeID,
                    DeviceTypeName = t.DeviceType!.TypeName,
                    ManufacturerID = t.Manufacturer!.ManufacturerID,
                    TotalCopies = t.Item!.TotalCopies,
                    ManufacturerName = t.Manufacturer!.Name,
                    Title = t.Item!.Title,
                    ModelNumber = t.ModelNumber,
                    CoverImagePath = t.CoverImagePath!,
                    ItemId = t.ItemID,
                    availableCopies = t.Item.AvailableCopies,
                    Location = t.Item.Location!,
                })
                .ToListAsync();

            return Ok(technologies);
        }

        // GET: api/Technology/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Technology>> GetTechnology(int id)
        {
            var technology = await _context.Technologies
                
                .FirstOrDefaultAsync(m => m.DeviceId == id);

            if (technology == null)
            {
                return NotFound();
            }

            return Ok(technology);
        }

        [HttpPost("add-technology")]
        public async Task<IActionResult> AddTechnology([FromBody] TechnologyDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Optional debug log
            Console.WriteLine($"Incoming Technology: {System.Text.Json.JsonSerializer.Serialize(dto)}");

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Create Item
                var item = new Item
                {
                    Title = dto.Title,
                    TotalCopies = dto.TotalCopies,
                    AvailableCopies = dto.availableCopies, // Or do = dto.TotalCopies if you want them always to match
                    Location = dto.Location,
                    ItemTypeID = dto.ItemTypeID // e.g. 4 for Technology
                };
                _context.Items.Add(item);
                await _context.SaveChangesAsync();

                // Create Technology
                var technology = new Technology
                {
                    DeviceTypeID = dto.DeviceTypeID,
                    ManufacturerID = dto.ManufacturerID,
                    ModelNumber = dto.ModelNumber,
                    CoverImagePath = dto.CoverImagePath,
                    ItemID = item.ItemId
                };
                _context.Technologies.Add(technology);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();
                return Ok(new { message = "Technology added successfully", itemId = item.ItemId });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"Error adding technology: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, 
                    new { message = "Error while adding technology", error = ex.Message });
            }
        }

        // POST: api/Technology
        [HttpPost]
        public async Task<ActionResult<Technology>> PostTechnology(Technology technology)
        {
            if (ModelState.IsValid)
            {
                _context.Add(technology);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetTechnology), new { id = technology.DeviceId }, technology);
            }

            return BadRequest(ModelState);
        }

        // PUT: api/Technology/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTechnology(int id, Technology technology)
        {
            if (id != technology.DeviceId)
            {
                return BadRequest();
            }

            _context.Entry(technology).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TechnologyExists(id))
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

        // PUT: api/Technology/edit-technology/{id}
[HttpPut("edit-technology/{id}")]
public async Task<IActionResult> EditTechnologyWithItem(int id, [FromBody] TechnologyDto model)
{
    // 1️⃣ Validate
    if (!ModelState.IsValid)
        return BadRequest(ModelState);

    // 2️⃣ Begin transaction
    await using var tx = await _context.Database.BeginTransactionAsync();
    try
    {
        // 3️⃣ Load tracked Technology + its Item
        var technology = await _context.Technologies
                                       .Include(t => t.Item)
                                       .FirstOrDefaultAsync(t => t.DeviceId == id);
        if (technology == null)
            return NotFound(new { message = "Technology not found" });

        // 4️⃣ Map TechnologyDto → Item
        if (technology.Item == null)
        {
            return BadRequest(new { message = "Associated Item not found for the Technology" });
        }
        
        technology.Item.Title           = model.Title!;
        technology.Item.TotalCopies     = model.TotalCopies;
        technology.Item.AvailableCopies = Math.Min(
            model.TotalCopies,
            model.availableCopies // Use the DTO’s value here
        );
        technology.Item.Location        = model.Location;

        // 5️⃣ Persist Item changes
        await _context.SaveChangesAsync();

        // 6️⃣ Map TechnologyDto → Technology
        technology.DeviceTypeID     = model.DeviceTypeID;
        technology.ManufacturerID            = model.ManufacturerID;
        technology.CoverImagePath = model.CoverImagePath;
        technology.ModelNumber    = model.ModelNumber;

        // 7️⃣ Persist Technology changes
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
            message = "Error updating technology",
            error   = ex.Message
        });
    }
}

        // DELETE: api/Technology/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTechnology(int id)
        {
            var technology = await _context.Technologies.FindAsync(id);
            if (technology == null)
            {
                return NotFound();
            }

            _context.Technologies.Remove(technology);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TechnologyExists(int id)
        {
            return _context.Technologies.Any(e => e.DeviceId == id);
        }
    }
}
