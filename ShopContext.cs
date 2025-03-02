using Microsoft.EntityFrameworkCore;

namespace MinimalApi
{
    public class ShopContext : DbContext
    {
        public ShopContext(DbContextOptions opts) : base(opts)
        {

        }

        public DbSet<Product> Product { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Product>().HasData(
                new Product { Id = 1, Name = "Shoe", Price = 24 },
                new Product { Id = 2, Name = "Jacket", Price = 10 }
                );
        }
    }
}
