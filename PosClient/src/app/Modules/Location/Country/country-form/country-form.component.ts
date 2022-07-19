import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/Core/Models/country.model';
import { DataListRepositoryService } from 'src/app/Core/Services/data-list-repository.service';
import { RestDataService } from 'src/app/Core/Services/rest.service';

@Component({
  selector: 'app-country-form',
  templateUrl: './country-form.component.html',
  styleUrls: ['./country-form.component.css']
})
export class CountryFormComponent implements OnInit {

  constructor(private service : RestDataService, private repo: DataListRepositoryService, private route: Router) { }
  private url : string = "http://localhost:5000/api/";
  public routeData? = Number(location.pathname.split('/')[3]);
  formData : Country = new Country();

  getDataAll() {
    if (this.routeData > 0) {
      this.formData = this.repo.countryData.find(f => f.id == this.routeData);
    }
  }


  submit(form : NgForm){
    if (form.valid) {
      if (this.routeData > 0) {
        this.service.Update<Country>(this.formData, this.url+"country/" + this.routeData).subscribe(res => {
          alert("Data updated");
          var index = this.repo.countryData.indexOf(this.formData);
          this.repo.countryData.splice(index, 1, this.formData);
          this.route.navigateByUrl("country");
        })
      }else{
        this.service.Insert<Country>(this.formData, this.url+"country").subscribe(res => {
          this.repo.countryData.push(res);
          alert("Data Inserted");
        })
      }
    }

  }

  ngOnInit(): void {
    this.getDataAll();
  }
}
