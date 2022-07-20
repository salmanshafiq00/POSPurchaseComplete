import { Pipe, PipeTransform } from '@angular/core';
import { Item } from 'src/app/Core/Models/item.model';
import { DataListRepositoryService } from 'src/app/Core/Services/data-list-repository.service';

@Pipe({
  name: 'toItemName'
})
export class ToItemNamePipe implements PipeTransform {

  itemList : Item[];
  constructor(private repo : DataListRepositoryService){
    this.itemList = this.repo.itemData;
  }
  transform(value: number, ...args: unknown[]): string {
    for (let index = 0; index < this.itemList.length; index++) {
      if(index == value){
        return this.repo.itemData[index].name;
      }
      
    }
    return "Hello";
  }

}
