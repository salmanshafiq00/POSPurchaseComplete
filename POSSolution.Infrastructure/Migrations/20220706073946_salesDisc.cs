using Microsoft.EntityFrameworkCore.Migrations;

namespace POSSolution.Infrastructure.Migrations
{
    public partial class salesDisc : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Items_DiscountAndTax_DiscountId",
                table: "Items");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DiscountAndTax",
                table: "DiscountAndTax");

            migrationBuilder.DropColumn(
                name: "Discriminator",
                table: "DiscountAndTax");

            migrationBuilder.RenameTable(
                name: "DiscountAndTax",
                newName: "SalesDiscountTaxes");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SalesDiscountTaxes",
                table: "SalesDiscountTaxes",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Items_SalesDiscountTaxes_DiscountId",
                table: "Items",
                column: "DiscountId",
                principalTable: "SalesDiscountTaxes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Items_SalesDiscountTaxes_DiscountId",
                table: "Items");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SalesDiscountTaxes",
                table: "SalesDiscountTaxes");

            migrationBuilder.RenameTable(
                name: "SalesDiscountTaxes",
                newName: "DiscountAndTax");

            migrationBuilder.AddColumn<string>(
                name: "Discriminator",
                table: "DiscountAndTax",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DiscountAndTax",
                table: "DiscountAndTax",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Items_DiscountAndTax_DiscountId",
                table: "Items",
                column: "DiscountId",
                principalTable: "DiscountAndTax",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
