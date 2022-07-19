import { Component, OnInit } from '@angular/core';
import { Brand } from 'src/app/Core/Models/brand.model';
import { DataListRepositoryService } from 'src/app/Core/Services/data-list-repository.service';
import { RestDataService } from 'src/app/Core/Services/rest.service';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css']
})
export class BrandComponent implements OnInit {

  private url: string = "http://localhost:5000/api/";

  constructor(private service: RestDataService, public repo : DataListRepositoryService,) {
    
    if (this.repo.brandData ==undefined) {
        this.repo.brandData =  this.getDataAll();
    }
  }

  ngOnInit(): void {
  }

  getDataAll(): Brand[] {
     return  this.repo.getRecords("brand");
  }

  deleteRow(id: number) {
    var record = this.repo.brandData.find(w => w.id == id);
    this.service.Delete<Brand>(this.url + "brand/" + record.id).subscribe(res => {
      alert("Data deleted");
      this.repo.brandData.splice(this.repo.brandData.indexOf(record));
    });
  }
}
