import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Brand } from 'src/app/Core/Models/brand.model';
import { Category } from 'src/app/Core/Models/category.model';
import { Item } from 'src/app/Core/Models/item.model';
import { SalesDiscountTax } from 'src/app/Core/Models/salesDiscountTax.model';
import { Unit } from 'src/app/Core/Models/unit.model';
import { DataListRepositoryService } from 'src/app/Core/Services/data-list-repository.service';
import { RestDataService } from 'src/app/Core/Services/rest.service';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css']
})
export class ItemFormComponent implements OnInit {


  constructor(private service: RestDataService, private repo: DataListRepositoryService, private route: Router) { }
  private url: string = "http://localhost:5000/api/";
  public routeData?= Number(location.pathname.split('/')[3]);
  formData: Item = new Item();

  getEdit() {
    if (this.routeData > 0) {
      this.formData = this.repo.itemData.find(f => f.id == this.routeData);
    }
  }


  submit(form: NgForm) {
    if (form.valid) {
      if (this.routeData > 0) {
        this.service.Update<Item>(this.formData, this.url + "item/" + this.routeData).subscribe(res => {
          alert("Data updated");
          var index = this.repo.itemData.indexOf(this.formData);
          this.repo.itemData.splice(index, 1, this.formData);
          this.route.navigateByUrl("item");
        })
      } else {
        this.formData.profitMargin = this.formData.profitMargin/100;
        this.service.Insert<Item>(this.formData, this.url + "item").subscribe(res => {
          alert("Data Inserted");
          this.repo.itemData.push(res);
        });
      }
    }

  }

  onChange(event : any){
    if(event.target.files && event.target.files[0]){
      const reader = new FileReader();
      reader.onload = (e : any) => {
        this.formData.imagePath = e.target.result;
        this.userImage = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  userImage : string = "\\assets\\product.jpg";

  categoryList: Category[];
  brandList: Brand[];
  unitList: Unit[];
  discountList: SalesDiscountTax[];

  getAllCategory() {
    if (this.repo.categoryData == undefined) {
      this.service.GetAll<Category>(this.url + "category").subscribe(res => {this.categoryList = res, this.repo.countryData = res});
    }else{

      this.categoryList = this.repo.categoryData;
    }
  }
  getAllBrand() {
    if (this.repo.brandData == undefined) {
      this.service.GetAll<Brand>(this.url + "brand").subscribe(res => {this.brandList = res, this.repo.brandData = res});
    }else{

      this.brandList = this.repo.brandData;
    }
  }

  getAllUnit() {
    if (this.repo.unitData == undefined) {
      this.service.GetAll<Unit>(this.url + "unit").subscribe(res => {this.unitList = res, this.repo.unitData = res});
    }else{

      this.unitList = this.repo.unitData;
    }
  }
  getAllDiscount() {
    if (this.repo.discountData == undefined) {

      // Todo todo doto
      // Todo todo doto
      // Todo todo doto
      this.service.GetAll<SalesDiscountTax>(this.url + "brand").subscribe(res => {this.discountList = res, this.repo.discountData = res});
    }else{
      this.brandList = this.repo.brandData;
    }
  }
  ngOnInit(): void {
    this.getEdit();
    this.getAllCategory();
    this.getAllBrand();
    this.getAllDiscount();
    this.getAllUnit();
  }

}