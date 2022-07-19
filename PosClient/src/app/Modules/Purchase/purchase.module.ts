import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseComponent } from './purchase.component';
import { PurchaseFormComponent } from './purchase-form/purchase-form.component';
import { PurchaseReturnDetails } from 'src/app/Core/Models/purchase-return-details.model';
import { PurchaseReturnFormComponent } from './PurchaseReturn/purchase-return-form/purchase-return-form.component';
import { PurchasereturnComponent } from './PurchaseReturn/purchasereturn.component';
import { FormsModule } from '@angular/forms';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ToNumberPipe } from 'src/app/Shared/Pipe/to-number.pipe';


const purchaseComponentsArray =[
  PurchaseComponent, PurchaseFormComponent, PurchasereturnComponent, PurchaseReturnFormComponent
]

@NgModule({
  declarations: [
    purchaseComponentsArray, ToNumberPipe
  ],
  imports: [
    CommonModule, FormsModule, NgbTypeaheadModule
  ], exports:[purchaseComponentsArray]
})
export class PurchaseModule { }
