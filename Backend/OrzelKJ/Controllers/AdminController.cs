using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OrzelKJ.Data;
using OrzelKJ.Models;
using OrzelKJ.Services;

namespace OrzelKJ.Controllers;

[ApiController]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _db;

    public AdminController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers() => 
        Ok(await _db.Users.OrderBy(u => u.Username).ToListAsync());

    [HttpPut("users/{id}")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] User updatedUser)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null) return NotFound();

        user.Username = updatedUser.Username;
        user.Email = updatedUser.Email;
        user.Role = updatedUser.Role;
    
        if (!string.IsNullOrEmpty(updatedUser.Password))
        {
            user.Password = BCrypt.Net.BCrypt.HashPassword(updatedUser.Password);
            user.MustChangePassword = true; 
        }

        await _db.SaveChangesAsync();
        return Ok(user);
    }

    [HttpDelete("users/{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null) return NotFound();
        
        _db.Users.Remove(user);
        await _db.SaveChangesAsync();
        return Ok();
    }
    [HttpGet("reasons")]
    public async Task<IActionResult> GetReasons() => Ok(await _db.DetentionReasons.ToListAsync());

    [HttpPost("reasons")]
    public async Task<IActionResult> AddReason([FromBody] DetentionReason reason) {
        _db.DetentionReasons.Add(reason);
        await _db.SaveChangesAsync();
        return Ok(reason);
    }

    [HttpDelete("reasons/{id}")]
    public async Task<IActionResult> DeleteReason(int id) {
        var r = await _db.DetentionReasons.FindAsync(id);
        if (r != null) { _db.DetentionReasons.Remove(r); await _db.SaveChangesAsync(); }
        return Ok();
    }

    [HttpPost("invite")]
    public async Task<IActionResult> Invite([FromBody] InviteRequest req, [FromServices] IEmailService emailService) 
    {
        var token = Guid.NewGuid().ToString();
        var invitation = new Invitation {
            Email = req.Email,
            Role = req.Role,
            Token = token,
            IsUsed = false
        };

        _db.Invitations.Add(invitation);
        await _db.SaveChangesAsync();   
        
        var link = $"http://localhost:5173/register?token={token}";

        try {
            await emailService.SendInvitationEmail(req.Email, link);
            return Ok(new { message = "E-mail wysłany pomyślnie" });
        } catch (Exception ex) {
            return StatusCode(500, $"Błąd wysyłki maila: {ex.Message}");
        }
    }

    [HttpGet("locations")]
    public async Task<IActionResult> GetLocations()
    {
        return Ok(await _db.Locations.ToListAsync());
    }
    
    [HttpPut("locations/{id}")]
    public async Task<IActionResult> UpdateLocation(int id, [FromBody] Location updated) {
        var loc = await _db.Locations.FindAsync(id);
        if (loc == null) return NotFound();
        loc.Name = updated.Name;
        await _db.SaveChangesAsync();
        return Ok(loc);
    }

    [HttpPut("reasons/{id}")]
    public async Task<IActionResult> UpdateReason(int id, [FromBody] DetentionReason updated) {
        var reason = await _db.DetentionReasons.FindAsync(id);
        if (reason == null) return NotFound();
        reason.Name = updated.Name;
        await _db.SaveChangesAsync();
        return Ok(reason);
    }

    [HttpPost("locations")]
    public async Task<IActionResult> AddLocation([FromBody] Location loc)
    {
        if (string.IsNullOrEmpty(loc.Name)) return BadRequest("Nazwa jest wymagana");
        _db.Locations.Add(loc);
        await _db.SaveChangesAsync();
        return Ok(loc);
    }

    [HttpDelete("locations/{id}")]
    public async Task<IActionResult> DeleteLocation(int id)
    {
        var loc = await _db.Locations.FindAsync(id);
        if (loc == null) return NotFound();

        _db.Locations.Remove(loc);
        await _db.SaveChangesAsync();
        return Ok();
    }
}