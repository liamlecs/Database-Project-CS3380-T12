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
public class DeviceTypeController : ControllerBase
{
    private readonly LibraryContext _context;

    public DeviceTypeController(LibraryContext context)
    {
        _context = context;
    }

    // GET: api/DeviceType
    [HttpGet]
    public async Task<ActionResult<IEnumerable<DeviceType>>> GetDeviceTypes()
    {
        return await _context.DeviceTypes.ToListAsync();
    }

    // GET: api/DeviceType/5
    [HttpGet("{id}")]
    public async Task<ActionResult<DeviceType>> GetDeviceType(int id)
    {
        var deviceType = await _context.DeviceTypes.FindAsync(id);
        if (deviceType == null) return NotFound();
        return deviceType;
    }

    // POST: api/DeviceType
    [HttpPost]
    public async Task<ActionResult<DeviceType>> PostDeviceType(DeviceType deviceType)
    {
        _context.DeviceTypes.Add(deviceType);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetDeviceType), new { id = deviceType.DeviceTypeID }, deviceType);
    }

    // PUT: api/DeviceType/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutDeviceType(int id, DeviceType deviceType)
    {
        if (id != deviceType.DeviceTypeID) return BadRequest();
        _context.Entry(deviceType).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/DeviceType/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDeviceType(int id)
    {
        var deviceType = await _context.DeviceTypes.FindAsync(id);
        if (deviceType == null) return NotFound();
        _context.DeviceTypes.Remove(deviceType);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
}