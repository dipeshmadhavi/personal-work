import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  Http,
  Response,
  Headers,
  RequestOptions,
  HttpModule
} from '@angular/http';

import { CustomerRoutes } from '../Routing/Routing.CustomerRouting';
import { CustomerComponent } from '../Customer/Customer.CustomerComponent';
import { CommonModule } from '@angular/common';
import { GradePipes } from '../Utility/Utility.GradePipes';
import { GridComponent } from '../UserControl/UserControl.GrideComponent';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from '../Utility/Utility.token.interceptor';
import { provideForRootGuard } from '@angular/router/src/router_module';

@NgModule({
  declarations: [CustomerComponent, GradePipes, GridComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(CustomerRoutes),
    HttpModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],

  bootstrap: [CustomerComponent]
})
export class CustomerModule {}
