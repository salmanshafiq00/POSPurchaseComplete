import { Component, OnInit } from '@angular/core';
import { DataListRepositoryService } from 'src/app/Core/Services/data-list-repository.service';
import { RestDataService } from 'src/app/Core/Services/rest.service';
import {Employee} from 'src/app/Core/Models/employee.model'

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  constructor(private service: RestDataService, public repo : DataListRepositoryService) { }

  private url : string = "http://localhost:5000/api/";
  ngOnInit(): void {
    if(this.repo.employeeData == undefined){
      this.repo.employeeData = this.getAllData();
    }
  }

  getAllData() : Employee[]{
    return this.repo.getRecords("employee");
  }

  deleteRow(id : number){
    var record = this.repo.employeeData.find(e => e.id == id);
    this.service.Delete<Employee>(this.url + "employee/" + record.id).subscribe(res => {
      alert("Data Deleted Successfull");
    });
    this.repo.employeeData.splice(this.repo.employeeData.indexOf(record));
  }

  
}
