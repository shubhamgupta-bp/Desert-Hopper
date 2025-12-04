using DesertHopper.Backend.Models;

namespace DesertHopper.Backend.Services
{
    public interface IGameService
    {
        GameSave? GetUserSave(int userId);
        GameSave SaveOrUpdate(int userId, int coins, int obstaclesPassed);
        bool DeleteUserSave(int userId);
    }
}
