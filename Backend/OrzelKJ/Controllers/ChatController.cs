using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OrzelKJ.Data;
using OrzelKJ.Models;

namespace OrzelKJ.Controllers;

[ApiController]
[Route("api/chat")]
public class ChatController : ControllerBase
{
    private readonly AppDbContext _db;
    public ChatController(AppDbContext db) => _db = db;
    
    [HttpGet("{palletId}")]
    public async Task<IActionResult> GetMessages(int palletId)
    {
        var messages = await _db.ChatMessages
            .Where(m => m.PalletId == palletId)
            .OrderBy(m => m.SentAt)
            .ToListAsync();
            
        return Ok(messages);
    }
    
    [HttpPost("{palletId}")]
    public async Task<IActionResult> SendMessage(int palletId, [FromBody] ChatMessage msg)
    {
        var palletExists = await _db.StoppedPallets.AnyAsync(p => p.Id == palletId);
        if (!palletExists) return NotFound("Nie znaleziono palety o podanym ID.");

        msg.PalletId = palletId;
        msg.SentAt = DateTime.Now;

        _db.ChatMessages.Add(msg);
        await _db.SaveChangesAsync();
        
        return Ok(msg);
    }
}