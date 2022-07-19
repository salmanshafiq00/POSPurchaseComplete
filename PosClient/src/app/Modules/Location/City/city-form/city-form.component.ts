import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { City } from 'src/app/Core/Models/city.model';
import { Country } from 'src/app/Core/Models/country.model';
import { State } from 'src/app/Core/Models/state.model';
import { DataListRepositoryService } from 'src/app/Core/Services/data-list-repository.service';
import { RestDataService } from 'src/app/Core/Services/rest.service';

@Component({
  selector: 'app-city-form',
  templateUrl: './city-form.component.html',
  styleUrls: ['./city-form.component.css']
})
export class CityFormComponent implements OnInit {

  private url: string = "http://localhost:5000/api/";
  public routeData?= Number(location.pathname.split('/')[3]);
  formData: City = new City();
  constructor(private service: RestDataService, private repo: DataListRepositoryService, private route: Router) {
  }

  getDataAll(): Country[] {
    return this.repo.getRecords("country");
  }

  getEdit() {
    if (this.routeData > 0) {
      this.formData = this.repo.cityData.find(f => f.id == this.routeData);
    }
  }


  submit(form: NgForm) {
    if (form.valid) {
      if (this.routeData > 0) {
        this.service.Update<City>(this.formData, this.url + "city/" + this.routeData).subscribe(res => {
          alert("Data updated");
          var index = this.repo.cityData.indexOf(this.formData);
          this.repo.cityData.splice(index, 1, this.formData);
          this.route.navigateByUrl("city");
        })
      } else {
        this.service.Insert<City>(this.formData, this.url + "city").subscribe(res => {
          alert("Data Inserted");
          this.repo.cityData.push(res);
        })
      }
    }

  }

  countryList: Country[];
  stateList: State[];

  getAllCountry() {
    if (this.repo.countryData == undefined) {
      this.service.GetAll<Country>(this.url + "country").subscribe(res => {this.countryList = res, this.repo.countryData = res});
    }
    else{
      this.countryList = this.repo.countryData;
    }
    
  }
  getAllState(id: any) {
    this.service.GetAll<State>(this.url + "state").subscribe(res => this.stateList = res.filter(a => a.countryId == id.value));
  }

  ngOnInit(): void {
    this.getEdit();
    this.getAllCountry();
  }
}
