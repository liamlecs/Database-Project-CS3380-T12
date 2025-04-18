using System;
using LibraryWebAPI.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using LibraryWebAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.FileProviders;
using System.IO;


var builder = WebApplication.CreateBuilder(args);
if (builder.Environment.IsDevelopment())
{
    builder.Configuration.AddUserSecrets<Program>();
}

// ✅ Read allowed origins from appsettings.json
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>();

// ✅ Register services
builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(allowedOrigins ?? Array.Empty<string>())
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddScoped<ISearchRepository, SearchRepository>();


// add JWT authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? throw new InvalidOperationException("Jwt:Issuer is not configured"),
        ValidAudience = builder.Configuration["Jwt:Audience"] ?? throw new InvalidOperationException("Jwt:Audience is not configured"),
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key is not configured"))
        )
    };
});

// Authorization with Employee role
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Employee", policy => 
        policy.RequireRole("Employee"));
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddTransient<IEmailService, EmailService>(); 

// Add global error handling (for .NET 6+)
builder.Services.AddControllers()
    .ConfigureApiBehaviorOptions(options =>
    {
        options.InvalidModelStateResponseFactory = context =>
        {
            return new BadRequestObjectResult(new
            {
                Message = "Validation failed",
                Errors = context.ModelState
                    .SelectMany(m => m.Value!.Errors)
                    .Select(e => e.ErrorMessage)
            });
        };
    });
builder.Services.AddHostedService<WaitlistNotificationService>(); //waitlist email system


builder.Services.AddDbContext<LibraryContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
    


var app = builder.Build();

// get the hosting environment
var env = app.Services.GetRequiredService<IWebHostEnvironment>();

// Define the folder for book covers
var bookCoversFolder = Path.Combine(env.ContentRootPath, "UploadedFiles", "BookCovers");

// Check if the folder exists; if not, create it.
if (!Directory.Exists(bookCoversFolder))
{
    Directory.CreateDirectory(bookCoversFolder);
}

// Serve static files from the designated folder
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(bookCoversFolder),
    RequestPath = "/uploads/book_covers"
});



// set book data
// SeedBooks.Initialize(app.Services, env);

// ✅ Use middleware

app.UseSwagger();
app.UseSwaggerUI();

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
