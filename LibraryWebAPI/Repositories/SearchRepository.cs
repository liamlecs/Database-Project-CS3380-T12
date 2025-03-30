using Dapper;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

public class SearchRepository : ISearchRepository
{
    private readonly IConfiguration _configuration;

    public SearchRepository(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task<IEnumerable<SearchResultDTO>> SearchAsync(string query)
    {
        using var connection = new Microsoft.Data.SqlClient.SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

        string sql = @"
            SELECT b.BookID AS Id, i.Title, 'Book' AS Category, a.Name AS AdditionalInfo, b.ReleaseDate
            FROM Books b
            JOIN Authors a ON b.AuthorID = a.AuthorID
            JOIN Items i ON b.ItemID = i.ItemID
            WHERE i.Title LIKE @Query OR a.Name LIKE @Query

            UNION

            SELECT m.MovieID AS Id, i.Title, 'Movie' AS Category, d.Name AS AdditionalInfo, m.ReleaseDate
            FROM Movies m
            JOIN Directors d ON m.DirectorID = d.DirectorID
            JOIN Items i ON m.ItemID = i.ItemID
            WHERE i.Title LIKE @Query OR d.Name LIKE @Query

            UNION

            SELECT mu.MusicID AS Id, i.Title, 'Music' AS Category, ar.Name AS AdditionalInfo, mu.ReleaseDate
            FROM Music mu
            JOIN Artists ar ON mu.ArtistID = ar.ArtistID
            JOIN Items i ON mu.ItemID = i.ItemID
            WHERE i.Title LIKE @Query OR ar.Name LIKE @Query

            UNION

            SELECT t.TechID AS Id, i.Title, 'Technology' AS Category, m.Manufacturer AS AdditionalInfo, t.ReleaseDate
            FROM Technology t
            JOIN Manufacturers m ON t.ManufacturerID = m.ManufacturerID
            JOIN Items i ON t.ItemID = i.ItemID
            WHERE i.Title LIKE @Query OR m.Manufacturer LIKE @Query
            
            UNION 
            
            SELECT i.ItemID AS Id, i.Title, 'Item' AS Category, NULL AS AdditionalInfo, i.ReleaseDate
            FROM Items i
            WHERE i.Title LIKE @Query";
        

        return await connection.QueryAsync<SearchResultDTO>(sql, new { Query = $"%{query}%" });
    }
}
