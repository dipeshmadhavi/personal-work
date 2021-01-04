import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MainRoutes } from '../Routing/Routing.MainRouting';
import { MasterComponent } from './Home.MasterPageComponent';
import { BrowserModule } from '@angular/platform-browser';
import { HomeComponent } from './Home.HomeComponent';
import { BaseLogger, EmailLogger, FileLogger } from '../Utility/Utility.Loggre';
import { HttpModule } from '@angular/http';
// import {} from ''

@NgModule({
  declarations: [MasterComponent, HomeComponent],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(MainRoutes),
    HttpModule
  ],
  providers: [
    {
      provide: BaseLogger,
      useClass: EmailLogger
    },
    {
      provide: '1',
      useClass: EmailLogger
    },
    {
      provide: '2',
      useClass: FileLogger
    }
  ],
  bootstrap: [MasterComponent]
})
export class HomeModule {}
