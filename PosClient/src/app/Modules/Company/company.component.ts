import { Component, OnInit } from '@angular/core';
import { CompanyInfo } from 'src/app/Core/Models/company-info.model';

import { DataListRepositoryService } from 'src/app/Core/Services/data-list-repository.service';
import { RestDataService } from 'src/app/Core/Services/rest.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
    constructor(private service: RestDataService, public repo : DataListRepositoryService) { }
  
    private url : string = "http://localhost:5000/api/";
    ngOnInit(): void {
      if(this.repo.companyData == undefined){
        this.repo.companyData = this.getAllData();
      }
    }
  
    getAllData() : CompanyInfo[]{
      return this.repo.getRecords("companyinfo");
    }
  
    deleteRow(id : number){
      var record = this.repo.companyData.find(e => e.id == id);
      this.service.Delete<CompanyInfo>(this.url + "companyinfo/" + record.id).subscribe(res => {
        alert("Data Deleted Successfully");
        this.repo.companyData.splice(this.repo.companyData.indexOf(record));
      });
    }
  
    
  }
  