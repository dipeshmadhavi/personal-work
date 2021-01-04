import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { HousesPage } from './houses.page';
import { SpartanPage } from './spartan/spartan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HousesPage,
      },
      {
        path: 'spartan',
        component: SpartanPage,
      },
    ]),
  ],
  declarations: [HousesPage, SpartanPage],
})
export class HousesPageModule {}
