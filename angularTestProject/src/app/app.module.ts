import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FirstModuleComponent } from './first-module/first-module.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TemplateDrivenFormComponent } from './template-driven-form/template-driven-form.component';
import { FormsModule } from '@angular/forms';
import { CalenderComponent } from './calender/calender.component';
import { CalenderMonthsComponent } from './calender-months/calender-months.component';
import { HZDatePickerModule } from 'ng2-hz-datepicker';

@NgModule({
  declarations: [
    AppComponent,
    FirstModuleComponent,
    PageNotFoundComponent,
    TemplateDrivenFormComponent,
    CalenderComponent,
    CalenderMonthsComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HZDatePickerModule.forRoot()],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
