import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCourseComponent } from '../dashboard/course/add-course/add-course.component';
import { PlayerComponent } from '../player/player.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { OnRouterNavigateGuard } from '../util/router/service/router-navigate.guard';
import { ConfigComponent } from '../config/config.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  {
    path: 'config',
    component: ConfigComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'add_course',
    component: AddCourseComponent
  },
  {
    path: 'play',
    component: PlayerComponent,
    canDeactivate: [OnRouterNavigateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [OnRouterNavigateGuard]
})
export class VdemyRoutingModule {}
