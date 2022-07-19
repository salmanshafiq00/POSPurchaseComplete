import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { City } from 'src/app/Core/Models/city.model';
import { Country } from 'src/app/Core/Models/country.model';
import { Customer } from 'src/app/Core/Models/customer.model';
import { State } from 'src/app/Core/Models/state.model';
import { DataListRepositoryService } from 'src/app/Core/Services/data-list-repository.service';
import { RestDataService } from 'src/app/Core/Services/rest.service';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent implements OnInit {

  constructor(private service : RestDataService, private repo: DataListRepositoryService, private route: Router) { }
  private url : string = "http://localhost:5000/api/";
  public countryList : any;
  public stateData : any;
  public cityData : any;
  public routeData? = Number(location.pathname.split('/')[3]);
  formData : Customer = new Customer();

  getEdit() {
    
    if (this.routeData > 0) {
      this.formData = this.repo.customerData.find(f => f.id == this.routeData);
    }
    
  }
  getAllCountry(){
    if (this.repo.countryData == undefined) {
      this.service.GetAll<Country>(this.url + "country").subscribe(res => {this.countryList = res, this.repo.countryData = res});
    }else{
      this.countryList = this.repo.countryData;
    }

  }

  getAllState(countryId : number){
    if(this.repo.stateData ==undefined){
      this.service.GetAll<State>(this.url+"state").subscribe(res => {
      this.stateData = res.filter(e => e.countryId == countryId);
      });
    }else{
      this.stateData = this.repo.stateData.filter(e => e.countryId == countryId);
    }
    

  }

  getAllCity(stateId : number){
    if(this.repo.cityData == undefined){
      this.service.GetAll<City>(this.url+"city").subscribe(res => {
        this.cityData = res.filter(e => e.stateId == stateId);
      });
    }else{
      this.cityData = this.repo.cityData.filter(e => e.stateId == stateId);
    }
   
  }

  submit(form : NgForm){
    if (form.valid) {
      if (this.routeData > 0) {
          this.service.Update<Customer>(this.formData, this.url+"customer/" + this.routeData).subscribe(res => {
          alert("Data updated");
          var index = this.repo.customerData.indexOf(this.formData);
          this.repo.customerData.splice(index, 1, this.formData);
          this.route.navigateByUrl("customer");
        })
      }else{
        this.service.Insert<Customer>(this.formData, this.url+"customer").subscribe(res => {
          alert("Data Inserted");
          if (this.repo.customerData == undefined) {
              this.repo.getRecords("customer");
          }
          this.repo.customerData.push(res);
        });
      }
    }
  
  }

  ngOnInit(): void {
    this.getEdit();
    this.getAllCountry();
  }

}
