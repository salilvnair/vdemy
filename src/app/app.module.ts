import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PlayerComponent } from './player/player.component';
import { NavigationComponent } from './navigation/navigation.component';
import { CourseComponent } from './dashboard/course/course.component';
import { AddCourseComponent } from './dashboard/course/add-course/add-course.component';
import { StartLectureComponent } from './dashboard/course/start-lecture/start-lecture.component';
import { PlaylistComponent } from './player/playlist/playlist.component';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavComponent } from './navigation/sidenav/sidenav.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { EditCourseDialog } from './dashboard/course/edit-course/edit-course-dialog';
import { VdemyRoutingModule } from './route/vdemy.routing';
import { AuthService } from './auth/service/auth.service';
import { AuthGuard } from './auth/service/auth.guard';
import { DashboardService } from './dashboard/service/dashboard.service';
import { TimeoutDialogService } from './auth/timeout/timeout-dialog.service';
import { TimeoutDialog } from './auth/timeout/timeout-dialog.component';
import { WatchmanModule } from './util/watchman/watchman.module';
import { ExternalLibraryModules } from './module/external-libraries.module';

@NgModule({
  declarations: [
    AppComponent,
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
  ],
  imports: [
    BrowserModule,
    FormsModule,
    VdemyRoutingModule,
    ExternalLibraryModules,
    WatchmanModule.init({ idleTime: 300, timeout: 60 })
  ],
  providers: [AuthService, AuthGuard, DashboardService, TimeoutDialogService],
  entryComponents: [EditCourseDialog, TimeoutDialog],
  bootstrap: [AppComponent]
})
export class AppModule {}
