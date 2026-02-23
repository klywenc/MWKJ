using Microsoft.EntityFrameworkCore;
using OrzelKJ.Models;

namespace OrzelKJ.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<StoppedPallet> StoppedPallets => Set<StoppedPallet>();
    public DbSet<ChatMessage> ChatMessages => Set<ChatMessage>();
    
    public DbSet<DetentionReason> DetentionReasons => Set<DetentionReason>();

    public DbSet<Invitation> Invitations => Set<Invitation>();
    public DbSet<Location> Locations => Set<Location>();
}