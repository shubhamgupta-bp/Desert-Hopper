namespace DesertHopper.Backend.Models
{
    public class GameSave
    {
        public string Id { get; set; } = System.Guid.NewGuid().ToString();
        public string Name { get; set; } = string.Empty;
        public int Coins { get; set; }
        public int ObstaclesPassed { get; set; }
        public System.DateTimeOffset SavedAt { get; set; } = System.DateTimeOffset.UtcNow;
    }
}
