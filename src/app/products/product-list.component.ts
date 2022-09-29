import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { CriteriaComponent } from '../shared/criteria/criteria.component';

import { IProduct } from './product';
import { ProductParameterService } from './product-parameter.service';
import { ProductService } from './product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit, AfterViewInit {
  pageTitle = 'Product List';
  includeDetail: boolean = true;

  // @ViewChild('filterCriteria') filterComponent: CriteriaComponent; //OR
  @ViewChild(CriteriaComponent) filterComponent: CriteriaComponent;
  parentListFilter: string;

  imageWidth = 50;
  imageMargin = 2;
  errorMessage = '';

  get showImage(): boolean {
    return this.productParameterService.showImage;
  }

  set showImage(value: boolean) {
    this.productParameterService.showImage = value;
  }

  filteredProducts: IProduct[] = [];
  products: IProduct[] = [];

  constructor(
    private productService: ProductService,
    private productParameterService: ProductParameterService
  ) {}

  ngAfterViewInit(): void {
    this.parentListFilter = this.filterComponent.listFilter;
  }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(
      (products: IProduct[]) => {
        this.products = products;
        this.filterComponent.listFilter = this.productParameterService.filterBy;
      },
      (error: any) => (this.errorMessage = <any>error)
    );

    //   {
    //   next: (products) => {
    //     this.products = products;
    //     this.performFilter(this.parentListFilter);
    //   },
    //   error: (err) => (this.errorMessage = err),
    // });
  }

  onValueChange(value: string): void {
    this.productParameterService.filterBy = value;
    this.performFilter(value);
  }

  toggleImage(): void {
    this.showImage = !this.showImage;
  }

  performFilter(filterBy?: string): void {
    if (filterBy) {
      this.filteredProducts = this.products.filter(
        (product) =>
          product.productName
            .toLocaleLowerCase()
            .indexOf(filterBy.toLocaleLowerCase()) !== -1
      );
    } else {
      this.filteredProducts = this.products;
    }
  }
}
