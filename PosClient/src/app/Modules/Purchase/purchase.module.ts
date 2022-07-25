import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PurchaseComponent } from './purchase.component';
import { PurchaseFormComponent } from './purchase-form/purchase-form.component';
import { PurchaseReturnFormComponent } from './PurchaseReturn/purchase-return-form/purchase-return-form.component';
import { PurchasereturnComponent } from './PurchaseReturn/purchasereturn.component';
import { FormsModule } from '@angular/forms';
import {NgbDropdownModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { ToEnumNamePipe } from 'src/app/Shared/Pipe/to-enum-name.pipe';
import { PurchaseStatusNamePipe } from 'src/app/Shared/Pipe/purchase-status-name.pipe';


const purchaseComponentsArray =[
  PurchaseComponent, PurchaseFormComponent, PurchasereturnComponent, PurchaseReturnFormComponent
]

@NgModule({
  declarations: [
    purchaseComponentsArray, PurchaseStatusNamePipe
  ],
  imports: [
    CommonModule, FormsModule, NgbTypeaheadModule, RouterModule, NgbDropdownModule
  ], 
  providers:[
    DatePipe
  ],
  exports:[purchaseComponentsArray]
})
export class PurchaseModule { }
