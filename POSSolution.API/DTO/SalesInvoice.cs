using POSSolution.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace POSSolution.API.DTO
{
    public class SalesInvoice
    {
        public Sales Sales { get; set; }
        public SalesDetails[] SalesDetails { get; set; }
        public SalesPayment SalesPayment { get; set; }
    }
}
