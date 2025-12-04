namespace DesertHopper.Backend.Models
{
    public class RegisterRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Email    { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginRequest
    {
        public string UsernameOrEmail { get; set; } = string.Empty;
        public string Password        { get; set; } = string.Empty;
    }

    public class AuthResponse
    {
        public string Token    { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Email    { get; set; } = string.Empty;
    }
}
