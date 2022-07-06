using POSSolution.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace POSSolution.API.DTO
{
    public class PurchaseReturnInvoice
    {
        public PurchaseReturn  PurchaseReturn { get; set; }
        public PurchaseReturnDetails[] PurchaseReturnDetails { get; set; }
    }
}
