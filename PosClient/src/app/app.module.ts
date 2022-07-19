import {  HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RestDataService } from './Core/Services/rest.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { FeaturesModule } from './Modules/features.module';
import { LayoutModule } from './Shared/layout/layout.module';
import { SearchComponent } from './search/search.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FeaturesModule ,
    DashboardModule, 
    LayoutModule,
    FormsModule, HttpClientModule, NgbModule
  ],
  providers: [RestDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
