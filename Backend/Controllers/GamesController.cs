using DesertHopper.Backend.Models;
using DesertHopper.Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DesertHopper.Backend.Controllers
{
    [ApiController]
    [Route("api/games")]
    [Authorize]
    public class GamesController : ControllerBase
    {
        private readonly IGameService _service;

        public GamesController(IGameService service)
        {
            _service = service;
        }

        private int GetUserId()
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(idClaim))
                throw new InvalidOperationException("User ID not found in token");
            return int.Parse(idClaim);
        }

        // GET /api/games/latest  -> used for auto-load
        [HttpGet("latest")]
        public IActionResult Latest()
        {
            int userId = GetUserId();
            var save = _service.GetUserSave(userId);
            if (save == null)
                return NotFound(new { message = "No saved game found." });

            return Ok(save);
        }

        // POST /api/games/save -> save or update single user save
        public class SaveRequest
        {
            public int Coins { get; set; }
            public int ObstaclesPassed { get; set; }
        }

        [HttpPost("save")]
        public IActionResult Save([FromBody] SaveRequest request)
        {
            int userId = GetUserId();
            var result = _service.SaveOrUpdate(userId, request.Coins, request.ObstaclesPassed);
            return Ok(result);
        }
    }
}
