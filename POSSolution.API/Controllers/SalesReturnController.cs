using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
    public class SalesReturnController : BaseController<SalesReturn>
    {
        private POSContext _context;
        public SalesReturnController(POSContext context) : base(context)
        {
            _context = context;
        }

        public override async Task<ActionResult<SalesReturn>> CreateAsync([FromBody] SalesReturn salesReturn)
        {
            using (var transection = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    await _context.SalesReturns.AddAsync(salesReturn);
                    await _context.SaveChangesAsync();

                    List<StockCount> whList = new List<StockCount>();
                    foreach (SalesReturnDetails details in salesReturn.SalesReturnDetails)
                    {
                        if(_context.SalesDetails.Any(e => e.ItemId == details.ReturnItemId) && _context.StockCounts.Any(item => item.ItemId == details.ReturnItemId))
                        {
                            StockCount wh = _context.StockCounts.Single(item => item.ItemId == details.ReturnItemId);
                            wh.SalesQty -= details.SalesReturnQty;
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
            return Created("api/SalesReturn/" + salesReturn.Id, salesReturn);
        }

    }
}



