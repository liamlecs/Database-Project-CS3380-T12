using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

public class BlobStorageService
{
    private readonly string _connectionString = default!;
    private readonly string _containerName = default!;

    public BlobStorageService(IConfiguration configuration)
    {
        _connectionString = configuration["AzureBlobStorage:ConnectionString"] 
                        ?? throw new ArgumentNullException("AzureBlobStorage:ConnectionString");
        _containerName = configuration["AzureBlobStorage:ContainerName"] 
                        ?? throw new ArgumentNullException("AzureBlobStorage:ContainerName");
    }


    public async Task<string> UploadFileAsync(IFormFile file)
    {
        if (file == null || file.Length == 0)
            throw new ArgumentException("File is empty", nameof(file));

        // Create a BlobServiceClient
        var blobServiceClient = new BlobServiceClient(_connectionString);
        var containerClient = blobServiceClient.GetBlobContainerClient(_containerName);

        // Ensure the container exists (in case it doesn't already)
        await containerClient.CreateIfNotExistsAsync(PublicAccessType.Blob);

        // Generate a unique name for the blob.
        string fileExtension = Path.GetExtension(file.FileName);
        string blobName = $"{Guid.NewGuid()}{fileExtension}";

        // Get a reference to the blob client.
        BlobClient blobClient = containerClient.GetBlobClient(blobName);

        // Upload the file stream to Blob Storage.
        using (var stream = file.OpenReadStream())
        {
            await blobClient.UploadAsync(stream, new BlobHttpHeaders { ContentType = file.ContentType });
        }

        // Return the publicly accessible URL.
        return blobClient.Uri.ToString();
    }
}
