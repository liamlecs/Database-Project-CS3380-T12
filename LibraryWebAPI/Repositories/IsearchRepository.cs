using System.Collections.Generic;
using System.Threading.Tasks;

public interface ISearchRepository
{
    Task<IEnumerable<SearchResultDTO>> SearchAsync(string query);
}
