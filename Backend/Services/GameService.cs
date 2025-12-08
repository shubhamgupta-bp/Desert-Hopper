using DesertHopper.Backend.Data;
using DesertHopper.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace DesertHopper.Backend.Services
{
    public class GameService : IGameService
    {
        private readonly AppDbContext _db;

        public GameService(AppDbContext db)
        {
            _db = db;
        }

        public GameSave? GetUserSave(int userId)
        {
            return _db.GameSaves
                      .AsNoTracking()
                      .FirstOrDefault(s => s.UserId == userId);
        }

        public GameSave SaveOrUpdate(int userId, int coins, int obstaclesPassed)
        {
            var existing = _db.GameSaves.FirstOrDefault(s => s.UserId == userId);

            if (existing == null)
            {
                var save = new GameSave
                {
                    UserId = userId,
                    Coins = coins,
                    ObstaclesPassed = obstaclesPassed,
                    SavedAt = DateTime.UtcNow
                };

                _db.GameSaves.Add(save);
                _db.SaveChanges();
                return save;
            }
            else
            {
                existing.Coins = coins;
                existing.ObstaclesPassed = obstaclesPassed;
                existing.SavedAt = DateTime.UtcNow;
                _db.SaveChanges();
                return existing;
            }
        }

        public bool DeleteUserSave(int userId)
        {
            var existing = _db.GameSaves.FirstOrDefault(s => s.UserId == userId);
            if (existing == null) return false;

            _db.GameSaves.Remove(existing);
            _db.SaveChanges();
            return true;
        }
    }
}
