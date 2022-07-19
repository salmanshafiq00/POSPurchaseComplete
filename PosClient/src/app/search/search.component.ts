import {Component} from '@angular/core';
import {Observable, OperatorFunction} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, filter} from 'rxjs/operators';
import { Item } from '../Core/Models/item.model';
import { DataListRepositoryService } from '../Core/Services/data-list-repository.service';
import { RestDataService } from '../Core/Services/rest.service';

type State = {id: number, name: string};



@Component({
  selector: 'app-searchComponent',
  templateUrl: './search.component.html',
  styles: [`.form-control { width: 300px; }`]
})
export class SearchComponent {
 
  constructor( private repo : RestDataService) {
      this.getAllItem();
  
  }

  getAllItem(){
    this.repo.GetAll<Item>(this.url+"item").subscribe(res => {
      this.Itemlist = res;
   })
  }

  private url : string = "http://localhost:5000/api/";
  public model: Item;

  Itemlist : Item[];
  formatter = (item: Item) => item.name;

  search: OperatorFunction<string, readonly Item[]> = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => this.Itemlist.filter(state => new RegExp(term, 'mi').test(state.name)).slice(0, 10))
  )

  abc(a: any){
    
    // if(a ==undefined){
    //   console.log(a);
    // }
    console.log(a);
    
    
  }

}