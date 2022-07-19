import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { City } from 'src/app/Core/Models/city.model';
import { CompanyInfo } from 'src/app/Core/Models/company-info.model';
import { Country } from 'src/app/Core/Models/country.model';
import { State } from 'src/app/Core/Models/state.model';
import { DataListRepositoryService } from 'src/app/Core/Services/data-list-repository.service';
import { RestDataService } from 'src/app/Core/Services/rest.service';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css']
})
export class CompanyFormComponent implements OnInit {

  public countryList : Country[];
  public stateData : State[];
  public cityData : City[];
  public routeData? = Number(location.pathname.split('/')[3]);
  formData : CompanyInfo = new CompanyInfo();
  public logo : string = "/assets/Logo.PNG";
  private url : string = "http://localhost:5000/api/";

  constructor(private service : RestDataService, private repo: DataListRepositoryService, private route: Router) { }
  

  getDataAll() {   
    if (this.routeData > 0) {
      this.formData = this.repo.companyData.find(f => f.id == this.routeData);
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
        this.service.Update<CompanyInfo>(this.formData, this.url+"company/" + this.routeData).subscribe(res => {
          var index = this.repo.companyData.indexOf(this.formData);
          this.repo.companyData.splice(index, 1, res);
          alert("Data updated");
          this.route.navigateByUrl("company");
        })
      }else{
        this.service.Insert<CompanyInfo>(this.formData, this.url+"company").subscribe(res => {
          this.repo.companyData.push(res);
          alert("Data Inserted");
        });
      }
    }

  }

  onChange(event : any){

    if(event.target.files && event.target.files[0]){
      const reader = new FileReader();
      reader.onload = (e : any) => {
        this.formData.companyLogo = e.target.result;
        this.logo = e.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  ngOnInit(): void {
    this.getDataAll();
    this.getAllCountry();
  }

}
