using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using POSSolution.API.DTO;
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
    public class PurchaseReturnController : BaseController<PurchaseReturn>
    {
        private POSContext _context;
        public PurchaseReturnController(POSContext context) : base(context)
        {
            _context = context;
        }

        public override async Task<ActionResult<PurchaseReturn>> GetAsync([FromRoute] int id)
        {
            try
            {

                var result = await _dbSet.Include(pd => pd.PurchaseReturnDetails).Where(e => e.Id == id).FirstOrDefaultAsync();
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

        public override async Task<ActionResult<PurchaseReturn>> CreateAsync([FromBody] PurchaseReturn purchaseReturn)
        {
            using (var transection = await _context.Database.BeginTransactionAsync())
            {
                try
                {

                    foreach (PurchaseReturnDetails details in purchaseReturn.PurchaseReturnDetails)
                    {
                        if (_context.PurchaseDetails.Any(a => a.PurchaseId == purchaseReturn.PurchaseId))
                        {
                         
                            details.UnitCost = _context.PurchaseDetails.Single(a => a.ItemId == details.ItemId).UnitCost;
                        }
                    }

                    await _context.PurchaseReturns.AddAsync(purchaseReturn);
                    await _context.SaveChangesAsync();

                    List<StockCount> whList = new List<StockCount>();
                    
                    foreach (PurchaseReturnDetails details in purchaseReturn.PurchaseReturnDetails)
                    {
                
                        if (_context.StockCounts.Any(item => item.ItemId == details.ItemId))
                        {
                            StockCount wh = _context.StockCounts.Single(item => item.ItemId == details.ItemId);
                            wh.PurchaseQty -= details.Quantity;
                            whList.Add(wh);

                        }

                    }

                    _context.StockCounts.UpdateRange(whList);
                    await _context.SaveChangesAsync();
                    await transection.CommitAsync();
                }
                catch (Exception ex)
                {
                    await transection.RollbackAsync();
                    throw new Exception(ex.Message);
                }
            }
            return Created("api/PurchaseReturn/" + purchaseReturn.Id, purchaseReturn);
        }

        public override async Task<ActionResult<PurchaseReturn>> UpdateAsync([FromRoute] int id, [FromBody] PurchaseReturn purchaseReturn)
        {
            using (var transection = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    if (id != purchaseReturn.Id)
                    {
                        return BadRequest();
                    }
                    else
                    {
                        if (await _context.PurchaseReturns.AnyAsync(p => p.Id == id))
                        {
                            _context.PurchaseReturns.Update(purchaseReturn);

                        }
                    }
                    

                    List<StockCount> whList = new List<StockCount>();

                    foreach (PurchaseReturnDetails details in purchaseReturn.PurchaseReturnDetails)
                    {

                        if (_context.StockCounts.Any(item => item.ItemId == details.ItemId))
                        {
                            decimal diffQty = _context.PurchaseReturnDetails.Single(p => p.Id == details.Id).Quantity - details.Quantity;
                            StockCount wh = _context.StockCounts.Single(item => item.ItemId == details.ItemId);
                            wh.PurchaseQty += diffQty;
                            whList.Add(wh);

                        }

                    }

                    _context.StockCounts.UpdateRange(whList);
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

