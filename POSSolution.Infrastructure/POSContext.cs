using Microsoft.EntityFrameworkCore;
using POSSolution.Core.Common.Models;
using POSSolution.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace POSSolution.Infrastructure
{
    public class POSContext : DbContext
    {
        public POSContext(DbContextOptions<POSContext> options) : base(options)
        {

        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
            base.OnConfiguring(optionsBuilder);
        }

        public DbSet<Brand> Brands { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<CompanyInfo> CompanyInfos { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Expense> Expenses { get; set; }
        public DbSet<ExpenseCategory> ExpenseCategories { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<PurchaseDetails> PurchaseDetails { get; set; }
        public DbSet<Purchase> Purchases { get; set; }
        public DbSet<PurchaseReturn>  PurchaseReturns { get; set; }
        public DbSet<PurchaseReturnDetails>  PurchaseReturnDetails { get; set; }
        public DbSet<PurchasePayment> PurchasePayments { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<SalesDetails> SalesDetails { get; set; }
        public DbSet<Sales> Sales { get; set; }
        public DbSet<SalesDiscountTax>  SalesDiscountTaxes { get; set; }
        public DbSet<SalesReturn> SalesReturns { get; set; }
        public DbSet<SalesReturnDetails> SalesReturnDetails { get; set; }
        public DbSet<SalesPayment> SalesPayments { get; set; }
        public DbSet<State> States { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<Unit> Units { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<StockCount> StockCounts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Purchase>().Property(p => p.GrandTotal).HasComputedColumnSql("[SubTotal]+[OtherCharges]");
            modelBuilder.Entity<PurchaseDetails>().Property(p => p.TotalAmount).HasComputedColumnSql("[UnitCost] * [Quantity]");
            modelBuilder.Entity<PurchaseDetails>().Property(p => p.SalesPrice).HasComputedColumnSql("[UnitCost]-[DiscountAmount]+[TaxAmount]+[ProfitAmount]");
            modelBuilder.Entity<StockCount>().Property(p => p.Balance).HasComputedColumnSql("[PurchaseQty]-[SalesQty]");
            modelBuilder.Entity<PurchaseReturn>().Property(p => p.GrandTotal).HasComputedColumnSql("[SubTotal]+[OtherCharges]");
            modelBuilder.Entity<PurchaseReturnDetails>().Property(p => p.TotalAmount).HasComputedColumnSql("[UnitCost] * [Quantity]");
            modelBuilder.Entity<Sales>().Property(p => p.GrandTotal).HasComputedColumnSql("[SubTotal]+[OtherCharges]");

            modelBuilder.Entity<SalesReturn>().Property(p => p.GrandTotal).HasComputedColumnSql("[SubTotal]+[OtherCharges]");




            base.OnModelCreating(modelBuilder);
        }
    }
}
