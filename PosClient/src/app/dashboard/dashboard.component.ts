import { Component, OnInit } from '@angular/core';
import { Customer } from '../Core/Models/customer.model';
import { Purchase } from '../Core/Models/purchase.model';
import { Sales } from '../Core/Models/sales.model';
import { Supplier } from '../Core/Models/supplier.model';
import { DataListRepositoryService } from '../Core/Services/data-list-repository.service';
import { RestDataService } from '../Core/Services/rest.service';
import { ItemWithPriceVM } from '../Core/ViewModel/ItemWithPriceVM.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private url : string = "http://localhost:5000/api/";

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  public barChartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  public barChartType= 'bar';
  public barChartLegend = true;

  public barChartData = [
    {data: [65, 66,32,43,78,32,78,33,66,12,11,23], label: 'Purchase'},
    {data: [44,56,23,67,33,89,22,1,67,90,35,24], label: 'Sales'}
  ];
  constructor(private repo : DataListRepositoryService, private service : RestDataService) {
    this.getDashboardInfo();
    this.getSupplierLength();
    this.getPurchaseLength();
    this.getSalesLength();
  }

  customerCount : number = 0;
  supplierCount : number = 0;
  purchaseCount : number = 0;
  salesCount : number = 0;
  sumOfPurchase : number = 0.00;
  sumOfTodaysPurchase : number = 0.00;
  sumOfPurchaseDue : number = 0;
  sumOfSales : number = 0;
  sumOfTodaysSales : number = 0;
  sumOfSalesDue : number = 0;

  tableData : ItemWithPriceVM[];

private getAllItemWithPrice() {
    this.service
      .GetAll<ItemWithPriceVM>(this.url + 'item/ItemWithPrice')
      .subscribe(res => {this.tableData = res.filter(e => e.stockQty <= 15)});
     
  }
  ngOnInit(): void {
    this.getAllItemWithPrice();
  }

  getDashboardInfo(){
    this.service.GetAll<Customer>(this.url+"customer").subscribe(res => this.customerCount = res.length);
  }

  getSupplierLength(){
    this.service.GetAll<Supplier>(this.url+"supplier").subscribe(res => this.supplierCount = res.length);
  }

  getPurchaseLength(){
    this.service.GetAll<Purchase>(this.url+"purchase").subscribe(res => {
      this.purchaseCount = res.length;

      this.sumOfPurchase = res.reduce((prevValue, currentValue)=>{
        return prevValue+currentValue.grandTotal;
      },0);

      this.sumOfTodaysPurchase = res.filter(e => new Date(e.purchaseDate).toDateString() == new Date().toDateString()).reduce((preValue, currValue)=>{
        return preValue+currValue.grandTotal;
      },0);

      this.sumOfPurchaseDue = res.filter(e => e.status.toString()== "1").reduce((preValue, curValue) => {
        return preValue + curValue.grandTotal
      }, 0);
    });
    // console.log(this.sumOfTodaysPurchase);
  }

  getSalesLength(){
    this.service.GetAll<Sales>(this.url+"sales").subscribe(res => {
      this.salesCount = res.length;

      this.sumOfSales = res.reduce((preValue, curValue)=>{
        return preValue + curValue.grandTotal
      }, 0);

      this.sumOfTodaysSales = res.filter(e => new Date(e.salesDate).toDateString() == new Date().toDateString()).reduce((preValue, curValue) => {
        return preValue + curValue.grandTotal
      }, 0);

      this.sumOfSalesDue = res.filter(e => e.status.toString().toLowerCase() == "pending").reduce((preValue, curValue) => {
        return preValue + curValue.grandTotal
      }, 0);
    });
  }



}
