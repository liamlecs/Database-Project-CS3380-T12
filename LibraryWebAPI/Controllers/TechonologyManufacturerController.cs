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
public class TechnologyManufacturerController : ControllerBase
{
    private readonly LibraryContext _context;

    public TechnologyManufacturerController(LibraryContext context)
    {
        _context = context;
    }

    // GET: api/TechnologyManufacturer
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TechnologyManufacturer>>> GetTechnologyManufacturers()
    {
        return await _context.TechnologyManufacturers.ToListAsync();
    }

    // GET: api/TechnologyManufacturer/5
    [HttpGet("{id}")]
    public async Task<ActionResult<TechnologyManufacturer>> GetTechnologyManufacturer(int id)
    {
        var manufacturer = await _context.TechnologyManufacturers.FindAsync(id);
        if (manufacturer == null) return NotFound();
        return manufacturer;
    }

    // POST: api/TechnologyManufacturer
    [HttpPost]
    public async Task<ActionResult<TechnologyManufacturer>> PostTechnologyManufacturer(TechnologyManufacturer manufacturer)
    {
        _context.TechnologyManufacturers.Add(manufacturer);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetTechnologyManufacturer), new { id = manufacturer.ManufacturerID }, manufacturer);
    }

    // PUT: api/TechnologyManufacturer/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutTechnologyManufacturer(int id, TechnologyManufacturer manufacturer)
    {
        if (id != manufacturer.ManufacturerID) return BadRequest();
        _context.Entry(manufacturer).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/TechnologyManufacturer/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTechnologyManufacturer(int id)
    {
        var manufacturer = await _context.TechnologyManufacturers.FindAsync(id);
        if (manufacturer == null) return NotFound();
        _context.TechnologyManufacturers.Remove(manufacturer);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
}