using DesertHopper.Backend.Data;
using DesertHopper.Backend.Models;
using System.Collections.Generic;

namespace DesertHopper.Backend.Services
{
    public class GameService : IGameService
    {
        private readonly InMemoryGameStore _store = new();

        public IEnumerable<GameSave> ListAll()
        {
            return _store.ListAll();
        }

        public GameSave? GetByName(string name)
        {
            return _store.GetByName(name);
        }

        // Create OR update save
        public GameSave Save(GameSave save)
        {
            return _store.Save(save);
        }

        // Delete save
        public bool Delete(string name)
        {
            return _store.Delete(name);
        }
    }
}
