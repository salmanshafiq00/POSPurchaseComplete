import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyComponent } from './company.component';
import { CompanyFormComponent } from './company-form/company-form.component';
import { FormsModule } from '@angular/forms';

const CompanyConponentsArray = [
  CompanyComponent, CompanyFormComponent

]


@NgModule({
  declarations: [
    CompanyConponentsArray
  ],
  imports: [
    CommonModule, FormsModule
  ], exports:[
    CompanyConponentsArray
  ]

})
export class CompanyModule { }
