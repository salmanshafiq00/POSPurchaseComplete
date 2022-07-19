import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesComponent } from './sales.component';
import { SalesFormComponent } from './sales-form/sales-form.component';
import { SalesReturnComponent } from './SalesReturn/sales-return.component';
import { SalesReturnFormComponent } from './SalesReturn/sales-return-form/sales-return-form.component';
import { FormsModule } from '@angular/forms';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { PosComponent } from '../Pos/pos.component';

const salesComponentsArray = [
  SalesComponent, SalesFormComponent, SalesReturnComponent, SalesReturnFormComponent, PosComponent
]

@NgModule({
  declarations: [salesComponentsArray],
  imports: [
    CommonModule, FormsModule, NgbTypeaheadModule
  ], exports: [
    salesComponentsArray
  ]
})
export class SalesModule { }
