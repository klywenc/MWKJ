namespace OrzelKJ.Models;

public enum UserRole
{
    Administrator,
    Kontroler,
    Pracownik
}

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public UserRole Role { get; set; } // Administrator=0, Kontroler=1, Pracownik=2
    public bool MustChangePassword { get; set; } = false;
}

public class DetentionReason
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class StoppedPallet
{
    public int Id { get; set; }
    public string PalletNumber { get; set; } = string.Empty;
    
    public string OrderNumber { get; set; } = string.Empty; // IFS TYPE SHIT
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public int LocationId { get; set; }
    public string LocationName { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
    public string Operator { get; set; } = string.Empty;

    // IFS Type shit
    public string PositionNumber { get; set; } = string.Empty;
    public string PackageNumber { get; set; } = string.Empty;
    public string FinishedGoodNumber { get; set; } = string.Empty;

    public string Status { get; set; } = "ZATRZYMANA";
    public List<ChatMessage> Messages { get; set; } = new();
}

public class Location
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class ChatMessage
{
    public int Id { get; set; }
    public int PalletId { get; set; }
    public string SenderName { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
    public DateTime SentAt { get; set; } = DateTime.Now;
}

public class Invitation
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty; 
    public UserRole Role { get; set; }
    public bool IsUsed { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
}

public record LoginRequest(string Username, string Password);

public record RegisterRequest(string Username, string Password, string Token);

public record InviteRequest(string Email, UserRole Role);