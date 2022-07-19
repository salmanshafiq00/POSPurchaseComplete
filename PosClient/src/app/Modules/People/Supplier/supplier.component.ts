import { Component, OnInit } from '@angular/core';
import { Supplier } from 'src/app/Core/Models/supplier.model';
import { RestDataService } from 'src/app/Core/Services/rest.service';
import { DataListRepositoryService } from 'src/app/Core/Services/data-list-repository.service';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent implements OnInit {

  private url: string = "http://localhost:5000/api/";

  constructor(private service: RestDataService, public repo : DataListRepositoryService) {
    
    if (this.repo.supplierData == undefined) {
        this.repo.supplierData =  this.getDataAll();
    }
  }

  getDataAll(): Supplier[] {
     return  this.repo.getRecords("supplier");
  }

  deleteRow(id: number) {
    var record = this.repo.supplierData.find(w => w.id == id);
    this.service.Delete<Supplier>(this.url + "supplier/" + record.id).subscribe(res => {
      alert("Data deleted");
    this.repo.supplierData.splice(this.repo.supplierData.indexOf(record));
    });
  }

  ngOnInit(): void {}
}
