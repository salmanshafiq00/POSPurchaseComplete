import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PurchaseComponent } from './purchase.component';
import { PurchaseFormComponent } from './purchase-form/purchase-form.component';
import { PurchaseReturnFormComponent } from './PurchaseReturn/purchase-return-form/purchase-return-form.component';
import { FormsModule } from '@angular/forms';
import {NgbDropdownModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { PurchaseStatusNamePipe } from 'src/app/Shared/Pipe/purchase-status-name.pipe';
import { PurchaseDetailsComponent } from './purchase-details.component';
import { PurchaseReturnComponent } from './PurchaseReturn/purchasereturn.component';


const purchaseComponentsArray =[
  PurchaseComponent, PurchaseFormComponent, PurchaseReturnComponent, PurchaseReturnFormComponent
]

@NgModule({
  declarations: [
    purchaseComponentsArray, PurchaseStatusNamePipe, PurchaseDetailsComponent
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
