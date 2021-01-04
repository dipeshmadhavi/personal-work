import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SupplierRoutes } from '../Routing/Routing.SupplierRouting';
import { SupplierComponent } from '../Suppliers/Supplier.SupplierComponent';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'ng2-file-upload';
import { HttpClient } from 'selenium-webdriver/http';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [SupplierComponent],
  imports: [
    CommonModule,
    FormsModule,
    FileUploadModule,
    HttpClientModule,
    RouterModule.forChild(SupplierRoutes)
  ],
  providers: [],
  bootstrap: [SupplierComponent]
})
export class SupplierModule {}
