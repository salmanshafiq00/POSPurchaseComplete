import { Component, OnInit } from '@angular/core';
import { CompanyInfo } from 'src/app/Core/Models/company-info.model';
import { Item } from 'src/app/Core/Models/item.model';
import { Purchase } from 'src/app/Core/Models/purchase.model';
import { Supplier } from 'src/app/Core/Models/supplier.model';
import { DataListRepositoryService } from 'src/app/Core/Services/data-list-repository.service';
import { RestDataService } from 'src/app/Core/Services/rest.service';

@Component({
  selector: 'app-purchase-details',
  templateUrl: './purchase-details.component.html',
  styleUrls: ['./purchase.component.css'],
})
export class PurchaseDetailsComponent implements OnInit {
  public purchaseInvoice: Purchase = new Purchase();
  public company: CompanyInfo = new CompanyInfo();
  public supplierInfo: Supplier = new Supplier();
  public routeData? = Number(location.pathname.split('/')[3]);

  private url: string = 'http://localhost:5000/api/';

  constructor(
    private service: RestDataService,
    public repo: DataListRepositoryService
  ) {
    this.getAllItem();
  }

  getItemName(id: number): string {
    if (this.repo.itemData != undefined) {
      return this.repo.itemData.find((e) => e.id == id).name;
    } else {
      return 'item';
    }
  }

  ngOnInit(): void {
    this.getPurchaseInvoice();

    this.getCompanyInfo();
  }

  private getPurchaseInvoice() {
    this.service
      .GetOne<Purchase>(this.url + 'purchase/' + this.routeData)
      .subscribe((res) => {
        if (res != undefined) {
          this.getSupplier(res.supplierId);
        }
        this.purchaseInvoice = res;
      });
  }

  private getCompanyInfo() {
    this.service
      .GetOne<CompanyInfo>(this.url + 'companyinfo/' + 2)
      .subscribe((res) => (this.company = res));
  }

  private getSupplier(id: number) {
    if (this.repo.supplierData.length == 0) {
      this.service
        .GetAll<Supplier>(this.url + 'supplier')
        .subscribe((res) => (this.supplierInfo = res.find((s) => s.id == id)));
    } else {
      this.supplierInfo = this.repo.supplierData.find((f) => f.id == id);
    }
  }

  private getAllItem() {
    if (this.repo.itemData.length == 0)
      this.service.GetAll<Item>(this.url + 'item').subscribe((res) => {
        this.repo.itemData = res;
      });
  }
}
