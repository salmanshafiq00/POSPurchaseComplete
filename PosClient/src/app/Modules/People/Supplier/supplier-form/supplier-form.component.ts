import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {  Router } from '@angular/router';
import { City } from 'src/app/Core/Models/city.model';
import { Country } from 'src/app/Core/Models/country.model';
import { State } from 'src/app/Core/Models/state.model';
import { Supplier } from 'src/app/Core/Models/supplier.model';
import { DataListRepositoryService } from 'src/app/Core/Services/data-list-repository.service';
import { RestDataService } from 'src/app/Core/Services/rest.service';

@Component({
  selector: 'app-supplier-form',
  templateUrl: './supplier-form.component.html',
  styleUrls: ['./supplier-form.component.css']
})
export class SupplierFormComponent implements OnInit {

  public countryList : Country[];
  public stateData : State[];
  public cityData : City[];
  public routeData? = Number(location.pathname.split('/')[3]);
  formData : Supplier = new Supplier();
  private url : string = "http://localhost:5000/api/";

  constructor(private service : RestDataService, private repo: DataListRepositoryService, private route: Router) { }
  

  getDataAll() {   
    if (this.routeData > 0) {
      this.formData = this.repo.supplierData.find(f => f.id == this.routeData);
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
        this.service.Update<Supplier>(this.formData, this.url+"supplier/" + this.routeData).subscribe(res => {
          var index = this.repo.supplierData.indexOf(this.formData);
          this.repo.supplierData.splice(index, 1, this.formData);
          alert("Data updated");
          this.route.navigateByUrl("supplier");
        })
      }else{
        this.service.Insert<Supplier>(this.formData, this.url+"supplier").subscribe(res => {
          this.repo.supplierData.push(res);
          alert("Data Inserted");
        });
      }
    }

  }

  ngOnInit(): void {
    this.getDataAll();
    this.getAllCountry();
  }
}
