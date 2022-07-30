using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using POSSolution.API.DTO;
using POSSolution.Core.Common.Models;
using POSSolution.Core.Models;
using POSSolution.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace POSSolution.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PurchaseController : BaseController<Purchase>
    {
        private readonly POSContext _context;
        public PurchaseController(POSContext context) : base(context)
        {
            _context = context;
        }

        public override async Task<ActionResult<Purchase>> GetAsync([FromRoute] int id)
        {
            try
            {

                var result = await _dbSet.Include(pd => pd.PurchaseDetails).Where(e => e.Id == id).FirstOrDefaultAsync();
                if (result != null)
                {
                    return Ok(result);
                }
                else
                {
                    return NotFound($"{id} not found");
                }
            }
            catch (Exception)
            {

                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error retrieving data from the database");
            }
        }
        // Api for create entity
        public override async Task<ActionResult<Purchase>> CreateAsync([FromBody] Purchase purchase)
        {

            using (var transection = await _context.Database.BeginTransactionAsync())
            {
                try
                {

                    foreach (PurchaseDetails details in purchase.PurchaseDetails)
                    {
                        Item purchaseItem = _context.Items.Include(i => i.SalesDiscountTax).SingleOrDefault(it => it.Id == details.ItemId);
                        SalesDiscountTax dt = purchaseItem.SalesDiscountTax;
                        decimal discountAmount = 0;
                        decimal taxAmount = 0;


                        if (dt.IsPercentage)
                        {
                            discountAmount = details.UnitCost * dt.DiscountRate;
                        }
                        else
                        {
                            discountAmount = dt.DiscountAmount;
                        }
                        details.DiscountAmount = discountAmount;
                        taxAmount = (details.UnitCost - (details.UnitCost * dt.DiscountRate)) * dt.TaxRate;
                        details.TaxAmount = taxAmount;
                        decimal profitMarginRate = _context.Items.Single(item => item.Id == details.ItemId).ProfitMargin;
                        decimal profitAmount = (details.UnitCost - discountAmount + taxAmount) * profitMarginRate;
                        details.ProfitAmount = profitAmount;
                        details.SalesPrice = details.UnitCost - discountAmount + taxAmount + profitAmount;
                    }
                    await _context.Purchases.AddAsync(purchase);
                    await _context.SaveChangesAsync();

                    // Update Correspondent StockCount entity
                    List<StockCount> whList = new List<StockCount>();
                    foreach (PurchaseDetails details in purchase.PurchaseDetails)
                    {

                        if (_context.StockCounts.Any(item => item.ItemId == details.ItemId))
                        {
                            StockCount wh = _context.StockCounts.Single(item => item.ItemId == details.ItemId);
                            wh.PurchaseQty += details.Quantity;
                            whList.Add(wh);
                            _context.StockCounts.UpdateRange(whList);

                        }
                        else
                        {
                            // Create correspondent entity in StockCount if not exist
                            StockCount wh = new StockCount();
                            wh.ItemId = details.ItemId;
                            wh.PurchaseQty = details.Quantity;
                            wh.Balance = wh.PurchaseQty - wh.SalesQty;
                            whList.Add(wh);
                            await _context.StockCounts.AddRangeAsync(whList);

                        }

                    }

                    await _context.SaveChangesAsync();
                    await transection.CommitAsync();
                }
                catch (Exception ex)
                {
                    await transection.RollbackAsync();
                    throw new Exception(ex.Message);
                }
            }
            return Created("api/Purchase/" + purchase.Id, purchase);
        }

        // Api for update entity
        public override async Task<ActionResult<Purchase>> UpdateAsync([FromRoute] int id, [FromBody] Purchase purchase)
        {
            using (var transection = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    if (id != purchase.Id)
                    {
                        return BadRequest();
                    }
                    else
                    {
                        foreach (PurchaseDetails details in purchase.PurchaseDetails)
                        {

                           Item purchaseItem = _context.Items.Include(i => i.SalesDiscountTax).SingleOrDefault(it => it.Id == details.ItemId);
                            SalesDiscountTax dt = purchaseItem.SalesDiscountTax;
                            decimal discountAmount = 0;
                            decimal taxAmount = 0;
                            if (dt.IsPercentage)
                            {
                                discountAmount = details.UnitCost * dt.DiscountRate;
                            }
                            else
                            {
                                discountAmount = dt.DiscountAmount;
                            }
                            details.DiscountAmount = discountAmount;
                            taxAmount = (details.UnitCost - (details.UnitCost * dt.DiscountRate)) * dt.TaxRate;
                            details.TaxAmount = taxAmount;
                            decimal profitMargin = _context.Items.Single(item => item.Id == details.ItemId).ProfitMargin;
                            decimal profitAmount = (details.UnitCost - discountAmount + taxAmount) * profitMargin;
                            details.ProfitAmount = profitAmount;
                            details.SalesPrice = details.UnitCost - discountAmount + taxAmount + profitAmount;
                        }
                        _context.Purchases.Update(purchase);

                        // Update correspondent stock quantity
                        List<StockCount> whList = new List<StockCount>();
                        foreach (PurchaseDetails details in purchase.PurchaseDetails)
                        {

                            if (_context.StockCounts.Any(item => item.ItemId == details.ItemId))
                            {
                                decimal diffQty = details.Quantity - _context.PurchaseDetails.Single(p => p.Id == details.Id).Quantity;
                                StockCount wh = _context.StockCounts.Single(item => item.ItemId == details.ItemId);
                                wh.PurchaseQty += diffQty;
                                whList.Add(wh);
                                _context.StockCounts.UpdateRange(whList);

                            }
                            else
                            {
                                // Create correspondent entity in StockCount if not exist
                                StockCount wh = new StockCount();
                                wh.ItemId = details.ItemId;
                                wh.PurchaseQty = details.Quantity;
                                wh.Balance = wh.PurchaseQty - wh.SalesQty;
                                whList.Add(wh);
                                await _context.StockCounts.AddRangeAsync(whList);

                            }

                        }
                    }

                    await _context.SaveChangesAsync();
                    await transection.CommitAsync();
                }
                catch (Exception ex)
                {
                    await transection.RollbackAsync();
                    throw new Exception(ex.Message);
                }
            }
            return Ok();
        }



    }

}

