import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataListRepositoryService } from 'src/app/Core/Services/data-list-repository.service';
import { RestDataService } from 'src/app/Core/Services/rest.service';
import { Customer } from 'src/app/Core/Models/customer.model';
import { Item } from 'src/app/Core/Models/item.model';
import { Sales } from 'src/app/Core/Models/sales.model';
import { SalesStatus } from 'src/app/Core/Enums/sales-status.enum';
import { merge, Observable, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';
import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sales-form',
  templateUrl: './sales-form.component.html',
  styleUrls: ['./sales-form.component.css']
})
export class SalesFormComponent implements OnInit {

  public customerList : Customer[];
  public itemList : string[] = [];
  formData : Sales = new Sales();
  public salesStatusEnum : SalesStatus;
  public statusArray = [];
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  
  model: any;

  private url : string = "http://localhost:5000/api/";

  constructor(private service : RestDataService, private repo: DataListRepositoryService, private route: Router) { 
    this.statusArray = Object.keys(SalesStatus).filter(key => isNaN(+key));
  }
  
  public routeData? = Number(location.pathname.split('/')[3]);

  @ViewChild('instance', {static: true}) instance: NgbTypeahead;

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;
    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.itemList
        : this.itemList.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }

  
  getDataAll() {
    if (this.routeData > 0) {

      this.formData = this.repo.salesData.find(f => f.id == this.routeData);
    }
  }


  submit(form : NgForm){
    if (form.valid) {
      if (this.routeData > 0) {

        this.service.Update<Sales>(this.formData, this.url+"sales/" + this.routeData).subscribe(res => {
          alert("Data updated");
          var index = this.repo.salesData.indexOf(this.formData);
          this.repo.salesData.splice(index, 1, res);
          this.route.navigateByUrl("sales");
        })
      }else{
        this.service.Insert<Sales>(this.formData, this.url+"sales").subscribe(res => {
          this.repo.salesData.push(res);
          alert("Data Inserted");
        })
      }
    }

  }

 
  getAllCustomers(){
    this.service.GetAll<Customer>(this.url + "customer").subscribe(res => this.customerList = res);
  }
  getAllItems(){
    this.service.GetAll<Item>(this.url+"item").subscribe(res => {
     res.forEach( w=> this.itemList.push(w.name))});
  }


  public salesQty:number = 1;
  decrement_qty(){
    if(this.salesQty> 1){
      this.salesQty -= 1;
    }
    
  }
  increment_qty(){
    this.salesQty +=1;
  }

  ngOnInit(): void {
    this.getAllCustomers();
    this.getAllItems();
  }
}
