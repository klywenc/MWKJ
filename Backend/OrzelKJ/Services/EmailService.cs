using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace OrzelKJ.Services;

public interface IEmailService
{
    Task SendInvitationEmail(string email, string registrationLink);
}

public class EmailService : IEmailService
{
    public async Task SendInvitationEmail(string email, string registrationLink)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("System Orzeł KJ", "no-reply@demomailtrap.co"));
        message.To.Add(new MailboxAddress("", email));
        message.Subject = "Zaproszenie do systemu Orzeł KJ";

        message.Body = new TextPart("html")
        {
            Text = $@"
                <h1>Witaj!</h1>
                <p>Zostałeś zaproszony do systemu kontroli jakości Orzeł KJ.</p>
                <p>Aby dokończyć rejestrację i ustawić hasło, kliknij w poniższy link:</p>
                <a href='{registrationLink}' style='padding: 10px 20px; background-color: #005eb8; color: white; text-decoration: none; border-radius: 5px;'>Zarejestruj się</a>
                <p>Link wygaśnie po pierwszej rejestracji.</p>
                <p>Zespół Meble Wójcik</p>"
        };

        using var client = new SmtpClient();
        await client.ConnectAsync("live.smtp.mailtrap.io", 2525, SecureSocketOptions.StartTls);
        await client.AuthenticateAsync("api", "9b8fd7a83c141715553cf1dc2fcc9325");

        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }
}