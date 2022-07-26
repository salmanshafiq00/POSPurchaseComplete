import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import {
  OperatorFunction,
  Observable,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
} from 'rxjs';
import { PurchaseStatus } from 'src/app/Core/Enums/purchase-status.enum';
import { Item } from 'src/app/Core/Models/item.model';
import { Purchase } from 'src/app/Core/Models/purchase.model';
import { Supplier } from 'src/app/Core/Models/supplier.model';
import { DataListRepositoryService } from 'src/app/Core/Services/data-list-repository.service';
import { RestDataService } from 'src/app/Core/Services/rest.service';

@Component({
  selector: 'app-purchase-form',
  templateUrl: './purchase-form.component.html',
  styleUrls: ['./purchase-form.component.css'],
})
export class PurchaseFormComponent implements OnInit {
  public singleItemEntity: Item;
  public formData: Purchase = new Purchase();
  public purchaseStatusEnum: PurchaseStatus;
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
    this.statusArray = Object.keys(PurchaseStatus).filter((key) => isNaN(+key));
    this.getEditData();
    this.getAllItem();
  }

  getEditData() {

    if (this.routeData > 0) {
      if (this.repo.purchaseData.find(f => f.id == this.routeData) == undefined) {
        this.formData = new Purchase();
      }
      else{
        this.service.GetOne<Purchase>(this.url + "purchase/"+ this.routeData)
        .subscribe(res => 
          {
            this.formData = res;
            this.formData.purchaseDate = this.datePipe.transform(res.purchaseDate, 'yyyy-MM-dd');
            for (let index = 0; index < this.formData.purchaseDetails.length; index++) {
               for (let index = 0; index < res.purchaseDetails.length; index++) {
                this.formData.purchaseDetails[index].expireDate = this.datePipe.transform(res.purchaseDetails[index].expireDate, 'yyyy-MM-dd');                
               }              
            }
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
      this.formData.purchaseDetails.push({
        id: 0,
        quantity: 1,
        unitCost: 0,
        totalAmount: 0,
        discountAmount: 0,
        taxAmount: 0,
        purchaseId: 0,
        itemId: item.id,
        profitAmount: 0,
        salesPrice: 0,
        expireDate: this.datePipe.transform(Date.now(), 'yyyy-MM-dd'),
        soldQty: 0,
      });
      this.calTotalQty();
    }
  }

  removeAttachedItem(index: number) {
    this.formData.purchaseDetails.splice(index, 1);
    this.calTotalQty();
    this.calSubAmount();
  }

  // Crud Operation methods
  submit(form: NgForm) {
    if (form.valid) {
      if (this.routeData > 0) {        
        this.service
          .Update<Purchase>(
            this.formData,
            this.url + 'purchase/' + this.routeData
          )
          .subscribe((res) => {
            alert('Data updated');
            var index = this.repo.purchaseData.indexOf(this.formData);
            this.repo.purchaseData.splice(index, 1, res);
            this.route.navigateByUrl('purchase');
          });
      } else {
        this.service
          .Insert<Purchase>(this.formData, this.url + 'purchase')
          .subscribe((res) => {
            alert('Data Inserted');
            this.repo.purchaseData.push(res);
          });
          form.reset();
      }
    }
  }

  // For Quantity increment and decrement
  decrement_qty(i: number) {
    if (this.formData.purchaseDetails[i].quantity > 1) {
      this.formData.purchaseDetails[i].quantity -= 1;
      this.calTotalQty();
      this.calSubAmount();
    }
  }

  increment_qty(i: number) {
    this.formData.purchaseDetails[i].quantity += 1;
    this.calTotalQty();
    this.calSubAmount();
  }

  changedQty(e: any, index: number) {
    this.formData.purchaseDetails[index].quantity = Number(
      (e as HTMLInputElement).value
    );
    this.formData.purchaseDetails[index].totalAmount =
      this.formData.purchaseDetails[index].quantity *
      this.formData.purchaseDetails[index].unitCost;
    this.calTotalQty();
    this.calSubAmount();
  }

  changedExpiredDate(e: any, index: number) {
    var newDate = this.datePipe.transform(
      new Date((e as HTMLInputElement).value),
      'yyyy-MM-dd'
    );
    this.formData.purchaseDetails[index].expireDate = newDate;
  }

  

  changedUnitCost(e: any, index: number) {
    this.formData.purchaseDetails[index].unitCost = Number(
      (e as HTMLInputElement).value
    );
    this.formData.purchaseDetails[index].totalAmount =
      this.formData.purchaseDetails[index].quantity *
      this.formData.purchaseDetails[index].unitCost;
    this.calSubAmount();
  }

  calTotalQty() {
    this.formData.totalQuantity = 0;
    for (let index = 0; index < this.formData.purchaseDetails.length; index++) {
      let oneQty = this.formData.purchaseDetails[index].quantity;
      this.formData.totalQuantity += Number(oneQty);
    }
  }

  calSubAmount() {
    this.formData.subTotal = 0;
    for (let index = 0; index < this.formData.purchaseDetails.length; index++) {
      let oneTotal =
        this.formData.purchaseDetails[index].quantity *
        this.formData.purchaseDetails[index].unitCost;
      this.formData.subTotal += Number(oneTotal);
    }
  }

  getItemName(id: number): string {
    if (this.formData.purchaseDetails != null) {
      return this.repo.itemData.find((e) => e.id == id).name;
    } else {
      return 'item';
    }
  }

  ngOnInit(): void {

    this.getAllSuppliers();
    this.formData.purchaseDate = this.datePipe.transform(Date.now(), 'yyyy-MM-dd');
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
