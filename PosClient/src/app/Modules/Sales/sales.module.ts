import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SalesComponent } from './sales.component';
import { SalesFormComponent } from './sales-form/sales-form.component';
import { SalesReturnComponent } from './SalesReturn/sales-return.component';
import { SalesReturnFormComponent } from './SalesReturn/sales-return-form/sales-return-form.component';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { PosComponent } from '../Pos/pos.component';
import { RouterModule } from '@angular/router';
import { SalesStatusNamePipe } from 'src/app/Shared/Pipe/sales-status-name.pipe';

const salesComponentsArray = [
  SalesComponent, SalesFormComponent, SalesReturnComponent, SalesReturnFormComponent, PosComponent
]

@NgModule({
  declarations: [
    salesComponentsArray, SalesStatusNamePipe
  ],
  imports: [
    CommonModule, FormsModule, NgbTypeaheadModule, RouterModule, NgbModule
  ], exports: [
    salesComponentsArray
  ]
})
export class SalesModule { }
