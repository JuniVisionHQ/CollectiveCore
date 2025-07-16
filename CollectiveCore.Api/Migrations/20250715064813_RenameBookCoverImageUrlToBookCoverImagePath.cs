using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CollectiveCore.Api.Migrations
{
    /// <inheritdoc />
    public partial class RenameBookCoverImageUrlToBookCoverImagePath : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "BookCoverImageUrl",
                table: "Books",
                newName: "BookCoverImagePath");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "BookCoverImagePath",
                table: "Books",
                newName: "BookCoverImageUrl");
        }
    }
}
