using DesertHopper.Backend.Models;
using DesertHopper.Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace DesertHopper.Backend.Controllers
{
    [ApiController]
    [Route("api/games")]
    public class GamesController : ControllerBase
    {
        private readonly IGameService _service;

        public GamesController(IGameService service)
        {
            _service = service;
        }

        // GET /api/games
        [HttpGet]
        public IActionResult List()
        {
            var saves = _service.ListAll();
            return Ok(saves);
        }

        // GET /api/games/{name}
        [HttpGet("{name}")]
        public IActionResult Get(string name)
        {
            var save = _service.GetByName(name);
            if (save == null)
                return NotFound(new { message = "Save not found" });

            return Ok(save);
        }

        // POST /api/games/save
        // Used for: create OR update
        [HttpPost("save")]
        public IActionResult Save([FromBody] GameSave save)
        {
            if (string.IsNullOrWhiteSpace(save.Name))
                return BadRequest(new { message = "Name is required" });

            var updated = _service.Save(save);
            return Ok(updated);
        }

        // DELETE /api/games/{name}
        [HttpDelete("{name}")]
        public IActionResult Delete(string name)
        {
            bool deleted = _service.Delete(name);

            if (!deleted)
                return NotFound(new { message = "Save not found" });

            return NoContent();
        }
    }
}
