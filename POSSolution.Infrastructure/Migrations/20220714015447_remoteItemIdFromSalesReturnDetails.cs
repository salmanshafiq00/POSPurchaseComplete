using Microsoft.EntityFrameworkCore.Migrations;

namespace POSSolution.Infrastructure.Migrations
{
    public partial class remoteItemIdFromSalesReturnDetails : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SalesReturnDetails_Items_ItemId",
                table: "SalesReturnDetails");

            migrationBuilder.DropIndex(
                name: "IX_SalesReturnDetails_ItemId",
                table: "SalesReturnDetails");

            migrationBuilder.DropColumn(
                name: "ItemId",
                table: "SalesReturnDetails");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ItemId",
                table: "SalesReturnDetails",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_SalesReturnDetails_ItemId",
                table: "SalesReturnDetails",
                column: "ItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_SalesReturnDetails_Items_ItemId",
                table: "SalesReturnDetails",
                column: "ItemId",
                principalTable: "Items",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
