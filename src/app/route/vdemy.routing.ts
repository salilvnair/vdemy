import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../auth/login/login.component';
import { SignupComponent } from '../auth/signup/signup.component';
import { AddCourseComponent } from '../dashboard/course/add-course/add-course.component';
import { PlayerComponent } from '../player/player.component';
import { AuthGuard } from '../auth/service/auth.guard';
import { DashboardComponent } from '../dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add_course',
    component: AddCourseComponent,
    canActivate: [AuthGuard]
  },
  { path: 'play', component: PlayerComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class VdemyRoutingModule {}
