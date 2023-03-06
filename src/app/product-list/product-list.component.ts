import { Component, OnInit } from '@angular/core';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  emptyList = true;
  productList: Product[] = [];
  displayedColumns: string[] = ['productId', 'productName', 'price', 'quantity', 'action', 'delete-action'];
  dataSource = new MatTableDataSource(this.productList);

  constructor(private productService: ProductService, matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    this.addSvgIcons(matIconRegistry, domSanitizer);
  }

  ngOnInit(): void {
    this.productList = this.productService.getAllProducts();
    if (this.productList.length)
      this.emptyList = false;
      
    this.dataSource = new MatTableDataSource(this.productList);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  addSvgIcons(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    matIconRegistry.addSvgIcon('edit-pencil', domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/edit-pencil-color.svg"));
    matIconRegistry.addSvgIcon('add-product', domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/plus-black-icon.svg"));
  }

  deleteProduct(id: number) {
    this.productList = this.productService.deleteProduct(id);
    this.dataSource = new MatTableDataSource(this.productList);
    if (!this.productList.length)
      this.emptyList = true;
  }

}
