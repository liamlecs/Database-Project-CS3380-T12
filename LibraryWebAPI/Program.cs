using LibraryWebAPI.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();

// Configure DbContext with SQL Server connection string
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger(); // Enable the Swagger middleware
    app.UseSwaggerUI(); // Enable the Swagger UI for interactive documentation
}

app.UseHttpsRedirection();

app.MapGet("/books", async (AppDbContext db) =>
{
    var books = await db.Books.ToListAsync();
    return books;
});

app.Run();
