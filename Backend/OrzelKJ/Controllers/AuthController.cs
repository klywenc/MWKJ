using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using OrzelKJ.Data;
using OrzelKJ.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;

namespace OrzelKJ.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _cfg;

    public AuthController(AppDbContext db, IConfiguration cfg)
    {
        _db = db;
        _cfg = cfg;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == req.Username);
        if (user == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.Password))
        {
            return Unauthorized("Błędny login lub hasło");
        }

        var jwtKey = _cfg["Jwt:Key"] ?? "kqKp93SJMAyjRSwQZzEVjeFJquDjzbZp";
        var jwtIssuer = _cfg["Jwt:Issuer"] ?? "OrzelKJ_Backend";
        var jwtAudience = _cfg["Jwt:Audience"] ?? "OrzelKJ_App";

        var key = Encoding.ASCII.GetBytes(jwtKey);
        var tokenHandler = new JwtSecurityTokenHandler();
        
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
                new Claim("UserId", user.Id.ToString())
            }),
            Expires = DateTime.UtcNow.AddDays(7),
            Issuer = jwtIssuer,
            Audience = jwtAudience,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);

        return Ok(new {
            token = tokenHandler.WriteToken(token),
            username = user.Username,
            role = user.Role,
            mustChangePassword = user.MustChangePassword 
        });
    }

    [HttpGet("verify-token/{token}")]
    public async Task<IActionResult> Verify(string token)
    {
        var inv = await _db.Invitations.FirstOrDefaultAsync(i => i.Token == token && !i.IsUsed);
        if (inv == null) return BadRequest();
        return Ok(inv);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
    {
        var inv = await _db.Invitations.FirstOrDefaultAsync(i => i.Token == req.Token && !i.IsUsed);
        if (inv == null) return BadRequest();

        var user = new User
        {
            Username = req.Username,
            Password = BCrypt.Net.BCrypt.HashPassword(req.Password),
            Email = inv.Email,
            Role = inv.Role
        };

        _db.Users.Add(user);
        inv.IsUsed = true;
        await _db.SaveChangesAsync();
        return Ok();
    }
    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest req)
    {
        var userId = int.Parse(User.FindFirst("UserId")?.Value!);
        var user = await _db.Users.FindAsync(userId);

        if (user == null) return NotFound();

        user.Password = BCrypt.Net.BCrypt.HashPassword(req.NewPassword);
        user.MustChangePassword = false; 
    
        await _db.SaveChangesAsync();
        return Ok();
    }

    public record ChangePasswordRequest(string NewPassword);
}