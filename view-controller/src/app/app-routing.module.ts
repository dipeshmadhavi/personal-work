import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewOneComponent } from './view-one/view-one.component';
import { ViewTwoComponent } from './view-two/view-two.component';
import { ViewThreeComponent } from './view-three/view-three.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: ViewOneComponent,
  // },
  // {
  //   path: 'one',
  //   component: ViewOneComponent,
  // },
  // {
  //   path: 'two',
  //   component: ViewTwoComponent,
  // },
  // {
  //   path: 'three',
  //   component: ViewThreeComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
