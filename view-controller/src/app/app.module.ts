import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MdePopoverModule } from '@material-extended/mde';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ViewOneComponent } from './view-one/view-one.component';
import { ViewTwoComponent } from './view-two/view-two.component';
import { ViewThreeComponent } from './view-three/view-three.component';

@NgModule({
  declarations: [AppComponent, ViewOneComponent, ViewTwoComponent, ViewThreeComponent],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, FormsModule, MdePopoverModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
