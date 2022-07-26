import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { OperatorFunction, Observable, debounceTime, distinctUntilChanged, filter, map } from 'rxjs';
import { PurchaseReturnStatus } from 'src/app/Core/Enums/purchase-return-status.enum';
import { PurchaseStatus } from 'src/app/Core/Enums/purchase-status.enum';
import { Item } from 'src/app/Core/Models/item.model';
import { PurchaseReturn } from 'src/app/Core/Models/purchase-return.model';
import { Purchase } from 'src/app/Core/Models/purchase.model';
import { Supplier } from 'src/app/Core/Models/supplier.model';
import { DataListRepositoryService } from 'src/app/Core/Services/data-list-repository.service';
import { RestDataService } from 'src/app/Core/Services/rest.service';

@Component({
  selector: 'app-purchase-return-form',
  templateUrl: './purchase-return-form.component.html',
  styleUrls: ['./purchase-return-form.component.css']
})
export class PurchaseReturnFormComponent implements OnInit {

  public singleItemEntity: Item;
  public formData: PurchaseReturn = new PurchaseReturn();
  public statusArray = [];
  public routeData? = Number(location.pathname.split('/')[3]);
  public buttonMode : string = "Save";

  private url: string = 'http://localhost:5000/api/';

  constructor(
    private service: RestDataService,
    public repo: DataListRepositoryService,
    private route: Router,
    private datePipe: DatePipe
  ) {
    this.statusArray = Object.keys(PurchaseReturnStatus).filter((key) => isNaN(+key));
    this.getEditData();
    this.getAllItem();
  }

  getEditData() {

    if (this.routeData > 0) {
      if (this.repo.purchaseReturnData.find(f => f.id == this.routeData) == undefined) {
        this.formData = new PurchaseReturn();
      }
      else{
        this.service.GetOne<PurchaseReturn>(this.url + "purchaseReturn/"+ this.routeData)
        .subscribe(res => 
          {
            this.formData = res;
            this.formData.purchaseReturnDate = this.datePipe.transform(res.purchaseReturnDate, 'yyyy-MM-dd');
            // for (let index = 0; index < this.formData.purchaseReturnDetails.length; index++) {
            //    for (let index = 0; index < res.purchaseReturnDetails.length; index++) {
            //     this.formData.purchaseReturnDetails[index].expireDate = this.datePipe.transform(res.purchaseReturnDetails[index].expireDate, 'yyyy-MM-dd');                
            //    }              
            // }
          });
      }
      this.buttonMode = "Update";
    }

  }

  // For search operation
  formatter = (item: Item) => item.itemCode + " | " + item.name;

  search: OperatorFunction<string, readonly Item[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((term) => term.length >= 2),
      map((term) =>
        this.repo.itemData
          .filter((item) => new RegExp(term, 'mi').test(item.itemCode))
          .slice(0, 10)
      ) || map((term) =>
      this.repo.itemData
        .filter((item) => new RegExp(term, 'mi').test(item.name))
        .slice(0, 10)
    )
    );

  SelectedItem(item: Item) {
    if (item != undefined) {
      this.formData.purchaseReturnDetails.push({
        id: 0,
        itemId: item.id,
        quantity: 1,
        unitCost: 0,
        totalAmount: 0,
        purchaseReturnId: 0,
      });
      this.calTotalQty();
    }
  }

  removeAttachedItem(index: number) {
    this.formData.purchaseReturnDetails.splice(index, 1);
    this.calTotalQty();
    this.calSubAmount();
  }

  // Crud Operation methods
  submit(form: NgForm) {
    if (form.valid) {
      if (this.routeData > 0) {        
        this.service
          .Update<PurchaseReturn>(
            this.formData,
            this.url + 'purchaseReturn/' + this.routeData
          )
          .subscribe((res) => {
            alert('Data updated');
            var index = this.repo.purchaseReturnData.indexOf(this.formData);
            this.repo.purchaseReturnData.splice(index, 1, res);
            this.route.navigateByUrl('purchaseReturn');
          });
      } else {
        this.service
          .Insert<PurchaseReturn>(this.formData, this.url + 'purchaseReturn')
          .subscribe((res) => {
            alert('Data Inserted');
            this.repo.purchaseReturnData.push(res);
          });
          form.reset();
      }
    }
  }

  // For Quantity increment and decrement
  decrement_qty(i: number) {
    if (this.formData.purchaseReturnDetails[i].quantity > 1) {
      this.formData.purchaseReturnDetails[i].quantity -= 1;
      this.calTotalQty();
      this.calSubAmount();
    }
  }

  increment_qty(i: number) {
    this.formData.purchaseReturnDetails[i].quantity += 1;
    this.calTotalQty();
    this.calSubAmount();
  }

  changedQty(e: any, index: number) {
    this.formData.purchaseReturnDetails[index].quantity = Number(
      (e as HTMLInputElement).value
    );
    this.formData.purchaseReturnDetails[index].totalAmount =
      this.formData.purchaseReturnDetails[index].quantity *
      this.formData.purchaseReturnDetails[index].unitCost;
    this.calTotalQty();
    this.calSubAmount();
  }

  // changedExpiredDate(e: any, index: number) {
  //   var newDate = this.datePipe.transform(
  //     new Date((e as HTMLInputElement).value),
  //     'yyyy-MM-dd'
  //   );
  //   this.formData.purchaseReturnDetails[index].expireDate = newDate;
  // }

  

  changedUnitCost(e: any, index: number) {
    this.formData.purchaseReturnDetails[index].unitCost = Number(
      (e as HTMLInputElement).value
    );
    this.formData.purchaseReturnDetails[index].totalAmount =
      this.formData.purchaseReturnDetails[index].quantity *
      this.formData.purchaseReturnDetails[index].unitCost;
    this.calSubAmount();
  }

  calTotalQty() {
    this.formData.totalQuantity = 0;
    for (let index = 0; index < this.formData.purchaseReturnDetails.length; index++) {
      let oneQty = this.formData.purchaseReturnDetails[index].quantity;
      this.formData.totalQuantity += Number(oneQty);
    }
  }

  calSubAmount() {
    this.formData.subTotal = 0;
    for (let index = 0; index < this.formData.purchaseReturnDetails.length; index++) {
      let oneTotal =
        this.formData.purchaseReturnDetails[index].quantity *
        this.formData.purchaseReturnDetails[index].unitCost;
      this.formData.subTotal += Number(oneTotal);
    }
  }

  getItemName(id: number): string {
    if (this.formData.purchaseReturnDetails != null) {
      return this.repo.itemData.find((e) => e.id == id).name;
    } else {
      return 'item';
    }
  }

  ngOnInit(): void {

    this.getAllSuppliers();
    this.formData.purchaseReturnDate = this.datePipe.transform(Date.now(), 'yyyy-MM-dd');
  }

  private getAllItem() {

    if(this.repo.itemData.length == 0)
    this.service.GetAll<Item>(this.url + 'item').subscribe((res) => {
      this.repo.itemData = res;      
    })
  }

  private getAllSuppliers() {
    if (this.repo.supplierData.length == 0) {
      this.service
      .GetAll<Supplier>(this.url + 'supplier')
      .subscribe(res => this.repo.supplierData = res);      
    }
    
  }
}

