using Microsoft.EntityFrameworkCore.Migrations;

namespace POSSolution.Infrastructure.Migrations
{
    public partial class salesDiscount : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Items_DiscountAndTaxes_DiscountId",
                table: "Items");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DiscountAndTaxes",
                table: "DiscountAndTaxes");

            migrationBuilder.RenameTable(
                name: "DiscountAndTaxes",
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

        protected override void Down(MigrationBuilder migrationBuilder)
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
                newName: "DiscountAndTaxes");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DiscountAndTaxes",
                table: "DiscountAndTaxes",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Items_DiscountAndTaxes_DiscountId",
                table: "Items",
                column: "DiscountId",
                principalTable: "DiscountAndTaxes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
