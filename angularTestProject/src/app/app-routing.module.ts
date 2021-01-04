import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FirstModuleComponent } from './first-module/first-module.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TemplateDrivenFormComponent } from './template-driven-form/template-driven-form.component';
import { CalenderComponent } from './calender/calender.component';
import { CalenderMonthsComponent } from './calender-months/calender-months.component';

const routes: Routes = [
  { path: '', component: FirstModuleComponent },
  { path: 'first', component: FirstModuleComponent },
  { path: 'calender', component: CalenderComponent },
  { path: 'tdf', component: TemplateDrivenFormComponent },
  { path: 'calender-month', component: CalenderMonthsComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
