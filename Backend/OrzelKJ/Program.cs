using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using OrzelKJ.Data;
using OrzelKJ.Models;
using OrzelKJ.Services;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var jwtKey = builder.Configuration["Jwt:Key"] ?? "kqKp93SJMAyjRSwQZzEVjeFJquDjzbZp";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "OrzelKJ_Backend";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "OrzelKJ_App";
if (string.IsNullOrEmpty(jwtKey))
{
    throw new Exception("BŁĄD: Brakuje klucza 'Jwt:Key' w appsettings.json!");
}
var key = Encoding.ASCII.GetBytes(jwtKey);

builder.Services.AddAuthentication(options => {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddCors(options => options.AddPolicy("AllowVite",
    p => p.WithOrigins("http://localhost:5173").AllowAnyMethod().AllowAnyHeader()));

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddControllers()
    .AddJsonOptions(options => {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();

    if (!db.Users.Any(u => u.Username == "orzel"))
        db.Users.Add(new User
        {
            Username = "orzel",
            Password = BCrypt.Net.BCrypt.HashPassword("spierdalaj"),
            Email = "admin@orzel.pl",
            Role = UserRole.Administrator
        });

    if (!db.Users.Any(u => u.Username == "kj"))
        db.Users.Add(new User
        {
            Username = "kj",
            Password = BCrypt.Net.BCrypt.HashPassword("123"),
            Email = "kj@orzel.pl",
            Role = UserRole.Kontroler
        });

    db.SaveChanges();
}

app.UseRouting();
app.UseCors("AllowVite");
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger(options => { options.RouteTemplate = "openapi/{documentName}.json"; });
    app.MapScalarApiReference(options => { 
        options.OpenApiRoutePattern = "/openapi/v1.json"; 
        options.Title = "Orzeł KJ API";
    });
}

app.MapControllers();
app.Run();