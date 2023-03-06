import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Product } from '../product.model';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.css']
})
export class AddEditProductComponent implements OnInit {
  productForm: FormGroup;
  product: Product;
  products: Product[] = [];
  selectedFile: File;
  imageUrl: string | ArrayBuffer | null;

  constructor(private fb: FormBuilder, private cookieService: CookieService, private route: ActivatedRoute,
    private productService: ProductService, private router: Router) { }

  ngOnInit() {
    this.createForm();
    this.getProducts();
    this.getProductToEdit();
  }

  createForm() {
    this.productForm = this.fb.group({
      productId: new FormControl(),
      productName: new FormControl(null),
      price: new FormControl(),
      quantity: new FormControl(),
      image: new FormControl(),
    });
  }

  onSubmit(currentProduct: any) {
    if (this.productForm.invalid) return;
    const productModel = { ...currentProduct, ...this.product };

    if (currentProduct.productId && currentProduct.productId != 0) {
      this.products = this.products.map(prod => {
        if (prod.productId == currentProduct.productId) {
          prod.productName = currentProduct.productName,
            prod.price = currentProduct.price,
            prod.quantity = currentProduct.quantity
        }
        return prod;
      })
    } else {
      productModel.productId = this.productService.getId();
      this.products.push(productModel);
    }
    this.productService.saveProducts(this.products);
    this.router.navigate(['']);
  }

  getProducts() {
    const products = this.cookieService.get("products");
    if (products && products != '') {
      this.products = JSON.parse(products);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.productForm.get('image')?.setValue(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
    }
  }

  getProductToEdit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.product = this.productService.getProduct(id) as Product;
      this.patchValues(this.product);
    }
  }

  patchValues(product: Product) {
    this.productForm.patchValue(product);
  }
}
