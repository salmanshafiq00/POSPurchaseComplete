using Microsoft.EntityFrameworkCore.Migrations;

namespace POSSolution.Infrastructure.Migrations
{
    public partial class itemNameAddToPurchaseDetails : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ItemName",
                table: "PurchaseDetails",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ItemName",
                table: "PurchaseDetails");
        }
    }
}
