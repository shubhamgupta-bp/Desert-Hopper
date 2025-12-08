using DesertHopper.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace DesertHopper.Backend.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<GameSave> GameSaves { get; set; } = null!;

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User unique indexes
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // 1 user -> 1 gamesave
            modelBuilder.Entity<GameSave>()
                .HasOne(gs => gs.User)
                .WithOne(u => u.GameSave)
                .HasForeignKey<GameSave>(gs => gs.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
