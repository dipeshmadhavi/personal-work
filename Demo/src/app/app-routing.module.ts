import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule',
  },
  {
    path: 'list',
    loadChildren: './list/list.module#ListPageModule',
  },
  {
    path: 'myapp',
    loadChildren: './myapp/myapp.module#MyappPageModule',
  },
  {
    path: 'poll',
    loadChildren: './poll/poll.module#PollPageModule',
  },
  {
    path: 'houses',
    loadChildren: './houses/houses.module#HousesPageModule',
  },
  { path: 'video-call', loadChildren: './video-call/video-call.module#VideoCallPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
