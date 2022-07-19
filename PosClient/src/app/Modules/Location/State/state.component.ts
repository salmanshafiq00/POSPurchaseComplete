import { Component, OnInit } from '@angular/core';
import { State } from 'src/app/Core/Models/state.model';
import { DataListRepositoryService } from 'src/app/Core/Services/data-list-repository.service';
import { RestDataService } from 'src/app/Core/Services/rest.service';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.css']
})
export class StateComponent implements OnInit {

  private url: string = "http://localhost:5000/api/";

  constructor(private service: RestDataService, public repo : DataListRepositoryService,) {

    if (this.repo.stateData ==undefined) {
        this.repo.stateData =  this.getDataAll();
    }
  }

  ngOnInit(): void {
  }

  getDataAll(): State[] {
     return  this.repo.getRecords("state");
  }

  deleteRow(id: number) {
    var record = this.repo.stateData.find(w => w.id == id);
    this.service.Delete<State>(this.url + "state/" + record.id).subscribe(res => {
      this.repo.stateData.splice(this.repo.stateData.indexOf(record));
      alert("Data deleted");
    });
  }
}
