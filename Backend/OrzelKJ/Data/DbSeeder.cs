using OrzelKJ.Data;
using OrzelKJ.Models;

public static class DbSeeder
{
    public static void Seed(AppDbContext db)
    {
        if (!db.Users.Any())
        {
            db.Users.AddRange(
                new User { Username = "admin", Role = UserRole.Administrator },
                new User { Username = "kj", Role = UserRole.Kontroler },
                new User { Username = "pracownik", Role = UserRole.Pracownik }
            );
            db.SaveChanges();
        }
    }
}