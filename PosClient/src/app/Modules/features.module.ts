import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationModule } from './Location/location.module';
import { PeopleModule } from './People/people.module';
import { ProductModule } from './Product/product.module';
import { CompanyModule } from './Company/company.module';
import { PurchaseModule } from './Purchase/purchase.module';
import { SalesModule } from './Sales/sales.module';
import { DataListRepositoryService } from '../Core/Services/data-list-repository.service';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule, CompanyModule,  LocationModule, PeopleModule , ProductModule, PurchaseModule , SalesModule
  ],
  providers: [DataListRepositoryService]
})
export class FeaturesModule { }
