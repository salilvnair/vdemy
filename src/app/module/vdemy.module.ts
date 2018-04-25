import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AuthComponent } from '../auth/auth.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { PlayerComponent } from '../player/player.component';
import { NavigationComponent } from '../navigation/navigation.component';
import { CourseComponent } from '../dashboard/course/course.component';
import { AddCourseComponent } from '../dashboard/course/add-course/add-course.component';
import { StartLectureComponent } from '../dashboard/course/start-lecture/start-lecture.component';
import { PlaylistComponent } from '../player/playlist/playlist.component';
import { HeaderComponent } from '../navigation/header/header.component';
import { SidenavComponent } from '../navigation/sidenav/sidenav.component';
import { LoginComponent } from '../auth/login/login.component';
import { SignupComponent } from '../auth/signup/signup.component';
import { EditCourseDialog } from '../dashboard/course/edit-course/edit-course-dialog';
import { TimeoutDialog } from '../auth/timeout/timeout-dialog.component';
import { VdemyRoutingModule } from '../route/vdemy.routing';
import { ExternalLibraryModules } from './external-libraries.module';
import { TimeoutDialogService } from '../auth/timeout/timeout-dialog.service';
import { DashboardService } from '../dashboard/service/dashboard.service';
import { AuthGuard } from '../auth/service/auth.guard';
import { AuthService } from '../auth/service/auth.service';

const DECLRATATIONS_EXPORT_ARRAY = [
  AuthComponent,
  DashboardComponent,
  PlayerComponent,
  NavigationComponent,
  CourseComponent,
  AddCourseComponent,
  EditCourseDialog,
  StartLectureComponent,
  PlaylistComponent,
  HeaderComponent,
  SidenavComponent,
  LoginComponent,
  SignupComponent,
  TimeoutDialog
];

const IMPORT_EXPORT_MODULE_ARRAY = [
  BrowserModule,
  FormsModule,
  VdemyRoutingModule,
  ExternalLibraryModules
];

const ENTRY_COMPONENTS_ARRAY = [EditCourseDialog, TimeoutDialog];

const PROVIDERS_ARRAY = [
  AuthService,
  AuthGuard,
  DashboardService,
  TimeoutDialogService
];

@NgModule({
  declarations: [DECLRATATIONS_EXPORT_ARRAY],
  providers: [PROVIDERS_ARRAY],
  entryComponents: [ENTRY_COMPONENTS_ARRAY],
  imports: [IMPORT_EXPORT_MODULE_ARRAY],
  exports: [IMPORT_EXPORT_MODULE_ARRAY, DECLRATATIONS_EXPORT_ARRAY]
})
export class VdemyModule {}
