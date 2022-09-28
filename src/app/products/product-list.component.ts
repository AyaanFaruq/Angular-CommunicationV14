import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { NgModel } from '@angular/forms';

import { IProduct } from './product';
import { ProductService } from './product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit, AfterViewInit {
  pageTitle = 'Product List';
  listFilter: string;
  showImage = false;

  imageWidth = 50;
  imageMargin = 2;
  errorMessage = '';

  @ViewChild('filterElement') filterElementref: ElementRef; // get access on the native element
  @ViewChild(NgModel) filterInput: NgModel; // don't have access on the native element

  filteredProducts: IProduct[] = [];
  products: IProduct[] = [];

  constructor(private productService: ProductService) {} 

  ngAfterViewInit(): void {
    this.filterInput.valueChanges?.subscribe(() =>
      this.performFilter(this.listFilter)
    );
  }

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.performFilter(this.listFilter);
      },
      error: (err) => (this.errorMessage = err),
    });
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
