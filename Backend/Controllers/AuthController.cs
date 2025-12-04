using DesertHopper.Backend.Data;
using DesertHopper.Backend.Models;
using DesertHopper.Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace DesertHopper.Backend.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly ITokenService _tokenService;

        public AuthController(AppDbContext db, ITokenService tokenService)
        {
            _db = db;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Username) ||
                string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest("Username, email, and password are required.");
            }

            var usernameLower = request.Username.ToLower();
            var emailLower = request.Email.ToLower();

            if (await _db.Users.AnyAsync(u => u.Username.ToLower() == usernameLower))
                return BadRequest("Username already exists.");

            if (await _db.Users.AnyAsync(u => u.Email.ToLower() == emailLower))
                return BadRequest("Email already exists.");

            CreatePasswordHash(request.Password, out var hash, out var salt);

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = hash,
                PasswordSalt = salt,
                CreatedAt = DateTime.UtcNow
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            var token = _tokenService.CreateToken(user);

            return Ok(new AuthResponse
            {
                Token = token,
                Username = user.Username,
                Email = user.Email
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.UsernameOrEmail) ||
                string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest("Username/email and password are required.");
            }

            var identifier = request.UsernameOrEmail.ToLower();

            var user = await _db.Users
                .FirstOrDefaultAsync(u =>
                    u.Username.ToLower() == identifier ||
                    u.Email.ToLower() == identifier);

            if (user == null)
                return Unauthorized("Invalid credentials.");

            if (!VerifyPasswordHash(request.Password, user.PasswordHash, user.PasswordSalt))
                return Unauthorized("Invalid credentials.");

            var token = _tokenService.CreateToken(user);

            return Ok(new AuthResponse
            {
                Token = token,
                Username = user.Username,
                Email = user.Email
            });
        }

        // DELETE /api/auth/account  -> delete account + save
        [Authorize]
        [HttpDelete("account")]
        public async Task<IActionResult> DeleteAccount()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr))
                return Unauthorized();

            var userId = int.Parse(userIdStr);

            var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null) return NotFound("User not found.");

            _db.Users.Remove(user); // cascades to GameSave
            await _db.SaveChangesAsync();

            return NoContent();
        }

        private static void CreatePasswordHash(string password, out byte[] hash, out byte[] salt)
        {
            using var hmac = new HMACSHA512();
            salt = hmac.Key;
            hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        }

        private static bool VerifyPasswordHash(string password, byte[] hash, byte[] salt)
        {
            using var hmac = new HMACSHA512(salt);
            var computed = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            return computed.SequenceEqual(hash);
        }
    }
}
