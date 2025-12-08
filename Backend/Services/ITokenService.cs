using DesertHopper.Backend.Models;

namespace DesertHopper.Backend.Services
{
    public interface ITokenService
    {
        string CreateToken(User user);
    }
}
