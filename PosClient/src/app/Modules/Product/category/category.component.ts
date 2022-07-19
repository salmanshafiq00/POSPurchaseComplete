import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/Core/Models/category.model';
import { DataListRepositoryService } from 'src/app/Core/Services/data-list-repository.service';
import { RestDataService } from 'src/app/Core/Services/rest.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  private url: string = "http://localhost:5000/api/";

  constructor(private service: RestDataService, public repo : DataListRepositoryService,) {

    if (this.repo.categoryData ==undefined) {
        this.repo.categoryData =  this.getDataAll();
    }
  }

  ngOnInit(): void {
  }

  getDataAll(): Category[] {
     return  this.repo.getRecords("category");
  }

  deleteRow(id: number) {
    var record = this.repo.categoryData.find(w => w.id == id);
    this.service.Delete<Category>(this.url + "category/" + record.id).subscribe(res => {
      alert("Data deleted");
      this.repo.categoryData.splice(this.repo.categoryData.indexOf(record));
    });
  }
}
