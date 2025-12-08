namespace DesertHopper.Backend.Models
{
    public class GameSave
    {
        public int Id { get; set; }

        public int Coins { get; set; }

        public int ObstaclesPassed { get; set; }

        public DateTime SavedAt { get; set; } = DateTime.UtcNow;

        // FK
        public int UserId { get; set; }
        public User? User { get; set; }
    }
}
