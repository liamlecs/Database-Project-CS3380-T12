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
    public class BorrowerTypeController : ControllerBase
    {
        private readonly LibraryContext _context;

        public BorrowerTypeController(LibraryContext context)
        {
            _context = context;
        }

        // GET: api/BorrowerType
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BorrowerType>>> GetBorrowerTypes()
        {
            return await _context.BorrowerTypes.ToListAsync();
        }

        // GET: api/BorrowerType/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BorrowerType>> GetBorrowerType(int id)
        {
            var borrowerType = await _context.BorrowerTypes.FindAsync(id);

            if (borrowerType == null)
            {
                return NotFound();
            }

            return borrowerType;
        }

        // POST: api/BorrowerType
        [HttpPost]
        public async Task<ActionResult<BorrowerType>> PostBorrowerType(BorrowerType borrowerType)
        {
            if (ModelState.IsValid)
            {
                _context.BorrowerTypes.Add(borrowerType);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetBorrowerType", new { id = borrowerType.BorrowerTypeId }, borrowerType);
            }
            return BadRequest();
        }

        // PUT: api/BorrowerType/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBorrowerType(int id, BorrowerType borrowerType)
        {
            if (id != borrowerType.BorrowerTypeId)
            {
                return BadRequest();
            }

            try
            {
                _context.Entry(borrowerType).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BorrowerTypeExists(id))
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

        // DELETE: api/BorrowerType/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBorrowerType(int id)
        {
            var borrowerType = await _context.BorrowerTypes.FindAsync(id);
            if (borrowerType == null)
            {
                return NotFound();
            }

            _context.BorrowerTypes.Remove(borrowerType);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BorrowerTypeExists(int id)
        {
            return _context.BorrowerTypes.Any(e => e.BorrowerTypeId == id);
        }
    }
}
