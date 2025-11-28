using DesertHopper.Backend.Models;
using System.Collections.Concurrent;

namespace DesertHopper.Backend.Data
{
    public class InMemoryGameStore
    {
        // Store saves by NAME (lowercased)
        private readonly ConcurrentDictionary<string, GameSave> _saves = new();

        // Return all saves ordered by newest
        public IEnumerable<GameSave> ListAll()
        {
            return _saves.Values.OrderByDescending(s => s.SavedAt);
        }

        // Get a save by name
        public GameSave? GetByName(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return null;

            _saves.TryGetValue(name.ToLower(), out var save);
            return save;
        }

        // Create OR update save
        public GameSave Save(GameSave save)
        {
            if (string.IsNullOrWhiteSpace(save.Name))
                throw new ArgumentException("Save must have a name.");

            save.SavedAt = DateTimeOffset.UtcNow;
            _saves[save.Name.ToLower()] = save;

            return save;
        }

        // Delete a save
        public bool Delete(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return false;

            return _saves.TryRemove(name.ToLower(), out _);
        }
    }
}
