using LibraryWebAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryWebAPI.Data
{
    public class LibraryContext  : DbContext
    {
        public LibraryContext(DbContextOptions<LibraryContext> options) : base(options) { }
        public DbSet<Book> Books { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Employee> Employees { get; set; }
    }
}