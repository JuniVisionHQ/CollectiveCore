using CollectiveCore.Models;
using Microsoft.EntityFrameworkCore;

namespace CollectiveCore.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<UserBook> UserBooks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Composite Key
            modelBuilder.Entity<UserBook>().HasKey(ub => new { ub.UserId, ub.BookId });

            // Relationships
            modelBuilder.Entity<UserBook>()
                .HasOne(ub => ub.User)
                .WithMany(u => u.UserBooks)
                .HasForeignKey(ub => ub.UserId);

            modelBuilder.Entity<UserBook>()
                .HasOne(ub => ub.Book)
                .WithMany(b => b.UserBooks)
                .HasForeignKey(ub => ub.BookId);

            // Seed Users
            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, UserName = "jenny", Email = "jenny@example.com", },
                new User { Id = 2, UserName = "jim", Email = "jim@example.com", }
            );

            // Seed Books
            modelBuilder.Entity<Book>().HasData(
                new Book { Id = 1, Title = "The Hobbit", Author = "J.R.R. Tolkien" },
                new Book { Id = 2, Title = "Dune", Author = "Frank Herbert" }
            );

            // Seed UserBooks (many-to-many)
            modelBuilder.Entity<UserBook>().HasData(
                new UserBook { UserId = 1, BookId = 1, IsFavorite = false, HasRead = false },
                new UserBook { UserId = 2, BookId = 2, IsFavorite = false, HasRead = false }
            );            
        }
    }
}
