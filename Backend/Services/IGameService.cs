using DesertHopper.Backend.Models;
using System.Collections.Generic;

namespace DesertHopper.Backend.Services
{
    public interface IGameService
    {
        IEnumerable<GameSave> ListAll();
        GameSave? GetByName(string name);
        GameSave Save(GameSave save);
        bool Delete(string name);
    }
}
