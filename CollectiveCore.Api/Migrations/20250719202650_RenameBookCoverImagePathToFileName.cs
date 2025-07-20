using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CollectiveCore.Api.Migrations
{
    /// <inheritdoc />
    public partial class RenameBookCoverImagePathToFileName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "BookCoverImagePath",
                table: "Books",
                newName: "BookCoverImageFileName");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "BookCoverImageFileName",
                table: "Books",
                newName: "BookCoverImagePath");
        }
    }
}
