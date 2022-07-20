import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PurchaseComponent } from './purchase.component';
import { PurchaseFormComponent } from './purchase-form/purchase-form.component';
import { PurchaseReturnFormComponent } from './PurchaseReturn/purchase-return-form/purchase-return-form.component';
import { PurchasereturnComponent } from './PurchaseReturn/purchasereturn.component';
import { FormsModule } from '@angular/forms';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';


const purchaseComponentsArray =[
  PurchaseComponent, PurchaseFormComponent, PurchasereturnComponent, PurchaseReturnFormComponent
]

@NgModule({
  declarations: [
    purchaseComponentsArray
  ],
  imports: [
    CommonModule, FormsModule, NgbTypeaheadModule
  ], 
  providers:[
    DatePipe
  ],
  exports:[purchaseComponentsArray]
})
export class PurchaseModule { }
