using LibraryWebAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryWebAPI.Data
{
    public partial class LibraryContext  : DbContext
    {
        public LibraryContext(DbContextOptions<LibraryContext> options) : base(options) { }

public virtual DbSet<Book> Books { get; set; }

    public virtual DbSet<BookAuthor> BookAuthors { get; set; }

    public virtual DbSet<BookGenre> BookGenres { get; set; }

    public virtual DbSet<BorrowerType> BorrowerTypes { get; set; }

    public virtual DbSet<Customer> Customers { get; set; }

    public DbSet<CustomerReportDto> CustomerReports { get; set; }

    public virtual DbSet<Donation> Donations { get; set; }

    public virtual DbSet<Employee> Employees { get; set; }

    public virtual DbSet<Event> Events { get; set; }

    public virtual DbSet<EventCategory> EventCategories { get; set; }

    public virtual DbSet<Fine> Fines { get; set; }

    public virtual DbSet<Item> Items { get; set; }

    public virtual DbSet<Movie> Movies { get; set; }

    public virtual DbSet<MovieGenre> MovieGenres { get; set; }

    public virtual DbSet<Music> Musics { get; set; }

    public virtual DbSet<MusicArtist> MusicArtists { get; set; }


    public virtual DbSet<MusicGenre> MusicGenres { get; set; }

    public virtual DbSet<Publisher> Publishers { get; set; }

    public virtual DbSet<Sex> Sexes { get; set; }

    public virtual DbSet<Technology> Technologies { get; set; }

    public virtual DbSet<TechnologyManufacturer> TechnologyManufacturers { get; set; }
    public virtual DbSet<DeviceType> DeviceTypes { get; set; }

    public virtual DbSet<TransactionHistory> TransactionHistories { get; set; }

    public virtual DbSet<TransactionPopularityDto> TransactionPopularity { get; set; }
    public virtual DbSet<TransactionPopularityDto> TransactionPopularityConditional { get; set; }

    public virtual DbSet<MasterTransactionReportDto> MasterTransaction { get; set; }

        public virtual DbSet<MasterTransactionReportDto> MasterTransactionConditional { get; set; }
    public virtual DbSet<TransactionFineDto> TransactionFine { get; set; }

    public virtual DbSet<TransactionHistoryDto> TransactionHistory {get; set;}

    public virtual DbSet<TransactionFineDto> TransactionFineConditional { get; set; }
    public virtual DbSet<Waitlist> Waitlists { get; set; }

    // registering MovieDirector entity 
    public virtual DbSet<MovieDirector> MovieDirector { get; set; }

//     protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
// #warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
//         => optionsBuilder.UseSqlServer("");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Book>(entity =>
        {
            entity.HasKey(e => e.BookId).HasName("PK__Book__3DE0C227DE49FC03");

            entity.ToTable("Book");

            entity.HasIndex(e => e.Isbn, "UQ__Book__447D36EA19E8B3BA").IsUnique();

            entity.Property(e => e.BookId)
                .ValueGeneratedNever()
                .HasColumnName("BookID");
            entity.Property(e => e.BookAuthorId).HasColumnName("BookAuthorID");
            entity.Property(e => e.BookGenreId).HasColumnName("BookGenreID");
            entity.Property(e => e.Isbn)
                .HasMaxLength(13)
                .IsUnicode(false)
                .HasColumnName("ISBN");
            entity.Property(e => e.PublisherId).HasColumnName("PublisherID");

            entity.HasOne(d => d.BookAuthor).WithMany(p => p.Books)
                .HasForeignKey(d => d.BookAuthorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Book_BookAuthor");

            entity.HasOne(d => d.BookGenre).WithMany(p => p.Books)
                .HasForeignKey(d => d.BookGenreId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Book_BookGenre");

            entity.HasOne(d => d.Publisher).WithMany(p => p.Books)
                .HasForeignKey(d => d.PublisherId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Book_Publisher");
        });

        modelBuilder.Entity<BookAuthor>(entity =>
        {
            entity.HasKey(e => e.BookAuthorId).HasName("PK__BookAuth__21B24F39E3390529");

            entity.ToTable("BookAuthor");

            entity.Property(e => e.BookAuthorId).HasColumnName("BookAuthorID");
            entity.Property(e => e.FirstName)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.LastName)
                .HasMaxLength(30)
                .IsUnicode(false);
        });

        modelBuilder.Entity<BookGenre>(entity =>
        {
            entity.HasKey(e => e.BookGenreId).HasName("PK__BookGenr__57C9DE4E505A3132");

            entity.ToTable("BookGenre");

            entity.Property(e => e.BookGenreId).HasColumnName("BookGenreID");
            entity.Property(e => e.Description)
                .HasMaxLength(30)
                .IsUnicode(false);
        });

        modelBuilder.Entity<BorrowerType>(entity =>
        {
            entity.HasKey(e => e.BorrowerTypeId).HasName("PK__Borrower__F925F31B052755B6");

            entity.ToTable("BorrowerType");

            entity.HasIndex(e => e.Type, "UQ__Borrower__F9B8A48BC18316AD").IsUnique();

            entity.Property(e => e.BorrowerTypeId).HasColumnName("BorrowerTypeID");
            entity.Property(e => e.Type)
                .HasMaxLength(15)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(e => e.CustomerId).HasName("PK__Customer__A4AE64B8D9801C7B");

            entity.ToTable("Customer");

            entity.HasIndex(e => e.Email, "UQ__Customer__A9D10534D8059F9B").IsUnique();

            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.AccountPassword).HasMaxLength(255);
            entity.Property(e => e.BorrowerTypeId).HasColumnName("BorrowerTypeID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Email)
                .HasMaxLength(60)
                .IsUnicode(false);
            entity.Property(e => e.FirstName)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.LastName)
                .HasMaxLength(30)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Donation>(entity =>
        {
            entity.HasKey(e => e.DonationId).HasName("PK__Donation__C5082EDB4EA6F46D");

            entity.ToTable("Donation");

            entity.Property(e => e.DonationId).HasColumnName("DonationID");
            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");

        });

        modelBuilder.Entity<Employee>(entity =>
        {
            entity.HasKey(e => e.EmployeeId).HasName("PK__Employee__7AD04FF12260513D");

            entity.ToTable("Employee");

            entity.Property(e => e.EmployeeId).HasColumnName("EmployeeID");
            entity.Property(e => e.AccountPassword)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FirstName)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.LastName)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.SupervisorId).HasColumnName("SupervisorID");
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.SexNavigation).WithMany(p => p.Employees)
                .HasForeignKey(d => d.Sex)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Employee_Sex");

            entity.HasOne(d => d.Supervisor).WithMany(p => p.InverseSupervisor)
                .HasForeignKey(d => d.SupervisorId)
                .HasConstraintName("FK_Employee_Supervisor");
        });

        modelBuilder.Entity<Event>(entity =>
        {
            entity.HasKey(e => e.EventId).HasName("PK__Event__7944C8702945AA9C");

            entity.ToTable("Event");

            entity.Property(e => e.EventId).HasColumnName("EventID");
            entity.Property(e => e.AgeGroup)
                .HasMaxLength(3)
                .IsFixedLength();
            entity.Property(e => e.CategoryId).HasColumnName("CategoryID");
            entity.Property(e => e.EndTimestamp).HasColumnType("datetime");
            entity.Property(e => e.Location)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.StartTimestamp).HasColumnType("datetime");
            entity.Property(e => e.Description)//dropped HasMaxLength
                .IsUnicode(false);
                entity.Property(e => e.Title)
                .HasMaxLength(50)
                .IsUnicode(false);

        });

        modelBuilder.Entity<EventCategory>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__EventCat__19093A2B43E84FD7");

            entity.ToTable("EventCategory");

            entity.Property(e => e.CategoryId).HasColumnName("CategoryID");
            entity.Property(e => e.CategoryDescription)
                .HasMaxLength(30)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Fine>(entity =>
        {
            entity.HasKey(e => e.FineId).HasName("PK__Fines__9D4A9BCC3A3AFBE6");

            entity.Property(e => e.FineId).HasColumnName("FineID");
            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.TransactionId).HasColumnName("TransactionID");

        });

        modelBuilder.Entity<Item>(entity =>
        {
            entity.HasKey(e => e.ItemId).HasName("PK__Item__727E83EBD4885DED");

            entity.ToTable("Item");

            entity.Property(e => e.ItemId).HasColumnName("ItemID");
            entity.Property(e => e.AvailabilityStatus)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.Location)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Title)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Movie>(entity =>
        {
            entity.HasKey(e => e.MovieId).HasName("PK__Movie__4BD2943AC50379E7");

            entity.ToTable("Movie");

            entity.Property(e => e.MovieId)
                .ValueGeneratedOnAdd() // Let the database auto-increment the ID
                .HasColumnName("MovieID");

            entity.Property(e => e.Upc)
                .HasMaxLength(13)
                .IsUnicode(false)
                .HasColumnName("UPC");

            entity.Property(e => e.MovieDirectorId).HasColumnName("MovieDirectorID");
            entity.Property(e => e.MovieGenreId).HasColumnName("MovieGenreID");

            entity.Property(e => e.YearReleased).HasColumnName("YearReleased");

            entity.Property(e => e.Format)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("Format");

            entity.Property(e => e.CoverImagePath)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("CoverImagePath");

            entity.Property(e => e.ItemId).HasColumnName("ItemID");

            entity.HasOne(d => d.MovieDirector)
                .WithMany(p => p.Movies)
                .HasForeignKey(d => d.MovieDirectorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Movie_Director");

            entity.HasOne(d => d.MovieGenre)
                .WithMany(p => p.Movies)
                .HasForeignKey(d => d.MovieGenreId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Movie_Genre");

            entity.HasOne(d => d.Item)
                .WithMany()
                .HasForeignKey(d => d.ItemId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_Movie_Item");
        });

        modelBuilder.Entity<MovieGenre>(entity =>
        {
            entity.HasKey(e => e.MovieGenreId).HasName("PK__MovieGen__C18CDB60BBCD3355");

            entity.ToTable("MovieGenre");

            entity.Property(e => e.MovieGenreId).HasColumnName("MovieGenreID");
            entity.Property(e => e.Description)
                .HasMaxLength(30)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Music>(entity =>
        {
            entity.HasKey(e => e.SongId).HasName("PK__Music__11F840E0555B1385");

            entity.ToTable("Music");

            entity.Property(e => e.SongId).HasColumnName("SongID");
            entity.Property(e => e.MusicArtistId).HasColumnName("MusicArtistID");
            entity.Property(e => e.MusicGenreId).HasColumnName("MusicGenreID");
            entity.Property(e => e.ItemId).HasColumnName("ItemID");
            entity.Property(e => e.Format).HasMaxLength(20).IsUnicode(false);
            entity.Property(e => e.CoverImagePath).HasMaxLength(255).IsUnicode(false);

            entity.HasOne(d => d.MusicArtist)
                .WithMany(p => p.Musics)
                .HasForeignKey(d => d.MusicArtistId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Music_Artist");

            entity.HasOne(d => d.MusicGenre)
                .WithMany(p => p.Musics)
                .HasForeignKey(d => d.MusicGenreId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Music_Genre");

            entity.HasOne(d => d.Item)
                .WithOne()  // No reverse nav
                .HasForeignKey<Music>(d => d.ItemId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_Music_Item");
        });

        modelBuilder.Entity<MusicArtist>(entity =>
        {
            entity.HasKey(e => e.MusicArtistId).HasName("PK__MusicArt__A2B0A5D3F1C4E8D7");

            entity.ToTable("MusicArtist");

            entity.Property(e => e.MusicArtistId).HasColumnName("MusicArtistID");
            entity.Property(e => e.ArtistName)
                .HasMaxLength(50)
                .IsUnicode(false);
        });


        modelBuilder.Entity<MusicGenre>(entity =>
        {
            entity.HasKey(e => e.MusicGenreId).HasName("PK__MusicGen__4561E110378D2E03");

            entity.ToTable("MusicGenre");

            entity.Property(e => e.MusicGenreId).HasColumnName("MusicGenreID");
            entity.Property(e => e.Description)
                .HasMaxLength(30)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Publisher>(entity =>
        {
            entity.HasKey(e => e.PublisherId).HasName("PK__Publishe__4C657E4BFDBEB389");

            entity.ToTable("Publisher");

            entity.HasIndex(e => e.PublisherName, "UQ__Publishe__5F0E22494099DCC5").IsUnique();

            entity.Property(e => e.PublisherId).HasColumnName("PublisherID");
            entity.Property(e => e.PublisherName)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Sex>(entity =>
        {
            entity.HasKey(e => e.SexID).HasName("PK__Sex__CA1E3C81ACCDEC3C");

            entity.ToTable("Sex");

            entity.HasIndex(e => e.Description, "UQ__Sex__4EBBBAC9A43B1219").IsUnique();

            entity.Property(e => e.SexID)
                .ValueGeneratedNever()
                .HasColumnName("Sex");
            entity.Property(e => e.Description)
                .HasMaxLength(15)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Technology>(entity =>
        {
            entity.HasKey(e => e.DeviceId).HasName("PK_Technology");

            entity.ToTable("Technology");

            entity.Property(e => e.DeviceId)
                .HasColumnName("DeviceID");

            entity.Property(e => e.DeviceTypeID)
                .HasColumnName("DeviceTypeID");

            entity.Property(e => e.ManufacturerID)
                .HasColumnName("ManufacturerID");

            entity.Property(e => e.ModelNumber)
                .HasColumnName("ModelNumber")
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.Property(e => e.ItemID)
                .HasColumnName("ItemID");

            entity.Property(e => e.CoverImagePath)
                .HasColumnName("CoverImagePath")
                .HasMaxLength(255)
                .IsUnicode(false);

            // Foreign Key: DeviceType
            entity.HasOne(e => e.DeviceType)
                .WithMany(d => d.Technologies)
                .HasForeignKey(e => e.DeviceTypeID)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Technology_DeviceType");

            // Foreign Key: Manufacturer
            entity.HasOne(e => e.Manufacturer)
                .WithMany(m => m.Technologies)
                .HasForeignKey(e => e.ManufacturerID)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Technology_Manufacturer");

            // Foreign Key: Item
            entity.HasOne<Item>()
                .WithMany()
                .HasForeignKey(e => e.ItemID)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_Technology_Item");
        });

        modelBuilder.Entity<TechnologyManufacturer>(entity =>
        {
            entity.HasKey(e => e.ManufacturerID);
            
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsRequired()
                .IsUnicode(false);

            entity.ToTable("TechnologyManufacturer");
        });

        modelBuilder.Entity<DeviceType>(entity =>
        {
            entity.HasKey(e => e.DeviceTypeID);

            entity.Property(e => e.TypeName)
                .HasMaxLength(50)
                .IsRequired()
                .IsUnicode(false);

            entity.ToTable("DeviceType");
        });


        modelBuilder.Entity<TransactionHistory>(entity =>
        {
            entity.HasKey(e => e.TransactionId).HasName("PK__TRANSACT__55433A4B8D7C7CAF");

            entity.ToTable("TRANSACTION_HISTORY");

            entity.Property(e => e.TransactionId).HasColumnName("TransactionID");
            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.ItemId).HasColumnName("ItemID");

                  modelBuilder.Entity<TransactionPopularityDto>()
            .HasKey(t => new { t.Title, t.ItemType }); // Composite Key

              modelBuilder.Entity<TransactionFineDto>()
            .HasKey(t => new { t.Title, t.Email, t.DateBorrowed }); // Composite Key

            modelBuilder.Entity<TransactionHistoryDto>()
            .HasKey(t => new { t.TransactionId, t.CustomerId, t.ItemId }); // Composite Key

modelBuilder.Entity<MasterTransactionReportDto>().HasNoKey().ToView(null);

        });

        modelBuilder.Entity<Waitlist>(entity =>
        {
            entity.HasKey(e => e.WaitlistId).HasName("PK__Waitlist__FE78FE80F40A43D3");

            entity.ToTable("Waitlist");

            entity.Property(e => e.WaitlistId).HasColumnName("WaitlistID");
            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.ItemId).HasColumnName("ItemID");

            entity.HasOne(w => w.Item)
                .WithMany()
                .HasForeignKey(w => w.ItemId);
        
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);

    }
}
