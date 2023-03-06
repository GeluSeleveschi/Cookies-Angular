import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private cookieService: CookieService) { }

  public getAllProducts() {
    const productsFromCookie = this.cookieService.get('products');
    if (productsFromCookie && productsFromCookie != '') {
      let products = JSON.parse(productsFromCookie);
      return products;
    }

    return [];
  }

  public getProduct(id: number) {
    let products = this.getAllProducts() as Product[];
    if (products && products.length) {
      const product = products.find(p => p.productId == id)
      return product;
    }
    return null;
  }

  public deleteProduct(id: number): Product[] {
    let products = this.getAllProducts() as Product[];
    if (products && products.length) {
      products = products.filter(prod => prod.productId != id);
    }

    this.cookieService.set('products', JSON.stringify(products));

    return products;
  }

  saveProducts(products: Product[]) {
    this.cookieService.set('products', JSON.stringify(products), this.setCookieExpirationDate());
  }

  getId(): number {
    let productId = 1;
    const lastProductId = this.cookieService.get('lastProductId');
    if (lastProductId) {
      productId = Number(lastProductId) + 1;
    }

    this.cookieService.set('lastProductId', JSON.stringify(productId), this.setCookieExpirationDate());

    return productId;
  }

  setCookieExpirationDate(): Date {
    const dateNow = new Date();
    dateNow.setDate(dateNow.getDate() + 7);
    return dateNow;
  }

}
