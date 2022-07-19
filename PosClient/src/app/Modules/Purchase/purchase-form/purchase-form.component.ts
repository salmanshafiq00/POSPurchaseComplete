import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { OperatorFunction, Observable, debounceTime, distinctUntilChanged, filter, map } from 'rxjs';
import { PurchaseStatus } from 'src/app/Core/Enums/purchase-status.enum';
import { Item } from 'src/app/Core/Models/item.model';
import { PurchaseDetails } from 'src/app/Core/Models/purchase-details.model';
import { Purchase } from 'src/app/Core/Models/purchase.model';
import { PurchaseBody } from 'src/app/Core/Models/purchaseFormModel';
import { Supplier } from 'src/app/Core/Models/supplier.model';
import { DataListRepositoryService } from 'src/app/Core/Services/data-list-repository.service';
import { RestDataService } from 'src/app/Core/Services/rest.service';

@Component({
  selector: 'app-purchase-form',
  templateUrl: './purchase-form.component.html',
  styleUrls: ['./purchase-form.component.css']
})
export class PurchaseFormComponent implements OnInit {

  public supplierList : Supplier[];
  public itemList : Item[] = [];
  public itemListForBody : Item[] = [];
  public model: Item;
  formData : Purchase = new Purchase();

  
  puchaseDetails : PurchaseDetails = new PurchaseDetails();
  formBodyArray : PurchaseDetails[] = new Array<PurchaseDetails>();
  public purchaseStatusEnum : PurchaseStatus;
  public statusArray = [];
  public routeData? = Number(location.pathname.split('/')[3]);
  private url : string = "http://localhost:5000/api/";

  constructor(private service : RestDataService, private repo: DataListRepositoryService, private route: Router) { 
    this.statusArray = Object.keys(PurchaseStatus).filter(key => isNaN(+key));
    this.formData.subTotal = 0;
    //this.formBody.quatity=1;
  }
  
  getAllItem(){
    this.service.GetAll<Item>(this.url+"item").subscribe(res => {
      this.itemList = res;
   })
  }
 
   
  getAllSuppliers(){
    this.service.GetAll<Supplier>(this.url + "supplier").subscribe(res => this.supplierList = res);
  }

  getEditData() {
    if (this.routeData > 0) {
        console.log("for update");
        
    }
  }

  // For search operation
  formatter = (item: Item) => item.name;

  search: OperatorFunction<string, readonly Item[]> = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => this.itemList.filter(state => new RegExp(term, 'mi').test(state.name)).slice(0, 10))
  )

  //formBody : PurchaseDetails = new PurchaseDetails();
  formBody : PurchaseBody[] = [];
  formBodySingle : PurchaseBody = new PurchaseBody;

  SelectedItem(item : Item){
    console.log(item);
    this.formBodySingle.name = item.name;
    this.formBody.push(Object.assign(this.formBodySingle));
    console.log(this.formBody);

    
    // this.formBodyArray.push({id: item.id, quantity: 1, unitCost: 0, totalAmount: 0, purchaseId:0, itemId:1,   expireDate: this.formBody.expireDate});
    // console.log(this.formBodyArray);
  }

  submit(form : NgForm){

    // this.formData =  {id: 0, invoiceNo: this.formData.invoiceNo, totalQuantity: 10, subTotal: 10000, otherCharges: this.formData.otherCharges, grandTotal: 100000,  supplierId: this.formData.supplierId, purchaseDate: this.formData.purchaseDate, status: this.formData.status, note: this.formData.note, purchaseDetails: [{id: 0, quantity: this.formBody.quantity, unitCost: this.formBody.unitCost, totalAmount: 3000, discountAmount: 0, taxAmount: 0, purchaseId:0, itemId:1, profitAmount: 0, salesPrice: 0, expireDate: this.formBody.expireDate, soldQty:0}]};

    console.log(this.formData);
     if (form.valid) {
      if (this.routeData > 0) {

        this.service.Update<Purchase>(this.formData, this.url+"purchase/" + this.routeData).subscribe(res => {
          alert("Data updated");
         var index = this.repo.purchaseData.indexOf(this.formData);
         this.repo.purchaseData.splice(index, 1, res);
          this.route.navigateByUrl("purchase");
        })
      }else{
        this.service.Insert<Purchase>(this.formData, this.url+"purchase").subscribe(res => {
          alert("Data Inserted");
        this.repo.purchaseData.push(res);
        })
      }
     }
  }


  // For Quantity increment and decrement
  decrement_qty(i: number){
    // if(this.formBody.quantity> 1){
    //   this.formBody[i].quantity -= 1;
    // }
    
  }
  increment_qty(i: number){
    // this.formBody[i].quantity +=1;
  }

  ngOnInit(): void {
    this.getAllSuppliers();
    this.getAllItem();
    this.getEditData();
  }
}
