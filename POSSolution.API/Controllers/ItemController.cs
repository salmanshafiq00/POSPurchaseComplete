using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using POSSolution.API.DTO;
using POSSolution.Core.Models;
using POSSolution.Infrastructure;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace POSSolution.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemController : BaseController<Item>
    {
        private readonly POSContext _context;
        public ItemController(POSContext context) : base(context)
        {
            _context = context;
        }
        [NonAction]
        public override Task<ActionResult<Item>> GetAsync([FromRoute] int id)
        {
            return base.GetAsync(id);
        }
        [HttpGet("{id}")]
        public new async Task<ActionResult<ItemDetails>> ItemDetailsAsync([FromRoute] int id)
        {
            try
            {
              var result =  _context.Items.Join(
                   _context.PurchaseDetails,

                   item => item.Id,
                   purchaseDetails => purchaseDetails.ItemId,
                   (item, PurchaseDetails) => new { item, PurchaseDetails }
                   ).Join(
                        _context.StockCounts,
                        itemCombined => itemCombined.item.Id,
                        stock => stock.ItemId,
                        (itemCombined, stock) => new ItemDetails{
                            ItemId = itemCombined.item.Id,
                            ItemName = itemCombined.item.Name,
                            UnitPrice = 100,
                            DiscountAmount = itemCombined.PurchaseDetails.DiscountAmount,
                            TaxAmount = itemCombined.PurchaseDetails.TaxAmount,
                            SalesPrice = itemCombined.PurchaseDetails.SalesPrice,
                            StockQty = stock.Balance

                        }

                    );


                if (result != null)
                {
                    return Ok(result);
                }
                else
                {
                    return NotFound($"{id} not found");
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error retrieving data from the database");
            }
        }
        
    }
}
