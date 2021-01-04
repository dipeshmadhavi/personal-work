import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ValidationService } from '../validation.service';
import { ProductService } from '../product.service';
import { Constants } from '../app.constants';
import { Router } from '@angular/router';
import { ProductInterface } from '../interfaces';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  public addProductForm: FormGroup;
  public sizes: string[] = ['Small', 'Medium', 'large'];
  public selectedColours: string[] = [];
  public newColor: string = '';
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly productService: ProductService,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    this.initAddForm();
    if (this.productService.selectedProduct) {
      this.updateFormValues();
    }
  }

  private initAddForm() {
    this.addProductForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      retail_price: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      brand: new FormControl('', [Validators.required]),
      color: new FormControl('', [Validators.required]),
      size: new FormControl([], [Validators.required]),
    });
  }

  public onSubmit(): void {
    if (this.addProductForm.valid) {
      console.log(this.addProductForm.value);
      this.productService.createProduct(this.addProductForm.value).subscribe((result: any) => {
        if (result.status === Constants.STATUS_SUCCESS) {
          this.initAddForm();
          this.router.navigateByUrl('');
        } else {
          alert(result.message.message);
        }
      });
    }
  }

  public addSize(size) {
    const sizeValues = this.addProductForm.controls.size.value;
    if (sizeValues.indexOf(size) === -1) {
      sizeValues.push(size);
    } else {
      sizeValues.splice(sizeValues.indexOf(size), 1);
    }
    this.addProductForm.controls.size.setValue(sizeValues);
  }

  private updateFormValues() {
    const product: ProductInterface = this.productService.selectedProduct;
    this.addProductForm.controls.name.setValue(product.name);
    this.addProductForm.controls.price.setValue(product.price);
    this.addProductForm.controls.retail_price.setValue(product.retail_price);
    this.addProductForm.controls.description.setValue(product.description);
    this.addProductForm.controls.category.setValue(product.category);
    this.addProductForm.controls.brand.setValue(product.brand);
    this.addProductForm.controls.color.setValue(product.color);
    this.addProductForm.controls.size.setValue(product.size);
  }

  public updateProduct() {
    const updatedProduct: ProductInterface = this.addProductForm.value;
    updatedProduct._id = this.productService.selectedProduct._id;
    this.productService.updateProduct(updatedProduct).subscribe((res) => {
      if (res.status === Constants.STATUS_SUCCESS) {
        this.addProductForm.reset();
        this.productService.selectedProduct = null;
        this.router.navigateByUrl('');
      } else {
        alert(res.message.message);
      }
    });
  }

  public clearForm() {
    this.addProductForm.reset();
    if (this.productService.selectedProduct) {
      this.productService.selectedProduct = null;
    }
    this.router.navigateByUrl('');
  }
}
