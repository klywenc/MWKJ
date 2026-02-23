using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OrzelKJ.Data;
using OrzelKJ.Models;

namespace OrzelKJ.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PalletsController : ControllerBase
{
    private readonly AppDbContext _db;

    public PalletsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var pallets = await _db.StoppedPallets
            .Include(p => p.Messages)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        return Ok(pallets);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] StoppedPallet pallet)
    {
        _db.StoppedPallets.Add(pallet);
        await _db.SaveChangesAsync();
        return Ok(pallet);
    }

    [HttpPost("{id}/messages")]
    public async Task<IActionResult> AddMessage(int id, [FromBody] ChatMessage msg)
    {
        var pallet = await _db.StoppedPallets.FindAsync(id);
        if (pallet == null) return NotFound();

        msg.PalletId = id;
        msg.SentAt = DateTime.Now;

        _db.ChatMessages.Add(msg);
        await _db.SaveChangesAsync();

        return Ok(msg);
    }
}