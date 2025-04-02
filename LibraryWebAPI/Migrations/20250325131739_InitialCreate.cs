using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LibraryWebAPI.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BookAuthor",
                columns: table => new
                {
                    BookAuthorID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: false),
                    LastName = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__BookAuth__21B24F39E3390529", x => x.BookAuthorID);
                });

            migrationBuilder.CreateTable(
                name: "BookGenre",
                columns: table => new
                {
                    BookGenreID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__BookGenr__57C9DE4E505A3132", x => x.BookGenreID);
                });

            migrationBuilder.CreateTable(
                name: "BorrowerType",
                columns: table => new
                {
                    BorrowerTypeID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Type = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: false),
                    BorrowingLimit = table.Column<int>(type: "int", nullable: false),
                    LoanPeriod = table.Column<int>(type: "int", nullable: false),
                    ReservationWindow = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Borrower__F925F31B052755B6", x => x.BorrowerTypeID);
                });

            migrationBuilder.CreateTable(
                name: "Event",
                columns: table => new
                {
                    EventID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StartTimestamp = table.Column<DateTime>(type: "datetime", nullable: false),
                    EndTimestamp = table.Column<DateTime>(type: "datetime", nullable: true),
                    Location = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: false),
                    AgeGroup = table.Column<int>(type: "int", fixedLength: true, maxLength: 3, nullable: false),
                    CategoryID = table.Column<int>(type: "int", nullable: false),
                    IsPrivate = table.Column<bool>(type: "bit", nullable: false),
                    Description = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    Title = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Event__7944C8702945AA9C", x => x.EventID);
                });

            migrationBuilder.CreateTable(
                name: "EventCategory",
                columns: table => new
                {
                    CategoryID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryDescription = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__EventCat__19093A2B43E84FD7", x => x.CategoryID);
                });

            migrationBuilder.CreateTable(
                name: "Item",
                columns: table => new
                {
                    ItemID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    AvailabilityStatus = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: false),
                    TotalCopies = table.Column<int>(type: "int", nullable: false),
                    AvailableCopies = table.Column<int>(type: "int", nullable: false),
                    Location = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Item__727E83EBD4885DED", x => x.ItemID);
                });

            migrationBuilder.CreateTable(
                name: "MovieGenre",
                columns: table => new
                {
                    MovieGenreID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__MovieGen__C18CDB60BBCD3355", x => x.MovieGenreID);
                });

            migrationBuilder.CreateTable(
                name: "MusicGenre",
                columns: table => new
                {
                    MusicGenreID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__MusicGen__4561E110378D2E03", x => x.MusicGenreID);
                });

            migrationBuilder.CreateTable(
                name: "Publisher",
                columns: table => new
                {
                    PublisherID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublisherName = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Publishe__4C657E4BFDBEB389", x => x.PublisherID);
                });

            migrationBuilder.CreateTable(
                name: "Sex",
                columns: table => new
                {
                    Sex = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Sex__CA1E3C81ACCDEC3C", x => x.Sex);
                });

            migrationBuilder.CreateTable(
                name: "Technology",
                columns: table => new
                {
                    DeviceID = table.Column<int>(type: "int", nullable: false),
                    DeviceType = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Manufacturer = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    ModelNumber = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Technolo__49E12331C93D0AED", x => x.DeviceID);
                });

            migrationBuilder.CreateTable(
                name: "Customer",
                columns: table => new
                {
                    CustomerID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: false),
                    LastName = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: false),
                    Email = table.Column<string>(type: "varchar(60)", unicode: false, maxLength: 60, nullable: false),
                    BorrowerTypeID = table.Column<int>(type: "int", nullable: false),
                    MembershipStartDate = table.Column<DateOnly>(type: "date", nullable: false),
                    MembershipEndDate = table.Column<DateOnly>(type: "date", nullable: true),
                    AccountPassword = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    EmailConfirmationCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Customer__A4AE64B8D9801C7B", x => x.CustomerID);
                    table.ForeignKey(
                        name: "FK_Customer_BorrowerType_BorrowerTypeID",
                        column: x => x.BorrowerTypeID,
                        principalTable: "BorrowerType",
                        principalColumn: "BorrowerTypeID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Movie",
                columns: table => new
                {
                    MovieID = table.Column<int>(type: "int", nullable: false),
                    Director = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    MovieGenreID = table.Column<int>(type: "int", nullable: false),
                    YearReleased = table.Column<int>(type: "int", nullable: true),
                    Format = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Movie__4BD2943AC50379E7", x => x.MovieID);

                    table.ForeignKey(
                        name: "FK_Movie_MovieGenre",
                        column: x => x.MovieGenreID,
                        principalTable: "MovieGenre",
                        principalColumn: "MovieGenreID");
                });

            migrationBuilder.CreateTable(
                name: "Music",
                columns: table => new
                {
                    MusicID = table.Column<int>(type: "int", nullable: false),
                    Artist = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    MusicGenreID = table.Column<int>(type: "int", nullable: false),
                    Format = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false),
                    MusicNavigationItemId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Music__11F840E0555B1385", x => x.MusicID);
                    table.ForeignKey(
                        name: "FK_Music_Item_MusicNavigationItemId",
                        column: x => x.MusicNavigationItemId,
                        principalTable: "Item",
                        principalColumn: "ItemID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Music_MusicGenre",
                        column: x => x.MusicGenreID,
                        principalTable: "MusicGenre",
                        principalColumn: "MusicGenreID");
                });

            migrationBuilder.CreateTable(
                name: "Book",
                columns: table => new
                {
                    BookID = table.Column<int>(type: "int", nullable: false),
                    ISBN = table.Column<string>(type: "varchar(13)", unicode: false, maxLength: 13, nullable: true),
                    PublisherID = table.Column<int>(type: "int", nullable: false),
                    BookGenreID = table.Column<int>(type: "int", nullable: false),
                    BookAuthorID = table.Column<int>(type: "int", nullable: false),
                    YearPublished = table.Column<int>(type: "int", nullable: false),
                    BookNavigationItemId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Book__3DE0C227DE49FC03", x => x.BookID);
                    table.ForeignKey(
                        name: "FK_Book_BookAuthor",
                        column: x => x.BookAuthorID,
                        principalTable: "BookAuthor",
                        principalColumn: "BookAuthorID");
                    table.ForeignKey(
                        name: "FK_Book_BookGenre",
                        column: x => x.BookGenreID,
                        principalTable: "BookGenre",
                        principalColumn: "BookGenreID");
                    table.ForeignKey(
                        name: "FK_Book_Item_BookNavigationItemId",
                        column: x => x.BookNavigationItemId,
                        principalTable: "Item",
                        principalColumn: "ItemID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Book_Publisher",
                        column: x => x.PublisherID,
                        principalTable: "Publisher",
                        principalColumn: "PublisherID");
                });

            migrationBuilder.CreateTable(
                name: "Employee",
                columns: table => new
                {
                    EmployeeID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: false),
                    LastName = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: false),
                    BirthDate = table.Column<DateOnly>(type: "date", nullable: true),
                    Sex = table.Column<int>(type: "int", nullable: false),
                    SupervisorID = table.Column<int>(type: "int", nullable: true),
                    Username = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    AccountPassword = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Employee__7AD04FF12260513D", x => x.EmployeeID);
                    table.ForeignKey(
                        name: "FK_Employee_Sex",
                        column: x => x.Sex,
                        principalTable: "Sex",
                        principalColumn: "Sex");
                    table.ForeignKey(
                        name: "FK_Employee_Supervisor",
                        column: x => x.SupervisorID,
                        principalTable: "Employee",
                        principalColumn: "EmployeeID");
                });

            migrationBuilder.CreateTable(
                name: "Donation",
                columns: table => new
                {
                    DonationID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CustomerID = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<double>(type: "float", nullable: false),
                    Date = table.Column<DateOnly>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Donation__C5082EDB4EA6F46D", x => x.DonationID);
                    table.ForeignKey(
                        name: "FK_Donation_Customer_CustomerID",
                        column: x => x.CustomerID,
                        principalTable: "Customer",
                        principalColumn: "CustomerID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Fines",
                columns: table => new
                {
                    FineID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TransactionID = table.Column<int>(type: "int", nullable: false),
                    CustomerID = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<double>(type: "float", nullable: false),
                    DueDate = table.Column<DateOnly>(type: "date", nullable: false),
                    IssueDate = table.Column<DateOnly>(type: "date", nullable: false),
                    PaymentStatus = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Fines__9D4A9BCC3A3AFBE6", x => x.FineID);
                    table.ForeignKey(
                        name: "FK_Fines_Customer_CustomerID",
                        column: x => x.CustomerID,
                        principalTable: "Customer",
                        principalColumn: "CustomerID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TRANSACTION_HISTORY",
                columns: table => new
                {
                    TransactionID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CustomerID = table.Column<int>(type: "int", nullable: false),
                    ItemID = table.Column<int>(type: "int", nullable: false),
                    DateBorrowed = table.Column<DateOnly>(type: "date", nullable: false),
                    DueDate = table.Column<DateOnly>(type: "date", nullable: false),
                    ReturnDate = table.Column<DateOnly>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__TRANSACT__55433A4B8D7C7CAF", x => x.TransactionID);
                    table.ForeignKey(
                        name: "FK_TRANSACTION_HISTORY_Customer_CustomerID",
                        column: x => x.CustomerID,
                        principalTable: "Customer",
                        principalColumn: "CustomerID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Waitlist",
                columns: table => new
                {
                    WaitlistID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CustomerID = table.Column<int>(type: "int", nullable: false),
                    ItemID = table.Column<int>(type: "int", nullable: false),
                    ReservationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    isReceived = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Waitlist__FE78FE80F40A43D3", x => x.WaitlistID);
                    table.ForeignKey(
                        name: "FK_Waitlist_Customer_CustomerID",
                        column: x => x.CustomerID,
                        principalTable: "Customer",
                        principalColumn: "CustomerID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Book_BookAuthorID",
                table: "Book",
                column: "BookAuthorID");

            migrationBuilder.CreateIndex(
                name: "IX_Book_BookGenreID",
                table: "Book",
                column: "BookGenreID");

            migrationBuilder.CreateIndex(
                name: "IX_Book_BookNavigationItemId",
                table: "Book",
                column: "BookNavigationItemId");

            migrationBuilder.CreateIndex(
                name: "IX_Book_PublisherID",
                table: "Book",
                column: "PublisherID");

            migrationBuilder.CreateIndex(
                name: "UQ__Book__447D36EA19E8B3BA",
                table: "Book",
                column: "ISBN",
                unique: true,
                filter: "[ISBN] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "UQ__Borrower__F9B8A48BC18316AD",
                table: "BorrowerType",
                column: "Type",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Customer_BorrowerTypeID",
                table: "Customer",
                column: "BorrowerTypeID");

            migrationBuilder.CreateIndex(
                name: "UQ__Customer__A9D10534D8059F9B",
                table: "Customer",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Donation_CustomerID",
                table: "Donation",
                column: "CustomerID");

            migrationBuilder.CreateIndex(
                name: "IX_Employee_Sex",
                table: "Employee",
                column: "Sex");

            migrationBuilder.CreateIndex(
                name: "IX_Employee_SupervisorID",
                table: "Employee",
                column: "SupervisorID");

            migrationBuilder.CreateIndex(
                name: "IX_Fines_CustomerID",
                table: "Fines",
                column: "CustomerID");

            migrationBuilder.CreateIndex(
                name: "IX_Movie_MovieGenreID",
                table: "Movie",
                column: "MovieGenreID");

            migrationBuilder.CreateIndex(
                name: "IX_Music_MusicGenreID",
                table: "Music",
                column: "MusicGenreID");

            migrationBuilder.CreateIndex(
                name: "IX_Music_MusicNavigationItemId",
                table: "Music",
                column: "MusicNavigationItemId");

            migrationBuilder.CreateIndex(
                name: "UQ__Publishe__5F0E22494099DCC5",
                table: "Publisher",
                column: "PublisherName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ__Sex__4EBBBAC9A43B1219",
                table: "Sex",
                column: "Description",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ__Technolo__6422901FB0A5F203",
                table: "Technology",
                column: "ModelNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TRANSACTION_HISTORY_CustomerID",
                table: "TRANSACTION_HISTORY",
                column: "CustomerID");

            migrationBuilder.CreateIndex(
                name: "IX_Waitlist_CustomerID",
                table: "Waitlist",
                column: "CustomerID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Book");

            migrationBuilder.DropTable(
                name: "Donation");

            migrationBuilder.DropTable(
                name: "Employee");

            migrationBuilder.DropTable(
                name: "Event");

            migrationBuilder.DropTable(
                name: "EventCategory");

            migrationBuilder.DropTable(
                name: "Fines");

            migrationBuilder.DropTable(
                name: "Movie");

            migrationBuilder.DropTable(
                name: "Music");

            migrationBuilder.DropTable(
                name: "Technology");

            migrationBuilder.DropTable(
                name: "TRANSACTION_HISTORY");

            migrationBuilder.DropTable(
                name: "Waitlist");

            migrationBuilder.DropTable(
                name: "BookAuthor");

            migrationBuilder.DropTable(
                name: "BookGenre");

            migrationBuilder.DropTable(
                name: "Publisher");

            migrationBuilder.DropTable(
                name: "Sex");

            migrationBuilder.DropTable(
                name: "MovieGenre");

            migrationBuilder.DropTable(
                name: "Item");

            migrationBuilder.DropTable(
                name: "MusicGenre");

            migrationBuilder.DropTable(
                name: "Customer");

            migrationBuilder.DropTable(
                name: "BorrowerType");
        }
    }
}
